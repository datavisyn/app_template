from fastapi.testclient import TestClient


def test_get_example(client: TestClient):
    assert len(client.get("/api/v1/app/campaigns").json()) == 1
