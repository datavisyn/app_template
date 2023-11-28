import logging
from pathlib import Path

import networkx as nx
import numpy as np
import pandas as pd
from fastapi import APIRouter, Query
from enum import Enum
from pydantic import BaseModel, typing
from trait_info import get_diseaseOrDrug_name

_log = logging.getLogger(__name__)
graph_router = APIRouter(tags=["Graph"])


class Edge(BaseModel):
    id: str
    source: str
    target: str


class PositionType(BaseModel):
    x: float
    y: float


class Node(BaseModel):
    id: str
    entrezId: str
    name: str  # fullname
    symbol: str | None
    summary: str
    synonyms: list[str]
    position: PositionType | None
    type: str
    children: list[str]
    parents: list[str]


class Gene2AllResponse(BaseModel):
    nodes: list[Node]
    edges: list[Edge]


def removeDuplicates(df: pd.DataFrame):
    df = df.sort_values(["disease", "padj"], ascending=[True, False])
    df = df.drop_duplicates(subset=["disease"], keep="first")
    return df


BASE_PATH = Path(__file__).parent

# add file globals
gene_names = pd.read_csv(BASE_PATH / "data/gwas_nodes.csv.gz", compression="gzip")
geneEdges = (
    pd.read_csv(BASE_PATH / "data/STRINGv11_OTAR281119_FILTER_combined.csv.gz", compression="gzip")
    .drop(columns=["combined_score"], axis=1)
    .rename(columns={"ENSG_A": "source", "ENSG_B": "target"})
)
traitEdges = (
    pd.read_csv(BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip")
    .drop(columns=["padj"], axis=1)
    .rename(columns={"gene": "source", "disease": "target"})
)
allEdges = pd.concat([geneEdges, traitEdges], axis=0)
allEdges["id"] = allEdges["source"]+"_"+allEdges["target"]

# dropping not needed columns, renaming ensamble id to just id
gene_list = (
    pd.read_json(BASE_PATH / "data/gene_list.json")
    .drop(columns=["hgncId", "hgncSymbol"], axis=1)
    .rename(columns={"ensemblid": "id"})
)

# removing entries with an empty id (ensemblid)
gene_list = gene_list[gene_list["id"].notna()]
gene_details = (
    pd.read_json(BASE_PATH / "data/gene_descriptions.json")
    .drop(columns=["fullname"], axis=1)
    .rename(columns={"entrezGeneId": "entrezId"})
)
# adding further gene details to gene id,
gene_nodes = pd.merge(gene_list, gene_details, on="entrezId")
gene_nodes["type"] = "gene"
gene_nodes = gene_nodes.fillna("NaN")

trait_nodes = (
    removeDuplicates(
        pd.read_csv(BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip")
    )
    .drop(columns=["gene", "padj"])
    .rename(columns={"disease": "id"})
)

trait_nodes["type"] = "disease"
# traits don't have synonyms, but the column is needed for mergen them into allNodes later
trait_nodes["synonyms"] = np.empty((len(trait_nodes), 0)).tolist()

# TODO get trait names via API calls
# .copy is needed to prevent "SettingwithCopyWarning
# all drug ids start with CHEBI
drug_nodes = trait_nodes[trait_nodes["id"].str.contains("CHEBI")].copy()
drug_nodes["type"] = "drug"
# all other entries (not starting with CHEBI) are diseases
disease_nodes = trait_nodes[~trait_nodes["id"].str.contains("CHEBI")].copy()

# combining different node types into one dataframe
allNodes = pd.concat([gene_nodes, disease_nodes, drug_nodes], axis=0, ignore_index=True)
allNodes["children"] = np.empty((len(allNodes), 0)).tolist()
allNodes["parents"] = np.empty((len(allNodes), 0)).tolist()

# takes search string and checks if it is part of a nodes id or name


@graph_router.get("/autocomplete")
def autocomplete(search: str, limit: int | None = 10) -> list[list[str]]:
    # TODO implement nicer version (might look similar to the following line)
    # df = allNodes[allNodes[(search in allNodes["id"]) | (search in allNodes["name"])| (search in allNodes["entrezId"])]]

    symbols = allNodes["symbol"].values.tolist()
    ids = allNodes["id"].values.tolist()
    names = allNodes["name"].values.tolist()

    results = []

    # check if passed search parameter is part of a nodes id
    for id, symbol, name in zip(ids, symbols, names):
        pattern = search.lower()
        if pattern in str(symbol).lower():
            results.append([symbol, id, name])
        elif pattern in str(id).lower():
            results.append([symbol, id, name])
        elif pattern in str(name).lower():
            results.append([symbol, id, name])

    return results[:limit]


@graph_router.get("/expand")
def expand(geneIds: list[str] = Query(), limit: int = 1000) -> Gene2AllResponse | None:
    # empty children/parents lists (since we don't know if a node got hidden)
    allNodes["children"] = np.empty((len(allNodes), 0)).tolist()
    allNodes["parents"] = np.empty((len(allNodes), 0)).tolist()

    # variables for accumulating data
    allFilteredNodes = set()
    allEdgesResult = pd.DataFrame()
    allNodesResult = pd.DataFrame()
    allLayoutedEdges = set()

    # find nodes connected to the geneIds
    for geneId in geneIds:
        if geneId:
            # find edges containing geneId
            edges = allEdges[
                (allEdges["source"] == geneId) | (allEdges["target"] == geneId)
            ]

            filteredNodes = []
            # add all nodes occuring in the filtered edges to a list
            for ele in edges.head(limit).to_dict(orient="records"):
                # add id column
                ele["id"] = ele["source"] + "-" + ele["target"]
                if ele["source"] not in filteredNodes:
                    filteredNodes.append(ele["source"])
                if ele["target"] not in filteredNodes:
                    filteredNodes.append(ele["target"])
            # if gene has no connections a the gene 
            if len(filteredNodes) == 0:
                node = allNodes.loc[allNodes['id'] == geneId].iloc[0]
                filteredNodes.append(node["id"])

            allFilteredNodes.update(filteredNodes)

            # only remove passed geneId if it has connections to other nodes
            if len(filteredNodes) > 1:
                filteredNodes.remove(geneId)

            # add current geneId as parent for all nodes aquired in the steps before
            nodes = allNodes[allNodes["id"].isin(filteredNodes)]
            nodes["parents"].apply(lambda lst: lst.append(geneId))

            # set all children for current geneId-Node
            parent = allNodes[allNodes["id"] == geneId]
            parent["children"].apply(lambda lst: lst.extend(filteredNodes))
            allNodesResult = pd.concat([allNodesResult, parent, nodes])

    # remove possible duplicates
    allNodesResult = allNodesResult.drop_duplicates(subset=["id"], keep="last")
    if len(allNodesResult) != 0:
        # make list of node ids
        nodeIdList = allNodesResult["id"].tolist()
        # select edges where both source and target (being an id) occure in nodeIdList
        edges = allEdges[((allEdges["source"].isin(nodeIdList)) & (allEdges["target"].isin(nodeIdList)))]
        allEdgesResult = pd.concat([allEdgesResult, edges])
    
    layoutedEdges = []
    # drop duplicates
    # TODO: maybe drop duplicates where source & target are switched
    if allEdgesResult is not None:
        allEdgesResult = allEdgesResult.drop_duplicates(subset=["source", "target"], keep="first")
    for ele in allEdgesResult.to_dict(orient="records"):
        ele["id"] = ele["source"] + "-" + ele["target"]
        layoutedEdges.append((ele["source"], ele["target"]))

    allLayoutedEdges.update(layoutedEdges)

    # layouting using the networkx package
    G = nx.Graph()
    G.add_nodes_from(allFilteredNodes)
    G.add_edges_from(allLayoutedEdges)
    positions = nx.spring_layout(G)

    allNodesResultList = []
    # TODO vlt gibts bei Dataframe was cooleres
    # add positions to nodes
    for node in allNodesResult.to_dict('records'):
        if len(node) > 0:
            node["position"] = {
                "x": positions[node["id"]][0],
                "y": positions[node["id"]][1],
            }
            allNodesResultList.append(node)

    # remove duplicate edges list comprehension
    if allEdgesResult is not None:
        allEdgesResult = allEdgesResult.drop_duplicates(subset=["source", "target"], keep="first")
    edgeList = []
    for index, row in allEdgesResult.iterrows():
        edgeList.append(Edge(id=row["id"], source=row["source"], target=row["target"]))

    return Gene2AllResponse(nodes=allNodesResultList, edges=edgeList)

# additional trait (disease/drug) information

@graph_router.get("/traitinfo/{trait_id}")
def get_trait_info(trait_id: str):
    name_info = get_diseaseOrDrug_name(trait_id)
    # extraction of name and result
    name = name_info["name"]
    description = name_info["description"]

    # create a response JSON with both name and description
    response = {
        "name": name,
        "summary": description
    }

    return response


# # whole name for genes

# @graph_router.get("/geneinfo/{gene_id}")
# def get_gene(gene_id: str):
#     name = get_gene_name(gene_id)
#     gene_info = get_gene_info(gene_id)
    
#     # check whether gene was found
#     if isinstance(gene_info, str):
#         return gene_info

#     return {
#         "Gene Name": name,
#         "Transcript Product": gene_info.get("Transcript Product"),
#         "Chromosome Location": gene_info.get("Chromosome Location")
#     }