from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_manager = DatabaseManager()

async def connect_to_mongo():
    """Connect to MongoDB instance and initialize indexes"""
    try:
        db_manager.client = AsyncIOMotorClient(settings.MONGODB_URL)
        db_manager.db = db_manager.client[settings.DATABASE_NAME]
        # Quick ping to verify connection
        await db_manager.db.command("ping")
        logger.info(f"Connected to MongoDB at {settings.MONGODB_URL}, DB: {settings.DATABASE_NAME}")
        
        # Ensure indexes
        await init_db_indexes(db_manager.db)
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db_manager.client:
        db_manager.client.close()
        logger.info("Closed MongoDB connection.")

def get_database() -> AsyncIOMotorDatabase:
    """Dependency helper to get the active database instance"""
    if db_manager.db is None:
        raise RuntimeError("Database not initialized")
    return db_manager.db

async def init_db_indexes(db: AsyncIOMotorDatabase):
    """Create essential unique and search indexes for SPMS collections"""
    try:
        # Users indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("role")
        
        # Students indexes
        await db.students.create_index("user_id", unique=True)
        await db.students.create_index("roll_number", unique=True)
        await db.students.create_index("department")
        await db.students.create_index("cgpa")
        
        # Drives indexes
        await db.drives.create_index("status")
        await db.drives.create_index("application_deadline")
        await db.drives.create_index("company_name")
        
        # Applications indexes
        await db.applications.create_index([("drive_id", 1), ("student_id", 1)], unique=True)
        await db.applications.create_index("status")
        
        logger.info("MongoDB indexes successfully verified and initialized.")
    except Exception as e:
        logger.warning(f"Note during index initialization: {e}")
