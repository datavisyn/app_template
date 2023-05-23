from fastapi.testclient import TestClient


def test_graph(client: TestClient):
    # Very basic test checking for the existance of a single edge in the graph
    graph = client.get("/api/app/graph").json()
    assert {"ENSG_A": "ENSG00000105135", "ENSG_B": "ENSG00000100239", "combined_score": 1} in graph
