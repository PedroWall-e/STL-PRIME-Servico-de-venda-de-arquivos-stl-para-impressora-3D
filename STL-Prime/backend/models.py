from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_merchant = Column(Boolean, default=False)
    
    models = relationship("STLModel", back_populates="owner")

class STLModel(Base):
    __tablename__ = "stl_models"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    file_url = Column(String(500))
    image_url = Column(String(500))
    price = Column(Float, default=0.0)
    is_free = Column(Boolean, default=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    owner = relationship("User", back_populates="models")
    material_properties = relationship("MaterialProperty", back_populates="model")

class MaterialProperty(Base):
    __tablename__ = "material_properties"

    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("stl_models.id"))
    filament_type = Column(String(100)) # PLA, PETG, ABS, etc.
    estimated_weight = Column(Float) # in grams
    print_time = Column(Integer) # in minutes
    recommended_temperature = Column(Integer)
    
    model = relationship("STLModel", back_populates="material_properties")
