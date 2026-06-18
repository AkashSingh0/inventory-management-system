from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import traceback
from app.database import get_db
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.order import (
    OrderCreate,
    OrderListResponse,
    OrderResponse,
)

router = APIRouter(prefix="/orders", tags=["Orders"])


def _get_order_items(db: Session, order_id: int) -> list[OrderItem]:
    return (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order_id)
        .all()
    )


def _build_order_response(db: Session, order: Order) -> OrderResponse:
    items = _get_order_items(db, order.id)
    return OrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        total_amount=float(order.total_amount),
        items=items,
    )


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
):
    product_ids = [item.product_id for item in payload.items]

    if len(product_ids) != len(set(product_ids)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duplicate products in order items",
        )

    try:
        customer = (
            db.query(Customer)
            .filter(Customer.id == payload.customer_id)
            .first()
        )

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found",
            )

        products = (
            db.query(Product)
            .filter(Product.id.in_(product_ids))
            .with_for_update()
            .all()
        )

        products_by_id = {product.id: product for product in products}
        total_amount = 0.0
        order_items_data: list[dict] = []

        for item in payload.items:
            product = products_by_id.get(item.product_id)

            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product with id {item.product_id} not found",
                )

            if product.quantity < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"Insufficient stock for product '{product.name}' "
                        f"(sku: {product.sku}). Available: {product.quantity}, "
                        f"requested: {item.quantity}"
                    ),
                )

            line_total = float(product.price) * item.quantity
            total_amount += line_total
            order_items_data.append(
                {
                    "product": product,
                    "quantity": item.quantity,
                    "price": float(product.price),
                }
            )

        order = Order(
            customer_id=payload.customer_id,
            total_amount=total_amount,
        )
        db.add(order)
        db.flush()

        for item_data in order_items_data:
            product = item_data["product"]
            product.quantity -= item_data["quantity"]

            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=item_data["quantity"],
                    price=item_data["price"],
                )
            )

        db.commit()
        db.refresh(order)
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create order",
        )

    return _build_order_response(db, order)


@router.get("/", response_model=list[OrderListResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    return _build_order_response(db, order)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    try:
        order_items = (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order_id)
            .all()
        )

        for order_item in order_items:
            product = (
                db.query(Product)
                .filter(Product.id == order_item.product_id)
                .with_for_update()
                .first()
            )

            if product:
                product.quantity += order_item.quantity

            db.delete(order_item)

        db.flush()

        db.delete(order)
        db.commit()

    except Exception as e:
        db.rollback()
        traceback.print_exc()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )