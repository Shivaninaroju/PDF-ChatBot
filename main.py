import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.logging import logger
from app.api.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Production-Grade RAG PDF Assistant with Multi-Provider Abstraction, Security, and Evaluation"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All API Routers (/health, /chat, /api/v1/upload, /api/v1/evaluate, etc.)
app.include_router(api_router)

# Mount frontend assets if UI build exists
if os.path.exists("UI/dist/assets"):
    app.mount("/assets", StaticFiles(directory="UI/dist/assets"), name="assets")

@app.get("/", tags=["UI Homepage"])
def serve_homepage():
    if os.path.exists("UI/dist/index.html"):
        return FileResponse("UI/dist/index.html")
    return {
        "message": f"{settings.APP_NAME} API is running.",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting production server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)



