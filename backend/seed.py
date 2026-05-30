"""
Kefit Marketplace — Demo Data Seeder
Run: source .venv/bin/activate && python seed.py
"""
import asyncio
import uuid
from datetime import datetime, timedelta

from passlib.context import CryptContext
from sqlalchemy import select

from src.database import async_session_maker, engine, Base
from src.models.user import User, UserRole
from src.models.job import Job, JobStatus
from src.models.bid import Bid, BidStatus
from src.models.contract import Contract, ContractStatus
from src.models.notification import Notification, NotificationType
from src.models.freelancer_profile import FreelancerProfile
from src.models.skill import Skill

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_pw(pw: str) -> str:
    return pwd_context.hash(pw)


# ─── Demo Users ────────────────────────────────────────────────────────────────

CLIENTS = [
    {"name": "Abebe Girma", "email": "abebe.girma@gmail.com", "bio": ""},
    {"name": "Tigist Haile", "email": "tigist.haile@gmail.com", "bio": ""},
    {"name": "Dawit Bekele", "email": "dawit.bekele@gmail.com", "bio": ""},
]

FREELANCERS = [
    {
        "name": "Meron Tadesse", "email": "meron.tadesse@gmail.com",
        "bio": "Experienced Python and FastAPI developer with 3 years of backend development experience. Specialized in building REST APIs and data pipelines.",
        "skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
        "title": "Backend Developer",
        "hourly_rate": 25.0,
    },
    {
        "name": "Yonas Alemu", "email": "yonas.alemu@gmail.com",
        "bio": "Full-stack developer specializing in React and TypeScript. Passionate about building clean, responsive web applications for Ethiopian businesses.",
        "skills": ["JavaScript", "TypeScript", "React", "UI/UX Design"],
        "title": "Full-Stack Developer",
        "hourly_rate": 20.0,
    },
    {
        "name": "Hiwot Tesfaye", "email": "hiwot.tesfaye@gmail.com",
        "bio": "UI/UX designer with expertise in Figma and Adobe XD. I create beautiful, user-friendly interfaces tailored for Ethiopian digital products.",
        "skills": ["UI/UX Design", "Graphic Design", "Content Writing"],
        "title": "UI/UX Designer",
        "hourly_rate": 18.0,
    },
    {
        "name": "Biniam Kebede", "email": "biniam.kebede@gmail.com",
        "bio": "Data analyst and machine learning engineer. Experienced in Python, pandas, and scikit-learn. Helping Ethiopian companies make data-driven decisions.",
        "skills": ["Python", "Data Analysis", "Machine Learning", "PostgreSQL"],
        "title": "Data Analyst & ML Engineer",
        "hourly_rate": 30.0,
    },
]

SKILLS_LIST = [
    'Python', 'JavaScript', 'TypeScript', 'React',
    'FastAPI', 'Django', 'PostgreSQL', 'Docker',
    'UI/UX Design', 'Graphic Design', 'Content Writing',
    'Data Analysis', 'Machine Learning',
    'Mobile Development', 'Project Management'
]

