import logging
from pathlib import Path

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

_log = logging.getLogger(__name__)
graph_router = APIRouter(tags=["Graph"])

BASE_PATH = Path(__file__).parent
graph_data = pd.read_csv(BASE_PATH / "data/STRINGv11_OTAR281119_FILTER_combined.csv.gz", compression="gzip")
trait_data = pd.read_csv(BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip")
gene_data = pd.read_csv(BASE_PATH / "data/gwas_nodes.csv.gz", compression="gzip")


@graph_router.get("/autocomplete")
def autocomplete(search: str, limit: int | None = 10) -> list[str]:
    full_data = pd.concat([graph_data["ENSG_A"], trait_data["disease"]]).unique().tolist()
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


@graph_router.get("/gene2genes")
def gene2genes(gene: str | None = None, limit: int = 1000) -> list[GeneResponse]:
    df = graph_data
    if gene:
        df = df[(df["ENSG_A"] == gene) & (df["ENSG_B"] != gene)]
    if not df.empty:
        # df = removeDuplicates(df) TODO: remove duplicates genes
        df = setGeneNamesFromGeneDf(df)
    return df.head(limit).to_dict(orient="records")  # type: ignore


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
        df = setGeneNamesFromTraitDf(df)
    return df.head(limit).to_dict(orient="records")  # type: ignore


@graph_router.get("/gene")
def singleGene(gene: str) -> list[GeneResponse]:
    df = graph_data.head(1).copy()
    df.loc[0, "ENSG_A"] = gene
    df.loc[0, "ENSG_B"] = gene
    df = setGeneNamesFromGeneDf(df)
    return df.to_dict(orient="records")  # type: ignore


def gene2trait(df: pd.DataFrame, gene: str | None = None, limit: int = 1000) -> list[TraitResponse]:
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


def setGeneNamesFromTraitDf(df: pd.DataFrame):
    df["gene_name"] = df["gene"].apply(getGeneName)
    return df


def setGeneNamesFromGeneDf(df: pd.DataFrame):
    df = setFromGeneName(df)
    df["ENSG_B_name"] = df["ENSG_B"].apply(getGeneName)
    return df


def getGeneName(ensg: str):
    entry = gene_data[gene_data["ENSG"] == ensg]
    if entry.empty:
        return "Gene not found"
    return entry.iloc[0, 2]


def setFromGeneName(df: pd.DataFrame, isTraitResponse=False):
    ensg = df.iloc[0, 0]
    if isTraitResponse:
        df["gene_name"] = getGeneName(ensg)
    else:
        df["ENSG_A_name"] = getGeneName(ensg)
    return df