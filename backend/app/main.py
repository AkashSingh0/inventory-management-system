from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models  # noqa: F401 — register models with Base.metadata
from app.routers.product import router as product_router
from app.routers.customer import router as customer_router
from app.routers.order import router as order_router
from app.routers.dashboard import router as dashboard_router


import time
from contextlib import asynccontextmanager
from sqlalchemy import text

@asynccontextmanager
async def lifespan(app: FastAPI):
    for _ in range(30):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            break
        except Exception:
            print("Waiting for PostgreSQL...")
            time.sleep(2)

    Base.metadata.create_all(bind=engine)

    yield


app = FastAPI(
    title="Inventory Management API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"message": "Inventory Management API Running"}
