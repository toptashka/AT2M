import os
from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Boolean
)
from sqlalchemy.orm import relationship
from sqlalchemy.types import TypeDecorator
from cryptography.fernet import Fernet
from database import Base

_ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not _ENCRYPTION_KEY:
    _ENCRYPTION_KEY = Fernet.generate_key().decode('utf-8')
_fernet = Fernet(_ENCRYPTION_KEY.encode('utf-8'))

class EncryptedString(TypeDecorator):
    """Кастомный тип данных для прозрачного шифрования ПДн в PostgreSQL"""
    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            return _fernet.encrypt(value.encode('utf-8')).decode('utf-8')
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            try:
                return _fernet.decrypt(value.encode('utf-8')).decode('utf-8')
            except Exception:
                return value
        return value


class University(Base):
    """Справочник вузов и контактов представителей"""
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    region = Column(String(100), nullable=True)
    
    contact_name = Column(EncryptedString(255), nullable=True)
    contact_email = Column(EncryptedString(255), nullable=True)
    contact_phone = Column(EncryptedString(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    partnerships = relationship("Partnership", back_populates="university")


class Program(Base):
    """Образовательные программы и продукты с ручным приоритетом"""
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    direction = Column(String(100), nullable=False)
    vendor = Column(String(100), nullable=True)
    software = Column(String(100), nullable=True)
    priority = Column(Integer, default=0, index=True)
    is_active = Column(Boolean, default=True)

    partnerships = relationship("Partnership", back_populates="program")


class WorkflowStage(Base):
    """Справочник 14 этапов воронки с возможностью изменения списка"""
    __tablename__ = "workflow_stages"

    id = Column(Integer, primary_key=True, index=True)
    step_number = Column(Integer, unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    partnerships = relationship("Partnership", back_populates="stage")


class Partnership(Base):
    """Главная сущность Канбана: связка «Вуз + Программа»"""
    __tablename__ = "partnerships"

    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    stage_id = Column(Integer, ForeignKey("workflow_stages.id"), nullable=False)

    manager_name = Column(String(255), nullable=True)
    contract_number = Column(String(100), nullable=True)
    is_license_signed = Column(Boolean, default=False)
    license_term_years = Column(Integer, nullable=True)
    comment = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    university = relationship("University", back_populates="partnerships")
    program = relationship("Program", back_populates="partnerships")
    stage = relationship("WorkflowStage", back_populates="partnerships")
    students = relationship("Student", back_populates="partnership", cascade="all, delete-orphan")
    attachments = relationship("Attachment", back_populates="partnership", cascade="all, delete-orphan")


class Student(Base):
    """Поименные списки обучающихся"""
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    partnership_id = Column(Integer, ForeignKey("partnerships.id"), nullable=False)
    
    full_name = Column(EncryptedString(255), nullable=False)
    email = Column(EncryptedString(255), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    partnership = relationship("Partnership", back_populates="students")


class Attachment(Base):
    """Прикрепляемые к этапам файлы (акты, договоры, лицензии)"""
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    partnership_id = Column(Integer, ForeignKey("partnerships.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    partnership = relationship("Partnership", back_populates="attachments")


class AuditLog(Base):
    """Журнал аудита действий пользователей под требования 152-ФЗ"""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)
    entity_name = Column(String(100), nullable=False)
    entity_id = Column(Integer, nullable=True)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)