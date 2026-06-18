from pydantic import BaseModel, ConfigDict, Field


class OrderItemCreate(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: int = Field(gt=0)
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: list[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)


class OrderListResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float

    model_config = ConfigDict(from_attributes=True)
