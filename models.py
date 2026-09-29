import os
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.types import TypeDecorator
from cryptography.fernet import Fernet
from database import Base

_ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not _ENCRYPTION_KEY:
        raise RuntimeError("ENCRYPTION_KEY must be configured and preserved across restarts")
_fernet = Fernet(_ENCRYPTION_KEY.encode('utf-8'))

class EncryptedString(TypeDecorator):
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
        __tablename__ = "workflow_stages"
        id = Column(Integer, primary_key=True, index=True)
        step_number = Column(Integer, unique=True, nullable=False)
        title = Column(String(255), nullable=False)
        description = Column(Text, nullable=True)
        conditions = Column(Text, nullable=True)
        deadline_days = Column(Integer, nullable=True)
        partnerships = relationship("Partnership", back_populates="stage")

class Partnership(Base):
        __tablename__ = "partnerships"
        id = Column(Integer, primary_key=True, index=True)
        university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)
        program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
        stage_id = Column(Integer, ForeignKey("workflow_stages.id"), nullable=False)
        manager_name = Column(String(255), nullable=True)
        contract_number = Column(String(100), nullable=True)
        is_license_signed = Column(Boolean, default=False)
        license_term_years = Column(Integer, nullable=True)
        transfer_status = Column(String(100), nullable=True)
        comment = Column(Text, nullable=True)
        created_at = Column(DateTime, default=datetime.utcnow)
        updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        university = relationship("University", back_populates="partnerships")
        program = relationship("Program", back_populates="partnerships")
        stage = relationship("WorkflowStage", back_populates="partnerships")
        students = relationship("Student", back_populates="partnership", cascade="all, delete-orphan")
        attachments = relationship("Attachment", back_populates="partnership", cascade="all, delete-orphan")
        comments = relationship("PartnershipComment", back_populates="partnership", cascade="all, delete-orphan")

class PartnershipComment(Base):
        __tablename__ = "partnership_comments"
        id = Column(Integer, primary_key=True, index=True)
        partnership_id = Column(Integer, ForeignKey("partnerships.id"), nullable=False)
        stage_id = Column(Integer, nullable=True)
        author_id = Column(String(100), nullable=False)
        text = Column(Text, nullable=False)
        created_at = Column(DateTime, default=datetime.utcnow)
        partnership = relationship("Partnership", back_populates="comments")

class Student(Base):
        __tablename__ = "students"
        id = Column(Integer, primary_key=True, index=True)
        partnership_id = Column(Integer, ForeignKey("partnerships.id"), nullable=False)
        full_name = Column(EncryptedString(255), nullable=False)
        email = Column(EncryptedString(255), nullable=False)
        created_at = Column(DateTime, default=datetime.utcnow)
        partnership = relationship("Partnership", back_populates="students")

class Attachment(Base):
        __tablename__ = "attachments"
        id = Column(Integer, primary_key=True, index=True)
        partnership_id = Column(Integer, ForeignKey("partnerships.id"), nullable=False)
        stage_id = Column(Integer, nullable=True)
        file_size = Column(Integer, nullable=True)
        document_type = Column(String(50), nullable=True)
        file_name = Column(String(255), nullable=False)
        file_url = Column(String(500), nullable=False)
        file_type = Column(String(50), nullable=True)
        uploaded_at = Column(DateTime, default=datetime.utcnow)
        partnership = relationship("Partnership", back_populates="attachments")

class AuditLog(Base):
        __tablename__ = "audit_logs"
        id = Column(Integer, primary_key=True, index=True)
        user_id = Column(String(100), nullable=False)
        action = Column(String(100), nullable=False)
        entity_name = Column(String(100), nullable=False)
        entity_id = Column(Integer, nullable=True)
        ip_address = Column(String(45), nullable=True)
        timestamp = Column(DateTime, default=datetime.utcnow)

class CatalogImportJob(Base):
        __tablename__ = "catalog_import_jobs"
        id = Column(String(36), primary_key=True)
        owner_id = Column(String(255), nullable=False)
        catalog = Column(String(32), nullable=False)
        payload = Column(EncryptedString(), nullable=False)
        result = Column(Text, nullable=True)
        created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class CatalogManager(Base):
        __tablename__ = "catalog_managers"
        id = Column(Integer, primary_key=True)
        name = Column(String(255), nullable=False, unique=True)


class WorkflowState(Base):
        __tablename__ = "workflow_state"
        id = Column(Integer, primary_key=True)
        version = Column(Integer, nullable=False, default=1)


class PartnershipState(Base):
        __tablename__ = "partnership_state"
        partnership_id = Column(Integer, ForeignKey("partnerships.id"), primary_key=True)
        data = Column(EncryptedString(), nullable=False, default="{}")


class PartnershipRequest(Base):
        __tablename__ = "partnership_requests"
        id = Column(Integer, primary_key=True)
        requester = Column(String(255), nullable=False, index=True)
        requester_name = Column(String(255), nullable=False)
        university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)
        program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
        status = Column(String(20), nullable=False, default="pending")
        partnership_id = Column(Integer, ForeignKey("partnerships.id"), nullable=True)
        decided_by = Column(String(255), nullable=True)
        reason = Column(Text, nullable=True)
        created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
        decided_at = Column(DateTime, nullable=True)
