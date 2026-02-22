from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_merchant: bool = False

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class STLModelBase(BaseModel):
    title: str
    description: str
    price: float = 0.0
    is_free: bool = False

class STLModelResponse(STLModelBase):
    id: int
    file_url: str
    image_url: str
    owner_id: int

    class Config:
        from_attributes = True
