import logging
from pathlib import Path

import networkx as nx
import numpy as np
import pandas as pd
import glob
from fastapi import APIRouter
from enum import Enum
from pydantic import BaseModel, typing

_log = logging.getLogger(__name__)
graph_router = APIRouter(tags=["Graph"])

BASE_PATH = Path(__file__).parent
gene_names = pd.read_csv(BASE_PATH / "data/gwas_nodes.csv.gz", compression="gzip")


class NodeType(Enum):
    GENE = 1
    DISEASE = 2
    DRUG = 3


# might not be needed if we get the name from gene_list.json / gene_descriptions.json
def getGeneName(ensg: str):
    entry = gene_names[gene_names["ENSG"] == ensg]
    if entry.empty:
        return "Gene not found"
    return entry.iloc[0, 2]


# might not be needed if we get the name from gene_list.json / gene_descriptions.json
def setGeneNamesFromGeneDf(df: pd.DataFrame, isTraitResponse=False):
    ensg = df.iloc[0, 0]
    # if isTraitResponse:
    #     df["gene_name"] = getGeneName(ensg)
    # else:
    #     df["ENSG_A_name"] = getGeneName(ensg)

    df["ENSG_B_name"] = df["ENSG_B"].apply(getGeneName)
    return df


gene_list = (
    pd.read_json("app_template/data/gene_list.json")
    .drop(columns=["hgncId", "hgncSymbol"], axis=1)
    .rename(columns={"ensemblid": "id"})
)
gene_details = (
    pd.read_json("app_template/data/gene_descriptions.json")
    .drop(columns=["fullname"], axis=1)
    .rename(columns={"entrezGeneId": "entrezId"})
)
gene_data = pd.merge(gene_list, gene_details, on="entrezId")
gene_data["type"] = NodeType.GENE

trait_data = (
    pd.read_csv(BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip")
    .drop(columns=["gene", "padj"])
    .rename(columns={"disease": "id"})
)
trait_data["type"] = NodeType.DISEASE

# TODO get trait names via API calls
drug_data = trait_data[trait_data["id"].str.contains("CHEBI")].copy()
drug_data["type"] = NodeType.DRUG
disease_data = trait_data[~trait_data["id"].str.contains("CHEBI")].copy()

nodes = pd.concat([gene_data, disease_data, drug_data], axis=0, ignore_index=True)

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
    pd.read_json("app_template/data/gene_list.json")
    .drop(columns=["hgncId", "hgncSymbol"], axis=1)
    .rename(columns={"ensemblid": "id"})
)
gene_details = (
    pd.read_json("app_template/data/gene_descriptions.json")
    .drop(columns=["fullname"], axis=1)
    .rename(columns={"entrezGeneId": "entrezId"})
)
gene_nodes = pd.merge(gene_list, gene_details, on="entrezId")
gene_nodes["type"] = NodeType.GENE

trait_nodes = (
    pd.read_csv(BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip")
    .drop(columns=["gene", "padj"])
    .rename(columns={"disease": "id"})
)
trait_nodes["type"] = NodeType.DISEASE

# TODO get trait names via API calls
drug_nodes = trait_nodes[trait_nodes["id"].str.contains("CHEBI")].copy()
drug_nodes["type"] = NodeType.DRUG
disease_nodes = trait_nodes[~trait_nodes["id"].str.contains("CHEBI")].copy()
drug_nodes["synonyms"] = np.empty((len(drug_nodes), 0)).tolist()
disease_nodes["synonyms"] = np.empty((len(disease_nodes), 0)).tolist()


allNodes = pd.concat([gene_nodes, disease_nodes, drug_nodes], axis=0, ignore_index=True)


@graph_router.get("/autocomplete")
def autocomplete(search: str, limit: int | None = 10) -> list[str]:
    full_data = (
        pd.concat([graph_data["ENSG_A"], trait_data["disease"]]).unique().tolist()
    )
    return [s for s in full_data if search.lower() in s.lower()][:limit]


class GeneResponse(BaseModel):
    ENSG_A: str
    ENSG_B: str
    combined_score: float
    ENSG_A_name: str
    ENSG_B_name: str


class TraitResponse(BaseModel):
    gene: str
    padj: float
    disease: str
    gene_name: str


class Edge(BaseModel):
    id: str
    source: str
    target: str


class PositionType(BaseModel):
    x: float
    y: float


class NodeInfo(BaseModel):
    entrezId: int
    # label: str #symbol
    name: str  # fullname
    summary: str
    synonyms: list[str]


class Node(BaseModel):
    id: str
    entrezId: str
    # label: str #symbol
    name: str  # fullname
    summary: str
    synonyms: list[str]
    position: PositionType | None
    type: NodeType


class Gene2AllResponse(BaseModel):
    nodes: list[Node]
    edges: list[Edge]


@graph_router.get("/gene2genes")
def gene2genes(gene: str | None = None, limit: int = 1000) -> list[Node] | None:
    # df = graph_data
    # if gene:
    #     df = df[(df["ENSG_A"] == gene) & (df["ENSG_B"] != gene)]
    # if not df.empty:
    #     df = setGeneNamesFromGeneDf(df)
    # return df.head(limit).to_dict(orient="records")# type: ignore
    n = allNodes[allNodes["id"] == gene]
    nDict = n.to_dict(orient="records")
    return nDict


@graph_router.get("/gene2diseases")
def gene2diseases(gene: str | None = None, limit: int = 1000) -> list[TraitResponse]:
    df = trait_data[~trait_data["disease"].str.contains("CHEBI")]
    return gene2trait(df, gene, limit)


@graph_router.get("/gene2drugs")
def gene2drugs(gene: str | None = None, limit: int = 1000) -> list[TraitResponse]:
    df = trait_data[trait_data["disease"].str.contains("CHEBI")]
    return gene2trait(df, gene, limit)


@graph_router.get("/trait2genes")
def trait2genes(disease: str | None = None, limit: int = 1000) -> list[TraitResponse]:
    df = trait_data
    if disease:
        df = df[df["disease"] == disease]
    if not df.empty:
        df = removeDuplicates(df)
        df["gene_name"] = df["gene"].apply(getGeneName)
    return df.head(limit).to_dict(orient="records")  # type: ignore


@graph_router.get("/gene")
def singleGene(gene: str) -> list[GeneResponse]:
    df = graph_data.head(1).copy()
    df.loc[0, "ENSG_A"] = gene
    df.loc[0, "ENSG_B"] = gene
    df = setGeneNamesFromGeneDf(df)
    return df.to_dict(orient="records")  # type: ignore


def gene2trait(
    df: pd.DataFrame, gene: str | None = None, limit: int = 1000
) -> list[TraitResponse]:
    if gene:
        df = df[df["gene"] == gene]
    if not df.empty:
        df = removeDuplicates(df)
        df = setFromGeneName(df, True)
    return df.head(limit).to_dict(orient="records")  # type: ignore


def removeDuplicates(df: pd.DataFrame):
    df = df.sort_values(["disease", "padj"], ascending=[True, False])
    df = df.drop_duplicates(subset=["gene", "disease"], keep="first")
    return df


def setFromGeneName(df: pd.DataFrame, isTraitResponse=False):
    ensg = df.iloc[0, 0]
    # if isTraitResponse:
    #     df["gene_name"] = getGeneName(ensg)
    # else:
    #     df["ENSG_A_name"] = getGeneName(ensg)
    return df


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
        df = df[(df["gene"] == gene)]
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
