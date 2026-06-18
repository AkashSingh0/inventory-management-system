from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CustomerCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=50)


class CustomerResponse(CustomerCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
