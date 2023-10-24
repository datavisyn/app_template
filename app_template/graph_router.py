import logging
from pathlib import Path

import math
import networkx as nx
import numpy as np
import pandas as pd
import glob
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

gene_list = (
    pd.read_json(BASE_PATH / "data/gene_list.json")
    .drop(columns=["hgncId", "hgncSymbol"], axis=1)
    .rename(columns={"ensemblid": "id"})
)

gene_list = gene_list[gene_list["id"].notna()]
gene_details = (
    pd.read_json(BASE_PATH / "data/gene_descriptions.json")
    .drop(columns=["fullname"], axis=1)
    .rename(columns={"entrezGeneId": "entrezId"})
)
gene_nodes = pd.merge(gene_list, gene_details, on="entrezId")
gene_nodes["type"] = "gene"
gene_nodes = gene_nodes.fillna('NaN')

trait_nodes = (removeDuplicates(pd.read_csv(BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip"))
    .drop(columns=["gene", "padj"])
    .rename(columns={"disease": "id"}))

trait_nodes["type"] = "disease"


# TODO get trait names via API calls
drug_nodes = trait_nodes[trait_nodes["id"].str.contains("CHEBI")].copy()
drug_nodes["type"] = "drug"
disease_nodes = trait_nodes[~trait_nodes["id"].str.contains("CHEBI")].copy()
drug_nodes["synonyms"] = np.empty((len(drug_nodes), 0)).tolist()
disease_nodes["synonyms"] = np.empty((len(disease_nodes), 0)).tolist()

allNodes = pd.concat([gene_nodes, disease_nodes, drug_nodes], axis=0, ignore_index=True)


@graph_router.get("/autocomplete")
def autocomplete(search: str, limit: int | None = 10) -> list[str]:
    #TODO implement nicer version (might look similar to the following line)
    #df = allNodes[allNodes[(search in allNodes["id"]) | (search in allNodes["name"])| (search in allNodes["entrezId"])]]

    ids = allNodes["id"].values.tolist()
    names = allNodes["name"].values.tolist()
    
    results = []
    
    for ele in ids:
        if search.lower() in str(ele).lower():
            results.append(ele)
    
    for ele in names:
        if  search.lower() in str(ele).lower():
            results.append(str(ele))
    
    return results[:limit]

@graph_router.get("/gene2all")
def gene2all(gene: str | None = None, limit: int = 1000) -> Gene2AllResponse | None:
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

        G = nx.Graph()
        G.add_nodes_from(tup_n)
        G.add_edges_from(tup_e)
        positions = nx.spring_layout(G)

        nodes = []
        # TODO vlt gibts bei Dataframe was cooleres
        for node in tup_n:
            n = allNodes[allNodes["id"] == node]
            nDict = n.to_dict(orient="records")
            if len(nDict) > 0:
                nDict[0]["position"] = {
                    "x": positions[node][0],
                    "y": positions[node][1],
                }
                nodes.append(nDict[0])

        rValue = dict()
        rValue["nodes"] = nodes

        # remove duplicate edges
        removed_dup_edg = []
        for edge in d:
            if edge not in removed_dup_edg:
                removed_dup_edg.append(edge)

        rValue["edges"] = removed_dup_edg

        return rValue
