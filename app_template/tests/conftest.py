import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from visyn_core.server.visyn_server import create_visyn_server


@pytest.fixture(scope="session")
def app() -> FastAPI:
    return create_visyn_server(workspace_config={"visyn_core": {"enabled_plugins": ["visyn_core", "app_template"]}, "app_template": {}})


@pytest.fixture(scope="session")
def client(app):
    with TestClient(app) as c:
        yield c
