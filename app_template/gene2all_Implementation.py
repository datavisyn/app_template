from pathlib import Path
import pandas as pd
import networkx as nx
from enum import Enum


class NodeType(Enum):
    GENE = 1
    DISEASE = 2
    DRUG = 3


class PositionType:
    x: int
    y: int 
    
BASE_PATH = Path(__file__).parent

# add file globals
gene_names = pd.read_csv(BASE_PATH / "data/gwas_nodes.csv.gz", compression="gzip")
graph_data = pd.read_csv(
    BASE_PATH / "data/STRINGv11_OTAR281119_FILTER_combined.csv.gz", compression="gzip"
)
trait_data = pd.read_csv(
    BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip"
)

gene_list = pd.read_json('app_template/data/gene_list.json').drop(columns=['hgncId','hgncSymbol'], axis=1).rename(columns={'ensemblid':'id'})
gene_details = pd.read_json('app_template/data/gene_descriptions.json').drop(columns=['fullname'], axis=1).rename(columns={'entrezGeneId': 'entrezId'})
gene_nodes = pd.merge(gene_list, gene_details, on='entrezId')
gene_nodes['type'] = NodeType.GENE

trait_nodes = (
    pd.read_csv(BASE_PATH / "data/gwas_gene-diseases.csv.gz", compression="gzip")
    .drop(columns=['gene', 'padj'])
    .rename(columns={'disease':'id'})
)
trait_nodes['type'] = NodeType.DISEASE

#TODO get trait names via API calls
drug_nodes = trait_nodes[trait_nodes["id"].str.contains("CHEBI")].copy()
drug_nodes['type'] = NodeType.DRUG
disease_nodes = trait_nodes[~trait_nodes["id"].str.contains("CHEBI")].copy()

allNodes = pd.concat([gene_nodes, disease_nodes, drug_nodes], axis=0, ignore_index=True)


def gene2all(gene: str | None = None, limit: int = 1000):
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
                
            tup_e.append((ele["source"],ele["target"]))

        G = nx.Graph()
        G.add_nodes_from(tup_n)
        G.add_edges_from(tup_e)
        positions = nx.spring_layout(G)
        
        nodes = []
        #TODO vlt gibts bei Dataframe was cooleres 
        for node in tup_n:
            n = allNodes[allNodes["id"] == node]
            nDict = n.to_dict(orient="records")
            #nDict[0]["position"]={'x': 1,'y': 1}
            nDict[0]["position"]={'x': positions[node][0],'y': positions[node][1]}
            nodes.append(nDict)
            
        return nodes;

gene2all("ENSG00000121410")
