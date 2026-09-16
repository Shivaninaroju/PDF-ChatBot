from fastapi import APIRouter
from app.api import routes_health, routes_chat, routes_doc, routes_eval

api_router = APIRouter()

api_router.include_router(routes_health.router)
api_router.include_router(routes_chat.router)
api_router.include_router(routes_doc.router)
api_router.include_router(routes_eval.router)
