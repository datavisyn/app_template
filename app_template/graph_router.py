import logging
from pathlib import Path

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

_log = logging.getLogger(__name__)
graph_router = APIRouter(tags=["Graph"])

graph_data = pd.read_csv(Path(__file__).parent / "data/STRINGv11_OTAR281119_FILTER_combined.csv.gz", compression="gzip")
trait_data = pd.read_csv(Path(__file__).parent / "data/gwas_gene-diseases.csv.gz", compression="gzip")
gene_data = pd.read_csv(Path(__file__).parent / "data/gwas_nodes.csv.gz", compression="gzip")


@graph_router.get("/autocomplete")
def autocomplete(search: str, limit: int | None = 10) -> list[str]:
    full_data = graph_data["ENSG_A"].unique().tolist() + trait_data["disease"].unique().tolist()
    return [s for s in full_data if search.lower() in s.lower()][:limit]


class GraphResponse(BaseModel):
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


@graph_router.get("/gene2genes")
def gene2genes(gene: str | None = None, limit: int = 1000) -> list[GraphResponse]:
    df = graph_data
    if gene:
        df = graph_data[graph_data["ENSG_A"] == gene]
    if df.size > 0: 
        df = setGeneNamesFromGeneDf(df)
    return df.head(limit).to_dict(orient="records")  # type: ignore


@graph_router.get("/gene2diseases")
def gene2diseases(gene: str | None = None, limit: int = 1000) -> list[TraitResponse]:
    df = trait_data[trait_data["disease"].str.contains("CHEBI") == False]
    return gene2trait(df, gene, limit)


@graph_router.get("/gene2drugs")
def gene2drugs(gene: str | None = None, limit: int = 1000) -> list[TraitResponse]:
    df = trait_data[trait_data["disease"].str.contains("CHEBI")]
    return gene2trait(df, gene, limit)


@graph_router.get("/trait2genes")
def trait2genes(disease: str | None = None, limit: int = 1000) -> list[TraitResponse]:
    df = trait_data
    if disease:
        df = trait_data[trait_data["disease"] == disease]
    if df.size > 0:
        df = removeDuplicates(df)
        df = setGeneNamesFromTraitDf(df)
    return df.head(limit).to_dict(orient="records")  # type: ignore


def gene2trait(df: pd.DataFrame, gene: str | None = None, limit: int = 1000) -> list[TraitResponse]:
    if gene:
        df = df[df["gene"] == gene]
    if df.size > 0:
        df = removeDuplicates(df)
        df = setFromGeneName(df, True)
    return df.head(limit).to_dict(orient="records")  # type: ignore


def removeDuplicates(df: pd.DataFrame):
    df = df.sort_values(["disease", "padj"], ascending=[True, False])
    df = df.drop_duplicates(subset=["gene", "disease"], keep="first")
    return df

def setGeneNamesFromTraitDf(df: pd.DataFrame):
    names = []
    for index, row in df.iterrows():
        names.append(getGeneName(row["gene"]))
    df = df.assign(gene_name=names)
    return df

def setGeneNamesFromGeneDf(df: pd.DataFrame):
    df = setFromGeneName(df)
    names_b = []
    for index, row in df.iterrows():
        names_b.append(getGeneName(row["ENSG_B"]))
    df = df.assign(ENSG_B_name=names_b)
    return df

def getGeneName(ensg: str):
    return gene_data[gene_data["ENSG"] == ensg].values[0][2]

def setFromGeneName(df: pd.DataFrame, isTraitResponse = False):
    ensg = df.values[0][0]
    if isTraitResponse:
        df = df.assign(gene_name=getGeneName(ensg))
    else:
        df = df.assign(ENSG_A_name=getGeneName(ensg))
    return df
