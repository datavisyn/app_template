import logging
from pathlib import Path

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel

_log = logging.getLogger(__name__)
gene2drugs_router = APIRouter(tags=["Graph"])

graph_data = pd.read_csv(Path(__file__).parent / "data/gwas_gene-diseases.csv.gz", compression="gzip")

class DiseaseResponse(BaseModel):
    gene: str
    padj: float
    disease: str

@gene2drugs_router.get("/gene2drugs")
def gene2drugs(gene: str | None = None, limit: int = 1000) -> list[DiseaseResponse]:
    df = graph_data[graph_data["disease"].str.contains("CHEBI")]
    if gene:
        df = graph_data[graph_data["gene"]==gene]
    return df.head(limit).to_dict(orient="records")  # type: ignore
