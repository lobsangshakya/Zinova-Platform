import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config.settings import CORS_ORIGIN
from app.routes import form, otp, contributions

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Zinova API is ready.")
    yield


app = FastAPI(title="Zinova API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        CORS_ORIGIN,
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
        "https://zinova-platform.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(otp.router)
app.include_router(form.router)
app.include_router(contributions.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.exception_handler(404)
async def not_found(request: Request, exc):
    return JSONResponse(status_code=404, content={"error": "Not found"})
