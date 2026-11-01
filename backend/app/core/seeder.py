import logging
from datetime import datetime, timedelta
from pymongo.asynchronous.database import AsyncDatabase
from app.core.security import get_password_hash
from app.core.roles import AppRole
from app.core.config import settings

logger = logging.getLogger(__name__)

async def seed_initial_data(db: AsyncDatabase):
    """Seed comprehensive initial demo data for SPMS MVP testing and presentation using PyMongo Async"""
    # Enforce strict production protection
    if str(settings.ENVIRONMENT).lower() == "production" or not settings.ENABLE_DEMO_SEEDING:
        logger.info("Demo seeding is disabled for this environment.")
        return

    try:
        user_count = await db.users.count_documents({})
        if user_count > 0:
            logger.info("Database already contains data; checking company seed...")
            company_count = await db.companies.count_documents({})
            if company_count == 0:
                await seed_companies(db)
            return

        logger.info("Seeding initial SPMS demo data into MongoDB...")
        now = datetime.utcnow()

        # 1. Create Users with Canonical Roles (passwords sourced from environment configuration)
        tpo_password = get_password_hash(settings.DEMO_ADMIN_PASSWORD)
        student_password = get_password_hash(settings.DEMO_STUDENT_PASSWORD)
        recruiter_password = get_password_hash(settings.DEMO_RECRUITER_PASSWORD)
        admin_password = get_password_hash(settings.DEMO_ADMIN_PASSWORD)

        users_to_insert = [
            {
                "email": "tpo@kiet.edu",
                "password_hash": tpo_password,
                "full_name": "Dr. Rajesh Verma (Head TPO)",
                "phone": "+91 98765 43210",
                "role": AppRole.PLACEMENT_OFFICER.value,
                "is_active": True,
                "created_at": now
            },
            {
                "email": "admin@kiet.edu",
                "password_hash": admin_password,
                "full_name": "System Administrator",
                "phone": "+91 98765 43211",
                "role": AppRole.ADMIN.value,
                "is_active": True,
                "created_at": now
            },
            {
                "email": "arjun.sharma@kiet.edu",
                "password_hash": student_password,
                "full_name": "Arjun Sharma",
                "phone": "+91 98112 33445",
                "role": AppRole.STUDENT.value,
                "is_active": True,
                "created_at": now
            },
            {
                "email": "priya.verma@kiet.edu",
                "password_hash": student_password,
                "full_name": "Priya Verma",
                "phone": "+91 98223 44556",
                "role": AppRole.STUDENT.value,
                "is_active": True,
                "created_at": now
            },
            {
                "email": "rohit.singh@kiet.edu",
                "password_hash": student_password,
                "full_name": "Rohit Singh",
                "phone": "+91 98334 55667",
                "role": AppRole.STUDENT.value,
                "is_active": True,
                "created_at": now
            },
            {
                "email": "recruiter.google@google.com",
                "password_hash": recruiter_password,
                "full_name": "Sneha Kapoor (Google University Recruiter)",
                "phone": "+91 98445 66778",
                "role": AppRole.RECRUITER.value,
                "is_active": True,
                "created_at": now
            }
        ]

        user_res = await db.users.insert_many(users_to_insert)
        user_ids = [str(uid) for uid in user_res.inserted_ids]

        tpo_id = user_ids[0]
        arjun_id = user_ids[2]
        priya_id = user_ids[3]
        rohit_id = user_ids[4]

        # 2. Seed Companies
        companies_map = await seed_companies(db)

        # 3. Create Student Profiles
        students_to_insert = [
            {
                "user_id": arjun_id,
                "roll_number": "2100290100045",
                "department": "CSE",
                "batch": 2025,
                "cgpa": 8.75,
                "tenth_percentage": 91.5,
                "twelfth_percentage": 88.0,
                "active_backlogs": 0,
                "history_backlogs": 0,
                "skills": ["Python", "FastAPI", "React", "TypeScript", "Docker", "SQL", "DSA"],
                "resume_url": "/uploads/sample_resume_arjun.pdf",
                "linkedin_url": "https://linkedin.com/in/arjun-sharma-kiet",
                "github_url": "https://github.com/arjunsharma-dev",
                "placement_status": "unplaced",
                "offers_count": 0,
                "created_at": now
            },
            {
                "user_id": priya_id,
                "roll_number": "2100290200088",
                "department": "ECE",
                "batch": 2025,
                "cgpa": 6.85,
                "tenth_percentage": 76.0,
                "twelfth_percentage": 71.0,
                "active_backlogs": 1,
                "history_backlogs": 1,
                "skills": ["C++", "Embedded C", "MATLAB", "IoT"],
                "resume_url": "/uploads/sample_resume_priya.pdf",
                "linkedin_url": "https://linkedin.com/in/priya-verma-kiet",
                "github_url": "https://github.com/priyaverma-iot",
                "placement_status": "unplaced",
                "offers_count": 0,
                "created_at": now
            },
            {
                "user_id": rohit_id,
                "roll_number": "2100290130092",
                "department": "IT",
                "batch": 2025,
                "cgpa": 9.20,
                "tenth_percentage": 94.0,
                "twelfth_percentage": 92.5,
                "active_backlogs": 0,
                "history_backlogs": 0,
                "skills": ["Go", "Kubernetes", "AWS", "Distributed Systems", "C++"],
                "resume_url": "/uploads/sample_resume_rohit.pdf",
                "linkedin_url": "https://linkedin.com/in/rohit-singh-dev",
                "github_url": "https://github.com/rohitsingh-cloud",
                "placement_status": "placed",
                "offers_count": 1,
                "created_at": now
            }
        ]

        stu_res = await db.students.insert_many(students_to_insert)
        student_ids = [str(sid) for sid in stu_res.inserted_ids]
        arjun_stu_id = student_ids[0]
        priya_stu_id = student_ids[1]
        rohit_stu_id = student_ids[2]

        # 4. Create Placement Drives
        drives_to_insert = [
            {
                "title": "Software Development Engineer (L3)",
                "company_name": "Google",
                "company_id": companies_map.get("Google"),
                "job_role": "Software Development Engineer",
                "job_description": "Join Google's core engineering teams building scalable cloud and distributed infrastructure systems.",
                "package_ctc": 32.5,
                "stipend": "1,10,000 / month",
                "job_location": "Bengaluru / Hyderabad",
                "drive_date": now + timedelta(days=12),
                "application_deadline": now + timedelta(days=5),
                "status": "active",
                "eligibility_criteria": {
                    "min_cgpa": 8.0,
                    "min_tenth_percentage": 80.0,
                    "min_twelfth_percentage": 80.0,
                    "max_active_backlogs": 0,
                    "max_history_backlogs": 0,
                    "allowed_departments": ["CSE", "CSE(AIML)", "CSE(AI)", "CSIT", "IT"],
                    "allowed_batches": [2025],
                    "allow_already_placed": True
                },
                "rounds": [
                    {"round_number": 1, "name": "Online Assessment (OA)", "description": "2 Hard LeetCode DSA questions on HackerEarth (90 mins)"},
                    {"round_number": 2, "name": "Technical Interview 1", "description": "Algorithms & Data Structures in depth"},
                    {"round_number": 3, "name": "Technical Interview 2", "description": "System Design & Concurrency"},
                    {"round_number": 4, "name": "Googliness & Leadership", "description": "Culture & behavioral fitment"}
                ],
                "created_by": tpo_id,
                "created_at": now,
                "updated_at": now
            },
            {
                "title": "Cloud Solution Engineer",
                "company_name": "Microsoft",
                "company_id": companies_map.get("Microsoft"),
                "job_role": "Azure Cloud Engineer",
                "job_description": "Architect and deploy high-reliability enterprise solutions leveraging Microsoft Azure cloud platform.",
                "package_ctc": 24.0,
                "stipend": "80,000 / month",
                "job_location": "Noida / Hyderabad",
                "drive_date": now + timedelta(days=8),
                "application_deadline": now + timedelta(days=3),
                "status": "active",
                "eligibility_criteria": {
                    "min_cgpa": 7.5,
                    "min_tenth_percentage": 70.0,
                    "min_twelfth_percentage": 70.0,
                    "max_active_backlogs": 0,
                    "max_history_backlogs": 1,
                    "allowed_departments": ["CSE", "CSE(AIML)", "CSIT", "IT", "ECE"],
                    "allowed_batches": [2025, 2026],
                    "allow_already_placed": False
                },
                "rounds": [
                    {"round_number": 1, "name": "Online Coding Assessment", "description": "Codility platform assessment"},
                    {"round_number": 2, "name": "Technical Round 1", "description": "OS, Networking, and Cloud fundamentals"},
                    {"round_number": 3, "name": "AA Round", "description": "As-Appropriate executive round"}
                ],
                "created_by": tpo_id,
                "created_at": now,
                "updated_at": now
            },
            {
                "title": "Systems Engineer — Digital Track",
                "company_name": "Tata Consultancy Services (TCS)",
                "company_id": companies_map.get("Tata Consultancy Services (TCS)"),
                "job_role": "Digital Technology Engineer",
                "job_description": "Full-stack development, enterprise automation, and AI integration for global financial and retail clients.",
                "package_ctc": 7.5,
                "stipend": "25,000 / month",
                "job_location": "Pan-India",
                "drive_date": now + timedelta(days=15),
                "application_deadline": now + timedelta(days=7),
                "status": "active",
                "eligibility_criteria": {
                    "min_cgpa": 6.5,
                    "min_tenth_percentage": 60.0,
                    "min_twelfth_percentage": 60.0,
                    "max_active_backlogs": 0,
                    "max_history_backlogs": 2,
                    "allowed_departments": ["CSE", "CSE(AIML)", "CSE(AI)", "CSIT", "IT", "CS", "ECE", "EEE", "ME"],
                    "allowed_batches": [2025],
                    "allow_already_placed": False
                },
                "rounds": [
                    {"round_number": 1, "name": "TCS NQT Assessment", "description": "Cognitive and Advanced Coding"},
                    {"round_number": 2, "name": "Technical & HR Interview", "description": "Combined panel interview"}
                ],
                "created_by": tpo_id,
                "created_at": now,
                "updated_at": now
            },
            {
                "title": "Associate Software Engineer",
                "company_name": "Amazon",
                "company_id": companies_map.get("Amazon"),
                "job_role": "SDE-1",
                "job_description": "Build services and client-facing features that serve hundreds of millions of customers worldwide.",
                "package_ctc": 28.0,
                "stipend": "90,000 / month",
                "job_location": "Bengaluru / Gurugram",
                "drive_date": now + timedelta(days=20),
                "application_deadline": now + timedelta(days=10),
                "status": "active",
                "eligibility_criteria": {
                    "min_cgpa": 7.2,
                    "min_tenth_percentage": 70.0,
                    "min_twelfth_percentage": 70.0,
                    "max_active_backlogs": 0,
                    "max_history_backlogs": 1,
                    "allowed_departments": ["CSE", "CSE(AIML)", "CSIT", "IT"],
                    "allowed_batches": [2025],
                    "allow_already_placed": True
                },
                "rounds": [
                    {"round_number": 1, "name": "Online Assessment (OA)", "description": "Debugging + 2 Coding questions + Work Styles"},
                    {"round_number": 2, "name": "Technical Loop 1", "description": "DSA & Amazon Leadership Principles"},
                    {"round_number": 3, "name": "Bar Raiser Interview", "description": "High-standard cultural and technical evaluation"}
                ],
                "created_by": tpo_id,
                "created_at": now,
                "updated_at": now
            }
        ]

        drives_res = await db.drives.insert_many(drives_to_insert)
        drive_ids = [str(did) for did in drives_res.inserted_ids]
        microsoft_drive_id = drive_ids[1]
        tcs_drive_id = drive_ids[2]

        # 5. Create Initial Seed Applications
        apps_to_insert = [
            {
                "drive_id": microsoft_drive_id,
                "student_id": arjun_stu_id,
                "student_user_id": arjun_id,
                "status": "Interview Round 1",
                "current_round": 2,
                "round_history": [
                    {
                        "round_name": "Application Submission",
                        "status": "Submitted",
                        "remarks": "Eligibility confirmed: CGPA 8.75 >= 7.50, 0 Backlogs.",
                        "updated_at": now - timedelta(days=2)
                    },
                    {
                        "round_name": "Online Coding Assessment",
                        "status": "Cleared",
                        "remarks": "Scored 100/100 on Codility assessment.",
                        "updated_at": now - timedelta(days=1)
                    }
                ],
                "applied_at": now - timedelta(days=2),
                "updated_at": now - timedelta(days=1)
            },
            {
                "drive_id": microsoft_drive_id,
                "student_id": rohit_stu_id,
                "student_user_id": rohit_id,
                "status": "Offered",
                "current_round": 3,
                "round_history": [
                    {
                        "round_name": "Application Submission",
                        "status": "Submitted",
                        "remarks": "Eligibility verified.",
                        "updated_at": now - timedelta(days=5)
                    },
                    {
                        "round_name": "Online Coding Assessment",
                        "status": "Cleared",
                        "remarks": "Passed with 95% test cases.",
                        "updated_at": now - timedelta(days=4)
                    },
                    {
                        "round_name": "AA Final Interview",
                        "status": "Cleared",
                        "remarks": "Strong recommendation from hiring manager. Offer package: 24 LPA.",
                        "updated_at": now - timedelta(days=2)
                    }
                ],
                "applied_at": now - timedelta(days=5),
                "updated_at": now - timedelta(days=2)
            },
            {
                "drive_id": tcs_drive_id,
                "student_id": priya_stu_id,
                "student_user_id": priya_id,
                "status": "Applied",
                "current_round": 1,
                "round_history": [
                    {
                        "round_name": "Application Submission",
                        "status": "Submitted",
                        "remarks": "Application registered for TCS NQT.",
                        "updated_at": now - timedelta(days=1)
                    }
                ],
                "applied_at": now - timedelta(days=1),
                "updated_at": now - timedelta(days=1)
            }
        ]

        await db.applications.insert_many(apps_to_insert)
        logger.info("SPMS initial demo data successfully seeded.")

    except Exception as e:
        logger.error(f"Error seeding initial data: {e}")

