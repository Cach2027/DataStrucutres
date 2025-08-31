from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import binary_search, hash_table, tree

app = FastAPI(title="Estructuras de Datos API")

# Middleware para permitir conexión con el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas (routers)
app.include_router(binary_search.router)
app.include_router(hash_table.router)
app.include_router(tree.router)
