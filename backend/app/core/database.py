from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_manager = DatabaseManager()

async def connect_to_mongo():
    """Connect to MongoDB Atlas instance and initialize indexes with graceful fallback"""
    target_url = settings.MONGODB_URL
    try:
        logger.info(f"Connecting to MongoDB at {target_url} (DB: {settings.DATABASE_NAME})...")
        db_manager.client = AsyncIOMotorClient(target_url, serverSelectionTimeoutMS=5000)
        db_manager.db = db_manager.client[settings.DATABASE_NAME]
        await db_manager.db.command("ping")
        logger.info(f"Successfully connected to MongoDB Atlas! DB: {settings.DATABASE_NAME}")
        await init_db_indexes(db_manager.db)
    except Exception as e:
        error_msg = str(e)
        logger.warning(f"Could not reach primary MongoDB endpoint ({target_url}): {error_msg}")
        
        if "mongodb+srv" in target_url or "wvdtyx7.mongodb.net" in target_url:
            logger.warning(
                "NOTE FOR MONGODB ATLAS: If you see 'SSL alert 80' or 'TLSV1_ALERT_INTERNAL_ERROR', "
                "please ensure your current IP address (or 0.0.0.0/0 for global access) is whitelisted "
                "in MongoDB Atlas Console -> Network Access -> IP Access List."
            )
            
        # Attempt fallback to local MongoDB instance if running
        fallback_url = "mongodb://localhost:27017"
        logger.info(f"Attempting fallback to local MongoDB instance at {fallback_url}...")
        try:
            db_manager.client = AsyncIOMotorClient(fallback_url, serverSelectionTimeoutMS=3000)
            db_manager.db = db_manager.client[settings.DATABASE_NAME]
            await db_manager.db.command("ping")
            logger.info("Connected to local MongoDB instance successfully.")
            await init_db_indexes(db_manager.db)
        except Exception as fallback_err:
            logger.error(f"Fallback connection to local MongoDB failed: {fallback_err}")
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
