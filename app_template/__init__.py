from fastapi import FastAPI
from visyn_core.plugin.model import AVisynPlugin, RegHelper
from fastapi.middleware.cors import CORSMiddleware



from .settings import AppSettings


class VisynPlugin(AVisynPlugin):
    def init_app(self, app: FastAPI):
        
        # Register anything related the the FastAPI here, i.e. routers, middlewares, events, etc.
        
  
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            # allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        from .graph_router import graph_router
        
        app.include_router(graph_router, prefix="/api/app")
        



    def register(self, registry: RegHelper):
        pass

    @property
    def setting_class(self) -> type[AppSettings]:
        return AppSettings