JOBS = [
    {
        "client_idx": 0,
        "title": "Build REST API for E-Commerce Platform",
        "description": "We need an experienced backend developer to build a RESTful API for our Ethiopian e-commerce platform. The system should handle product listings, orders, payments integration with local gateways, and user authentication. Must use FastAPI and PostgreSQL.",
        "category": "Backend Development",
        "budget": 15000.0,
        "skills": ['FastAPI', 'PostgreSQL', 'Python', 'Docker'],
        "days_until_deadline": 30,
        "status": JobStatus.IN_PROGRESS,
    },
    {
        "client_idx": 0,
        "title": "Data Analysis Dashboard for Sales Reports",
        "description": "Looking for a data analyst to build an interactive dashboard showing our monthly sales data across 5 Ethiopian cities. Should include charts, filters, and export to PDF. Python and pandas preferred.",
        "category": "Data Analysis",
        "budget": 8000.0,
        "skills": ['Python', 'Data Analysis', 'PostgreSQL'],
        "days_until_deadline": 21,
        "status": JobStatus.OPEN,
    },
    {
        "client_idx": 1,
        "title": "UI/UX Design for Mobile Banking App",
        "description": "We are building a mobile banking application for Ethiopian users. Need a talented UI/UX designer to create wireframes and high-fidelity mockups in Figma. Must understand local user behavior and Amharic language support requirements.",
        "category": "UI/UX Design",
        "budget": 12000.0,
        "skills": ['UI/UX Design', 'Graphic Design'],
        "days_until_deadline": 14,
        "status": JobStatus.IN_PROGRESS,
    },
    {
        "client_idx": 1,
        "title": "React Dashboard for Hospital Management System",
        "description": "Build a responsive React + TypeScript frontend for our hospital management system. Features include patient registration, appointment scheduling, and doctor dashboard. Must be clean, fast, and mobile friendly.",
        "category": "Frontend Development",
        "budget": 18000.0,
        "skills": ['React', 'TypeScript', 'JavaScript'],
        "days_until_deadline": 45,
        "status": JobStatus.OPEN,
    },
    {
        "client_idx": 2,
        "title": "Content Writer for Tech Blog (Amharic + English)",
        "description": "We need a bilingual content writer to produce 10 articles per month for our technology blog targeting Ethiopian professionals. Topics include fintech, startups, and digital transformation in Ethiopia.",
        "category": "Content Writing",
        "budget": 3000.0,
        "skills": ['Content Writing'],
        "days_until_deadline": 7,
        "status": JobStatus.OPEN,
    },
    {
        "client_idx": 2,
        "title": "Machine Learning Model for Crop Price Prediction",
        "description": "Build a machine learning model to predict crop prices in Ethiopian markets using historical data from the Ethiopian Commodity Exchange (ECX). Must include data preprocessing, model training, and a simple API endpoint for predictions.",
        "category": "Machine Learning",
        "budget": 20000.0,
        "skills": ['Python', 'Machine Learning', 'Data Analysis'],
        "days_until_deadline": 60,
        "status": JobStatus.OPEN,
    },
]

BIDS_DATA = [
    # job_idx, freelancer_idx, amount, days, proposal, status
    (0, 0, 14000.0, 25, "I have built 3 similar APIs for Ethiopian startups", BidStatus.ACCEPTED),
    (0, 1, 13500.0, 20, "Full-stack developer, can deliver ahead of schedule", BidStatus.REJECTED),
    (2, 2, 11000.0, 12, "I designed 2 fintech apps for Ethiopian banks", BidStatus.ACCEPTED),
    (1, 3, 7500.0, 18, "I built dashboards for 3 Ethiopian retail companies", BidStatus.PENDING),
    (5, 3, 18000.0, 55, "I have worked with ECX data before", BidStatus.PENDING),
]


