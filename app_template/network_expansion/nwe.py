import pandas as pd
from igraph import Graph


def annotation(node_list, genes, diseases):
    genes = genes[genes["disease"].isin(diseases)]
    node_list["padj"] = node_list.apply(
        lambda x: max(genes[genes["gene"] == x["ENSG"]]["padj"]) if x["gene"] in genes["gene"] else 0, axis=1
    )
    return node_list


def astro(node_gwas: pd.DataFrame, edge_string: pd.DataFrame, all_nodes: bool) -> Graph:
    net = Graph.DataFrame(edges=edge_string, vertices=node_gwas, directed=False, use_vids=False)
    net = net.simplify(loops=True, multiple=True, combine_edges="max")

    # TODO: Port rest of function from R script Script_1_SEED.R
    # page_rank = Graph.pagerank(net)

    return net
