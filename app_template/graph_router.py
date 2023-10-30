import logging
from pathlib import Path

import networkx as nx
import numpy as np
import pandas as pd
from fastapi import APIRouter
from enum import Enum
from pydantic import BaseModel, typing

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
    summary: str
    synonyms: list[str]
    position: PositionType | None
    type: str


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
graph_data = pd.read_csv(
    BASE_PATH / "data/STRINGv11_OTAR281119_FILTER_combined.csv.gz", compression="gzip"
)
trait_data = pd.read_csv(
    BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip"
)

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


# takes search string and checks if it is part of a nodes id or name
@graph_router.get("/autocomplete")
def autocomplete(search: str, limit: int | None = 10) -> list[str]:
    # TODO implement nicer version (might look similar to the following line)
    # df = allNodes[allNodes[(search in allNodes["id"]) | (search in allNodes["name"])| (search in allNodes["entrezId"])]]

    ids = allNodes["id"].values.tolist()
    names = allNodes["name"].values.tolist()

    results = []

    # check if passed search parameter is part of a nodes id
    for ele in ids:
        if search.lower() in str(ele).lower():
            results.append(ele)

    # check if passed search parameter is part of a nodes name
    for ele in names:
        if search.lower() in str(ele).lower():
            results.append(str(ele))

    return results[:limit]


@graph_router.get("/gene2all")
def gene2all(gene: str | None = None, limit: int = 1000) -> Gene2AllResponse | None:
    # get gene2gene edges
    # get gene2gene edges
    df = graph_data
    d = []

    if gene:
        df = df[(df["ENSG_A"] == gene) & (df["ENSG_B"] != gene)].copy()
        df.rename(columns={"ENSG_A": "source", "ENSG_B": "target"}, inplace=True)
        df = df.drop("combined_score", axis=1)
        d = df.head(limit).to_dict(orient="records")

        # get traits
        df = trait_data
        df = df[(df["gene"] == gene) | (df["disease"] == gene)]
        df.rename(columns={"gene": "source", "disease": "target"}, inplace=True)
        df = df.drop("padj", axis=1)
        t = df.head(limit).to_dict(orient="records")

        for ele in t:
            d.append(ele)

        tup_e = []
        tup_n = []

        # add id column
        for ele in d:
            ele["id"] = ele["source"] + "-" + ele["target"]
            if ele["source"] not in tup_n:
                tup_n.append(ele["source"])
            if ele["target"] not in tup_n:
                tup_n.append(ele["target"])

            tup_e.append((ele["source"], ele["target"]))

        # layouting using the networkx package
        G = nx.Graph()
        G.add_nodes_from(tup_n)
        G.add_edges_from(tup_e)
        positions = nx.spring_layout(G)

        nodes = []
        # TODO vlt gibts bei Dataframe was cooleres
        # add positions to nodes
        for node in tup_n:
            n = allNodes[allNodes["id"] == node]
            nDict = n.to_dict(orient="records")
            if len(nDict) > 0:
                nDict[0]["position"] = {
                    "x": positions[node][0],
                    "y": positions[node][1],
                }
                nodes.append(nDict[0])

        # remove duplicate edges list comprehension
        removed_dup_edg = []
        for edge in d:
            if edge not in removed_dup_edg:
                removed_dup_edg.append(edge)

        return Gene2AllResponse(nodes=nodes, edges=removed_dup_edg)