async def seed_companies(db: AsyncDatabase):
    """Seed initial corporate recruiting partners"""
    now = datetime.utcnow()
    companies = [
        {
            "name": "Google",
            "industry": "Internet & Cloud Technology",
            "website": "https://careers.google.com",
            "contact_email": "university-india@google.com",
            "contact_phone": "+91 80 6721 8000",
            "tier": "Tier 1 - Dream (>10 LPA)",
            "location": "Bengaluru / Hyderabad",
            "description": "Global technology leader in search, cloud computing, and AI systems.",
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "Microsoft",
            "industry": "Enterprise Software & Cloud",
            "website": "https://careers.microsoft.com",
            "contact_email": "india-campus@microsoft.com",
            "contact_phone": "+91 40 6694 0000",
            "tier": "Tier 1 - Dream (>10 LPA)",
            "location": "Noida / Hyderabad / Bengaluru",
            "description": "Pioneering enterprise productivity, operating systems, and Azure cloud infrastructure.",
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "Amazon",
            "industry": "E-Commerce & Cloud Services",
            "website": "https://amazon.jobs",
            "contact_email": "university-recruiting-in@amazon.com",
            "contact_phone": "+91 80 4331 4000",
            "tier": "Tier 1 - Dream (>10 LPA)",
            "location": "Bengaluru / Gurugram / Hyderabad",
            "description": "Worldwide leader in e-commerce, cloud infrastructure (AWS), and digital streaming.",
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "Tata Consultancy Services (TCS)",
            "industry": "IT Services & Consulting",
            "website": "https://www.tcs.com/careers",
            "contact_email": "campus.talent@tcs.com",
            "contact_phone": "+91 22 6778 9999",
            "tier": "Tier 3 - Core (5-10 LPA)",
            "location": "Pan-India",
            "description": "Leading global IT services, consulting, and business solutions provider.",
            "created_at": now,
            "updated_at": now
        }
    ]

    companies_map = {}
    for comp in companies:
        existing = await db.companies.find_one({"name": comp["name"]})
        if existing:
            companies_map[comp["name"]] = str(existing["_id"])
        else:
            res = await db.companies.insert_one(comp)
            companies_map[comp["name"]] = str(res.inserted_id)
            
    logger.info(f"Seeded {len(companies_map)} company records.")
    return companies_map
