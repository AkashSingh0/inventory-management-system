from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.order import Order
from app.models.product import Product
from app.schemas.dashboard import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

LOW_STOCK_THRESHOLD = 5

@router.get("", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()
    low_stock_products = (
        db.query(Product)
        .filter(Product.quantity < LOW_STOCK_THRESHOLD)
        .count()
    )

    return DashboardResponse(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        low_stock_products=low_stock_products,
    )
