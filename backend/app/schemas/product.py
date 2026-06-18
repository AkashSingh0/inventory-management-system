from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    sku: str = Field(min_length=1, max_length=100)
    price: float = Field(gt=0)
    quantity: int = Field(ge=0)


class ProductUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    sku: str = Field(min_length=1, max_length=100)
    price: float = Field(gt=0)
    quantity: int = Field(ge=0)


class ProductResponse(ProductCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