async def seed():
    async with async_session_maker() as session:
        # ── Check if already seeded ──────────────────────────────────────────
        result = await session.execute(
            select(User).where(User.email == "abebe.girma@gmail.com")
        )
        if result.scalar_one_or_none():
            print("⚠️  Demo data already exists. Skipping seed.")
            return

        print("🌱 Seeding demo data...")
        
        # ── Create Skills ────────────────────────────────────────────────────
        for skill_name in SKILLS_LIST:
            skill = Skill(id=uuid.uuid4(), name=skill_name)
            session.add(skill)
            
        print(f"  ✅ Created {len(SKILLS_LIST)} skills")

        # ── Create Clients ───────────────────────────────────────────────────
        client_objs = []
        for c in CLIENTS:
            user = User(
                id=uuid.uuid4(),
                email=c["email"],
                hashed_password=hash_pw("Demo@1234"),
                name=c["name"],
                role=UserRole.CLIENT,
                bio=c["bio"],
            )
            session.add(user)
            client_objs.append(user)
        print(f"  ✅ Created {len(client_objs)} clients")

        # ── Create Freelancers ───────────────────────────────────────────────
        freelancer_objs = []
        for f in FREELANCERS:
            user = User(
                id=uuid.uuid4(),
                email=f["email"],
                hashed_password=hash_pw("Demo@1234"),
                name=f["name"],
                role=UserRole.FREELANCER,
                bio=f["bio"],
                skills=f["skills"],
            )
            session.add(user)
            freelancer_objs.append(user)
        print(f"  ✅ Created {len(freelancer_objs)} freelancers")

        await session.flush()

        # ── Create Freelancer Profiles ───────────────────────────────────────
        for i, f in enumerate(FREELANCERS):
            profile = FreelancerProfile(
                id=uuid.uuid4(),
                user_id=freelancer_objs[i].id,
                title=f["title"],
                hourly_rate=f["hourly_rate"],
            )
            session.add(profile)
        print(f"  ✅ Created {len(FREELANCERS)} freelancer profiles")

        await session.flush()

        # ── Create Jobs ──────────────────────────────────────────────────────
        job_objs = []
        for j in JOBS:
            job = Job(
                id=uuid.uuid4(),
                title=j["title"],
                description=j["description"],
                category=j["category"],
                budget=j["budget"],
                skills=j["skills"],
                deadline=datetime.utcnow() + timedelta(days=j["days_until_deadline"]),
                status=j["status"],
                client_id=client_objs[j["client_idx"]].id,
                created_at=datetime.utcnow() - timedelta(days=3),
            )
            session.add(job)
            job_objs.append(job)
        print(f"  ✅ Created {len(job_objs)} jobs")

        await session.flush()

        # ── Create Bids ──────────────────────────────────────────────────────
        bid_objs = []
        for (ji, fi, amount, days, proposal, bstatus) in BIDS_DATA:
            bid = Bid(
                id=uuid.uuid4(),
                job_id=job_objs[ji].id,
                freelancer_id=freelancer_objs[fi].id,
                amount=amount,
                delivery_days=days,
                proposal=proposal,
                status=bstatus,
                created_at=datetime.utcnow() - timedelta(days=1),
            )
            session.add(bid)
            bid_objs.append(bid)
        print(f"  ✅ Created {len(bid_objs)} bids")

        await session.flush()

        # ── Create Contracts (for accepted bids) ─────────────────────────────
        accepted_pairs = [
            (0, 0, 0),  # bid_idx=0 → job_idx=0, freelancer_idx=0 (Meron)
            (2, 2, 2),  # bid_idx=2 → job_idx=2, freelancer_idx=2 (Hiwot)
        ]
        for idx, (bid_idx, job_idx, fl_idx) in enumerate(accepted_pairs):
            bid = bid_objs[bid_idx]
            job = job_objs[job_idx]
            contract = Contract(
                id=uuid.uuid4(),
                job_id=job.id,
                client_id=client_objs[JOBS[job_idx]["client_idx"]].id,
                freelancer_id=freelancer_objs[fl_idx].id,
                bid_id=bid.id,
                amount=bid.amount,
                status=ContractStatus.ACTIVE,
                start_date=datetime.utcnow() - timedelta(days=5),
            )
            session.add(contract)
        print(f"  ✅ Created 2 active contracts")

        await session.flush()

        # ── Create Notifications ─────────────────────────────────────────────
        notifications = [
            Notification(id=uuid.uuid4(), user_id=client_objs[0].id, title="New Bid Received", message="Meron Tadesse placed a bid of $14,000 on your REST API project.", type=NotificationType.BID, read=False, link="/client/jobs"),
            Notification(id=uuid.uuid4(), user_id=client_objs[0].id, title="New Bid Received", message="Yonas Alemu placed a bid of $13,500 on your REST API project.", type=NotificationType.BID, read=False, link="/client/jobs"),
            Notification(id=uuid.uuid4(), user_id=freelancer_objs[0].id, title="🎉 Bid Accepted!", message="You were hired for REST API job. Check your contracts.", type=NotificationType.CONTRACT, read=False, link="/freelancer/contracts"),
            Notification(id=uuid.uuid4(), user_id=client_objs[1].id, title="New Bid Received", message="Hiwot Tesfaye placed a bid of $11,000 on your UI/UX project.", type=NotificationType.BID, read=False, link="/client/jobs"),
            Notification(id=uuid.uuid4(), user_id=freelancer_objs[2].id, title="🎉 Bid Accepted!", message="You were hired for UI/UX job. Check your contracts.", type=NotificationType.CONTRACT, read=False, link="/freelancer/contracts"),
        ]
        for n in notifications:
            session.add(n)
        print(f"  ✅ Created {len(notifications)} notifications")

        await session.commit()
        print("\n🎉 Seeding complete!\n")
        print("=" * 50)
        print("Demo Login Credentials (password: Demo@1234)")
        print("=" * 50)
        print("\n👤 CLIENTS:")
        for c in CLIENTS:
            print(f"   Email: {c['email']}")
        print("\n💼 FREELANCERS:")
        for f in FREELANCERS:
            print(f"   Email: {f['email']}")
        print("\n   Password for all accounts: Demo@1234")
        print("=" * 50)


if __name__ == "__main__":
    asyncio.run(seed())
