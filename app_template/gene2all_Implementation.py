from pathlib import Path
import pandas as pd


BASE_PATH = Path(__file__).parent

# add file globals
gene_names = pd.read_csv(BASE_PATH / "data/gwas_nodes.csv.gz", compression="gzip")
graph_data = pd.read_csv( BASE_PATH / "data/STRINGv11_OTAR281119_FILTER_combined.csv.gz", compression="gzip")
trait_data = pd.read_csv(BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip")


def gene2all(gene: str | None = None, limit: int = 1000):
    df = graph_data
    if gene:
        df = df[(df["ENSG_A"] == gene) & (df["ENSG_B"] != gene)]
    print(df.head(1).to_dict(orient="records"))

gene2all("ENSG00000186628")