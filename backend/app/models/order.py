from sqlalchemy import Column, Integer, Numeric, ForeignKey
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(
        Integer, ForeignKey("customers.id"), nullable=False, index=True
    )
    total_amount = Column(Numeric(10, 2), nullable=False)
