import logging
from pathlib import Path

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

_log = logging.getLogger(__name__)
graph_router = APIRouter(tags=["Graph"])

graph_data = pd.read_csv(Path(__file__).parent / "data/STRINGv11_OTAR281119_FILTER_combined.csv.gz", compression="gzip")
trait_data = pd.read_csv(Path(__file__).parent / "data/gwas_gene-diseases.csv.gz", compression="gzip")


@graph_router.get("/autocomplete")
def autocomplete(search: str, limit: int | None = 10) -> list[str]:
    full_data = graph_data["ENSG_A"].unique().tolist() + trait_data["disease"].unique().tolist()
    return [s for s in full_data if search.lower() in s.lower()][:limit]


class GraphResponse(BaseModel):
    ENSG_A: str
    ENSG_B: str
    combined_score: float


class TraitResponse(BaseModel):
    gene: str
    padj: float
    disease: str
    # name: str


@graph_router.get("/gene2genes")
def gene2genes(gene: str | None = None, limit: int = 1000) -> list[GraphResponse]:
    df = graph_data
    if gene:
        df = graph_data[graph_data["ENSG_A"] == gene]
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
    df = removeDuplicates(df)
    return df.head(limit).to_dict(orient="records")  # type: ignore


def gene2trait(df: pd.DataFrame, gene: str | None = None, limit: int = 1000) -> list[TraitResponse]:
    if gene:
        df = df[df["gene"] == gene]
    df = removeDuplicates(df)
    return df.head(limit).to_dict(orient="records")  # type: ignore


def removeDuplicates(df: pd.DataFrame):
    df = df.sort_values(["disease", "padj"], ascending=[True, False])
    df = df.drop_duplicates(subset=["gene", "disease"], keep="first")
    return df
