import logging
from pymongo import AsyncMongoClient
from pymongo.server_api import ServerApi
from pymongo.asynchronous.database import AsyncDatabase
from app.core.config import settings

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: AsyncMongoClient = None
    db: AsyncDatabase = None

db_manager = DatabaseManager()

def sanitize_mongo_uri(uri: str) -> str:
    """Mask credentials in MongoDB URI for safe logging"""
    if not uri:
        return ""
    import re
    return re.sub(r"://([^:]+):([^@]+)@", r"://***:***@", uri)

async def connect_to_mongo() -> AsyncDatabase:
    """Connect to MongoDB Atlas using PyMongo Async API without silent localhost fallback"""
    target_url = settings.MONGODB_URL
    sanitized_url = sanitize_mongo_uri(target_url)
    try:
        logger.info(f"Connecting to MongoDB at {sanitized_url} (database: {settings.DATABASE_NAME})...")
        client = AsyncMongoClient(
            target_url,
            server_api=ServerApi('1') if "mongodb+srv" in target_url else None,
            serverSelectionTimeoutMS=5000
        )
        db = client[settings.DATABASE_NAME]
        # Verify connection
        await db.command("ping")
        logger.info(f"Successfully connected to MongoDB Atlas database: {settings.DATABASE_NAME}")
        db_manager.client = client
        db_manager.db = db
        await init_db_indexes(db)
        return db
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Failed to connect to MongoDB Atlas endpoint ({sanitized_url}): {error_msg}")
        if "mongodb+srv" in target_url:
            logger.warning(
                "NOTE FOR MONGODB ATLAS: Please ensure your current client IP is whitelisted "
                "in MongoDB Atlas Console -> Network Access -> IP Access List."
            )
        raise ConnectionError(
            f"Failed to establish connection to MongoDB Atlas database '{settings.DATABASE_NAME}'. "
            f"Verify network connectivity, IP whitelist, and credentials."
        ) from e

async def close_mongo_connection():
    """Close MongoDB connection gracefully"""
    if db_manager.client:
        await db_manager.client.close()
        logger.info("Closed MongoDB connection.")

def get_database() -> AsyncDatabase:
    """Dependency provider for FastAPI routes"""
    if db_manager.db is None:
        raise RuntimeError("Database not initialized")
    return db_manager.db

async def init_db_indexes(db: AsyncDatabase):
    """Create essential unique and search indexes for all SPMS collections"""
    try:
        # Users indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("role")
        
        # Students indexes
        await db.students.create_index("user_id", unique=True)
        await db.students.create_index("roll_number", unique=True)
        await db.students.create_index("department")
        await db.students.create_index("cgpa")
        
        # Companies indexes
        await db.companies.create_index("name", unique=True)
        await db.companies.create_index("industry")
        
        # Drives indexes
        await db.drives.create_index("status")
        await db.drives.create_index("application_deadline")
        await db.drives.create_index("company_name")
        await db.drives.create_index("company_id")
        
        # Applications indexes
        await db.applications.create_index([("drive_id", 1), ("student_id", 1)], unique=True)
        await db.applications.create_index("status")
        
        # Audit Logs index
        await db.audit_logs.create_index("timestamp")
        await db.audit_logs.create_index("user_id")
        
        logger.info("All MongoDB indexes successfully verified and initialized.")
    except Exception as e:
        logger.warning(f"Note during index initialization: {e}")
