from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import binary_search

app = FastAPI(title="Estructuras de Datos API")
@app.get("/ping")
def ping():
    return {"message": "✅ Backend conectado correctamente!"}

# Middleware para conexión con el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(binary_search.router)
