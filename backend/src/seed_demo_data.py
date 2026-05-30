import asyncio
from datetime import datetime, timedelta
from sqlalchemy import select, func, insert

from src.database import async_session_maker
from src.models.user import User, UserRole
from src.models.job import Job, JobStatus
from src.models.bid import Bid, BidStatus
from src.models.contract import Contract, ContractStatus
from src.models.message import Message
from src.models.notification import Notification, NotificationType
from src.models.review import Review, ReviewType
from src.models.skill import Skill, user_skills, job_skills
from src.models.freelancer_profile import FreelancerProfile

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def seed_demo_data():
    async with async_session_maker() as session:
        print("Seeding demo data for registered users...")

        # Define the users we want to work with
        client_emails = [
            "abebe.girma@gmail.com",
            "tigist.haile@gmail.com",
            "dawit.bekele@gmail.com"
        ]
        
        freelancer_emails = [
            "meron.tadesse@gmail.com",
            "yonas.alemu@gmail.com",
            "hiwot.tesfaye@gmail.com",
            "biniam.kebede@gmail.com"
        ]

        # Get or create client users
        clients = []
        for email in client_emails:
            user = (await session.execute(select(User).where(User.email == email))).scalar_one_or_none()
            if not user:
                # Create user with proper name
                name_map = {
                    "abebe.girma@gmail.com": "Abebe Girma",
                    "tigist.haile@gmail.com": "Tigist Haile",
                    "dawit.bekele@gmail.com": "Dawit Bekele"
                }
                user = User(
                    email=email,
                    hashed_password=get_password_hash("Demo@1234"),
                    name=name_map[email],
                    role=UserRole.CLIENT,
                    avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
                    bio=f"{name_map[email]} - Client user",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(user)
                await session.flush()
                print(f"✓ Created client: {email}")
            else:
                print(f"✓ Found client: {email}")
            clients.append(user)

        # Get or create freelancer users
        freelancers = []
        for email in freelancer_emails:
            user = (await session.execute(select(User).where(User.email == email))).scalar_one_or_none()
            if not user:
                # Create user with proper name
                name_map = {
                    "meron.tadesse@gmail.com": "Meron Tadesse",
                    "yonas.alemu@gmail.com": "Yonas Alemu",
                    "hiwot.tesfaye@gmail.com": "Hiwot Tesfaye",
                    "biniam.kebede@gmail.com": "Biniam Kebede"
                }
                user = User(
                    email=email,
                    hashed_password=get_password_hash("Demo@1234"),
                    name=name_map[email],
                    role=UserRole.FREELANCER,
                    avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
                    bio=f"{name_map[email]} - Freelancer",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(user)
                await session.flush()
                print(f"✓ Created freelancer: {email}")
            else:
                print(f"✓ Found freelancer: {email}")
            freelancers.append(user)

        # Create or get skills
        skills_data = [
            {"name": "Python", "category": "Programming"},
            {"name": "JavaScript", "category": "Programming"},
            {"name": "TypeScript", "category": "Programming"},
            {"name": "React", "category": "Frontend"},
            {"name": "Vue.js", "category": "Frontend"},
            {"name": "Node.js", "category": "Backend"},
            {"name": "FastAPI", "category": "Backend"},
            {"name": "Django", "category": "Backend"},
            {"name": "PostgreSQL", "category": "Database"},
            {"name": "MongoDB", "category": "Database"},
            {"name": "Docker", "category": "DevOps"},
            {"name": "AWS", "category": "DevOps"},
            {"name": "UI/UX Design", "category": "Design"},
            {"name": "Figma", "category": "Design"},
            {"name": "Graphic Design", "category": "Design"},
            {"name": "Content Writing", "category": "Writing"},
            {"name": "SEO", "category": "Marketing"},
            {"name": "Digital Marketing", "category": "Marketing"},
            {"name": "Mobile Development", "category": "Mobile"},
            {"name": "React Native", "category": "Mobile"},
        ]

        skills = {}
        for skill_data in skills_data:
            skill = (await session.execute(select(Skill).where(Skill.name == skill_data["name"]))).scalar_one_or_none()
            if not skill:
                skill = Skill(name=skill_data["name"], category=skill_data["category"], created_at=datetime.utcnow())
                session.add(skill)
                await session.flush()
            skills[skill.name] = skill

        print(f"✓ Skills ready ({len(skills)} skills)...")

        # Assign skills to freelancers
        freelancer_skills = {
            0: ["Python", "Django", "PostgreSQL", "React"],  # Meron
            1: ["JavaScript", "TypeScript", "React", "Vue.js"],  # Yonas
            2: ["UI/UX Design", "Figma", "Graphic Design"],  # Hiwot
            3: ["Python", "FastAPI", "Node.js", "MongoDB", "Docker"],  # Biniam
        }

        for idx, freelancer in enumerate(freelancers):
            if idx < len(freelancer_skills):
                for skill_name in freelancer_skills[idx]:
                    if skill_name in skills:
                        # Check if user skill already exists
                        result = await session.execute(
                            select(func.count()).select_from(user_skills).where(
                                (user_skills.c.user_id == freelancer.id) & 
                                (user_skills.c.skill_id == skills[skill_name].id)
                            )
                        )
                        if result.scalar() == 0:
                            await session.execute(
                                insert(user_skills).values(user_id=freelancer.id, skill_id=skills[skill_name].id)
                            )

        print("✓ Assigned skills to freelancers...")

        # Create freelancer profiles if they don't exist
        from src.models.freelancer_profile import FreelancerProfile
        for idx, freelancer in enumerate(freelancers):
            profile = (await session.execute(
                select(FreelancerProfile).where(FreelancerProfile.user_id == freelancer.id)
            )).scalar_one_or_none()
            
            if not profile:
                titles = ["Full-Stack Developer", "Frontend Developer", "UI/UX Designer", "Backend Engineer"]
                rates = [45.0, 35.0, 40.0, 50.0]
                exp = [5, 3, 4, 6]
                
                profile = FreelancerProfile(
                    user_id=freelancer.id,
                    title=titles[idx] if idx < len(titles) else "Developer",
                    hourly_rate=rates[idx] if idx < len(rates) else 30.0,
                    availability="Full-time",
                    years_of_experience=exp[idx] if idx < len(exp) else 3,
                    portfolio_url=f"https://portfolio.example.com/{freelancer.email.split('@')[0]}",
                    linkedin_url=f"https://linkedin.com/in/{freelancer.email.split('@')[0]}",
                    github_url=f"https://github.com/{freelancer.email.split('@')[0]}",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(profile)

        print("✓ Created freelancer profiles...")

        # Check if jobs already exist for these clients
        existing_jobs = (await session.execute(
            select(func.count()).select_from(Job).where(
                Job.client_id.in_([c.id for c in clients])
            )
        )).scalar()

        if existing_jobs > 0:
            print(f"Jobs already exist for these clients ({existing_jobs} jobs). Skipping job creation.")
            jobs = (await session.execute(
                select(Job).where(Job.client_id.in_([c.id for c in clients]))
            )).scalars().all()
        else:
            # Create Jobs
            jobs_data = [
                {
                    "title": "Build an E-commerce Website",
                    "description": "Need a full-featured e-commerce platform with product catalog, shopping cart, user authentication, and payment integration. Must be responsive and SEO optimized.",
                    "category": "Web Development",
                    "budget": 3000.0,
                    "deadline_days": 30,
                    "skills": ["Python", "Django", "React", "PostgreSQL"],
                    "status": JobStatus.OPEN,
                    "client_idx": 0  # Abebe
                },
                {
                    "title": "Design Mobile App UI",
                    "description": "Looking for a skilled UI/UX designer to design a mobile app for food delivery. Need wireframes, prototypes, and final designs.",
                    "category": "Design",
                    "budget": 1500.0,
                    "deadline_days": 20,
                    "skills": ["UI/UX Design", "Figma"],
                    "status": JobStatus.OPEN,
                    "client_idx": 1  # Tigist
                },
                {
                    "title": "SEO Optimization for Blog",
                    "description": "Need help optimizing our blog for search engines. Looking for keyword research, content optimization, and technical SEO improvements.",
                    "category": "Marketing",
                    "budget": 800.0,
                    "deadline_days": 15,
                    "skills": ["SEO", "Content Writing", "Digital Marketing"],
                    "status": JobStatus.OPEN,
                    "client_idx": 2  # Dawit
                },
                {
                    "title": "React Native App Development",
                    "description": "Building a fitness tracking mobile app with React Native. Need features like workout logging, progress tracking, and social sharing.",
                    "category": "Mobile Development",
                    "budget": 4000.0,
                    "deadline_days": 45,
                    "skills": ["React Native", "Mobile Development", "JavaScript"],
                    "status": JobStatus.IN_PROGRESS,
                    "client_idx": 0  # Abebe
                },
                {
                    "title": "Backend API Development",
                    "description": "Need to build a RESTful API for a real estate platform. Should include property listings, user management, and search functionality.",
                    "category": "Backend Development",
                    "budget": 2500.0,
                    "deadline_days": 25,
                    "skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
                    "status": JobStatus.OPEN,
                    "client_idx": 1  # Tigist
                },
                {
                    "title": "Website Content Writing",
                    "description": "Need engaging content for a new tech startup website. About 10 pages including homepage, services, about us, and blog posts.",
                    "category": "Writing",
                    "budget": 600.0,
                    "deadline_days": 10,
                    "skills": ["Content Writing", "SEO"],
                    "status": JobStatus.CLOSED,
                    "client_idx": 2  # Dawit
                },
            ]

            jobs = []
            for job_data in jobs_data:
                job = Job(
                    title=job_data["title"],
                    description=job_data["description"],
                    category=job_data["category"],
                    budget=job_data["budget"],
                    deadline=datetime.utcnow() + timedelta(days=job_data["deadline_days"]),
                    skills=job_data["skills"],
                    status=job_data["status"],
                    client_id=clients[job_data["client_idx"]].id,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(job)
                await session.flush()

                # Add job skills
                for skill_name in job_data["skills"]:
                    if skill_name in skills:
                        await session.execute(
                            insert(job_skills).values(job_id=job.id, skill_id=skills[skill_name].id)
                        )

                jobs.append(job)

            print(f"✓ Created {len(jobs)} jobs...")

        # Check if bids already exist
        existing_bids = (await session.execute(select(func.count()).select_from(Bid))).scalar()

        if existing_bids > 0:
            print(f"Bids already exist ({existing_bids} bids). Skipping bid creation.")
            bids = (await session.execute(select(Bid))).scalars().all()
        else:
            # Create Bids
            bids_data = [
                {
                    "job_idx": 0,
                    "freelancer_idx": 0,  # Meron
                    "amount": 2800.0,
                    "delivery_days": 28,
                    "proposal": "I have extensive experience building e-commerce platforms with Django and React. I'll deliver a fully functional, SEO-optimized store.",
                    "status": BidStatus.PENDING
                },
                {
                    "job_idx": 0,
                    "freelancer_idx": 3,  # Biniam
                    "amount": 3200.0,
                    "delivery_days": 25,
                    "proposal": "As a backend specialist, I'll build a robust e-commerce solution with microservices architecture using FastAPI and React.",
                    "status": BidStatus.PENDING
                },
                {
                    "job_idx": 1,
                    "freelancer_idx": 2,  # Hiwot
                    "amount": 1400.0,
                    "delivery_days": 18,
                    "proposal": "I'm a UI/UX designer with strong portfolio in mobile app design. I'll create intuitive and beautiful designs for your food delivery app.",
                    "status": BidStatus.ACCEPTED
                },
                {
                    "job_idx": 2,
                    "freelancer_idx": 0,  # Meron
                    "amount": 750.0,
                    "delivery_days": 12,
                    "proposal": "I specialize in SEO and content optimization. I'll conduct thorough keyword research and optimize all your blog content.",
                    "status": BidStatus.ACCEPTED
                },
                {
                    "job_idx": 3,
                    "freelancer_idx": 1,  # Yonas
                    "amount": 3800.0,
                    "delivery_days": 40,
                    "proposal": "React Native expert here. I've built multiple fitness apps with similar features. I'll deliver a high-quality cross-platform app.",
                    "status": BidStatus.ACCEPTED
                },
                {
                    "job_idx": 4,
                    "freelancer_idx": 3,  # Biniam
                    "amount": 2300.0,
                    "delivery_days": 22,
                    "proposal": "FastAPI is my specialty. I'll build a scalable, well-documented RESTful API for your real estate platform.",
                    "status": BidStatus.PENDING
                },
                {
                    "job_idx": 4,
                    "freelancer_idx": 0,  # Meron
                    "amount": 2600.0,
                    "delivery_days": 24,
                    "proposal": "I can build this API using Django REST Framework with PostgreSQL. Solid, reliable, and well-tested.",
                    "status": BidStatus.PENDING
                },
                {
                    "job_idx": 5,
                    "freelancer_idx": 0,  # Meron
                    "amount": 550.0,
                    "delivery_days": 8,
                    "proposal": "Experienced content writer here. I'll create engaging, SEO-optimized content for all your website pages.",
                    "status": BidStatus.ACCEPTED
                },
            ]

            bids = []
            for bid_data in bids_data:
                if bid_data["job_idx"] < len(jobs) and bid_data["freelancer_idx"] < len(freelancers):
                    bid = Bid(
                        job_id=jobs[bid_data["job_idx"]].id,
                        freelancer_id=freelancers[bid_data["freelancer_idx"]].id,
                        amount=bid_data["amount"],
                        delivery_days=bid_data["delivery_days"],
                        proposal=bid_data["proposal"],
                        status=bid_data["status"],
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    session.add(bid)
                    await session.flush()
                    bids.append(bid)

            print(f"✓ Created {len(bids)} bids...")

        # Create Contracts for accepted bids
        existing_contracts = (await session.execute(select(func.count()).select_from(Contract))).scalar()

        if existing_contracts > 0:
            print(f"Contracts already exist ({existing_contracts} contracts). Skipping contract creation.")
        else:
            contracts = []
            for bid in bids:
                if bid.status == BidStatus.ACCEPTED:
                    job = (await session.execute(select(Job).where(Job.id == bid.job_id))).scalar_one()
                    contract = Contract(
                        job_id=bid.job_id,
                        client_id=job.client_id,
                        freelancer_id=bid.freelancer_id,
                        bid_id=bid.id,
                        amount=bid.amount,
                        start_date=datetime.utcnow() - timedelta(days=5),
                        status=ContractStatus.ACTIVE if job.status == JobStatus.IN_PROGRESS else ContractStatus.COMPLETED,
                        created_at=datetime.utcnow(),
                    )
                    session.add(contract)
                    await session.flush()
                    contracts.append(contract)

            print(f"✓ Created {len(contracts)} contracts...")

        # Create Messages
        existing_messages = (await session.execute(select(func.count()).select_from(Message))).scalar()

        if existing_messages > 0:
            print(f"Messages already exist ({existing_messages} messages). Skipping message creation.")
        elif clients and freelancers:
            messages_data = [
                {
                    "sender": clients[0],  # Abebe
                    "receiver": freelancers[0],  # Meron
                    "content": "Hi Meron, I saw your bid on my e-commerce project. Can we discuss the timeline?",
                    "days_ago": 2
                },
                {
                    "sender": freelancers[0],  # Meron
                    "receiver": clients[0],  # Abebe
                    "content": "Sure Abebe! I can complete it in 28 days as mentioned. Let me know if you have specific milestones in mind.",
                    "days_ago": 2
                },
                {
                    "sender": clients[1],  # Tigist
                    "receiver": freelancers[2],  # Hiwot
                    "content": "Hi Hiwot, I've accepted your bid for the mobile app design. When can we start?",
                    "days_ago": 5
                },
                {
                    "sender": freelancers[2],  # Hiwot
                    "receiver": clients[1],  # Tigist
                    "content": "Great news Tigist! I can start immediately. I'll send you the initial wireframes within 3 days.",
                    "days_ago": 5
                },
                {
                    "sender": clients[2],  # Dawit
                    "receiver": freelancers[0],  # Meron
                    "content": "Meron, the content you wrote for the website is excellent. Thank you!",
                    "days_ago": 1
                },
            ]

            for msg_data in messages_data:
                message = Message(
                    sender_id=msg_data["sender"].id,
                    receiver_id=msg_data["receiver"].id,
                    content=msg_data["content"],
                    read=False,
                    created_at=datetime.utcnow() - timedelta(days=msg_data["days_ago"]),
                )
                session.add(message)

            print(f"✓ Created {len(messages_data)} messages...")

        # Create Notifications
        existing_notifs = (await session.execute(select(func.count()).select_from(Notification))).scalar()

        if existing_notifs > 0:
            print(f"Notifications already exist ({existing_notifs} notifications). Skipping notification creation.")
        elif clients and freelancers:
            notifications_data = [
                {
                    "user": freelancers[2],  # Hiwot
                    "title": "Bid Accepted!",
                    "message": "Your bid for 'Design Mobile App UI' has been accepted.",
                    "type": NotificationType.BID,
                    "days_ago": 5
                },
                {
                    "user": freelancers[0],  # Meron
                    "title": "Bid Accepted!",
                    "message": "Your bid for 'Website Content Writing' has been accepted.",
                    "type": NotificationType.BID,
                    "days_ago": 1
                },
                {
                    "user": freelancers[0],  # Meron
                    "title": "New Message",
                    "message": "You have a new message from Abebe Girma regarding 'Build an E-commerce Website'.",
                    "type": NotificationType.MESSAGE,
                    "days_ago": 2
                },
                {
                    "user": clients[0],  # Abebe
                    "title": "New Bid Received",
                    "message": "Meron Tadesse placed a bid on your job 'Build an E-commerce Website'.",
                    "type": NotificationType.BID,
                    "days_ago": 3
                },
                {
                    "user": clients[1],  # Tigist
                    "title": "Contract Started",
                    "message": "Contract for 'Design Mobile App UI' is now active.",
                    "type": NotificationType.CONTRACT,
                    "days_ago": 5
                },
            ]

            for notif_data in notifications_data:
                notification = Notification(
                    user_id=notif_data["user"].id,
                    title=notif_data["title"],
                    message=notif_data["message"],
                    type=notif_data["type"],
                    read=False,
                    link="/dashboard",
                    created_at=datetime.utcnow() - timedelta(days=notif_data["days_ago"]),
                )
                session.add(notification)

            print(f"✓ Created {len(notifications_data)} notifications...")

        # Create Reviews for completed contracts
        existing_reviews = (await session.execute(select(func.count()).select_from(Review))).scalar()

        if existing_reviews > 0:
            print(f"Reviews already exist ({existing_reviews} reviews). Skipping review creation.")
        else:
            # Find completed contracts
            completed_contracts = (await session.execute(
                select(Contract).where(Contract.status == ContractStatus.COMPLETED)
            )).scalars().all()

            if completed_contracts and len(freelancers) >= 1 and len(clients) >= 1:
                # Create review for the content writing contract
                review1 = Review(
                    contract_id=completed_contracts[0].id,
                    reviewer_id=clients[2].id,  # Dawit (client)
                    reviewee_id=freelancers[0].id,  # Meron (freelancer)
                    rating=5,
                    comment="Excellent work! The content was engaging and SEO-optimized. Will hire again.",
                    review_type=ReviewType.CLIENT_REVIEW,
                    created_at=datetime.utcnow() - timedelta(days=1),
                )
                session.add(review1)

                review2 = Review(
                    contract_id=completed_contracts[0].id,
                    reviewer_id=freelancers[0].id,  # Meron
                    reviewee_id=clients[2].id,  # Dawit
                    rating=5,
                    comment="Great client to work with. Clear requirements and quick feedback.",
                    review_type=ReviewType.FREELANCER_REVIEW,
                    created_at=datetime.utcnow() - timedelta(days=1),
                )
                session.add(review2)

                print("✓ Created reviews...")

        await session.commit()
        print("\n✅ Demo data seeding completed!")
        print("\nDemo Accounts:")
        print("Clients:")
        for email in client_emails:
            print(f"  - {email} / Demo@1234")
        print("Freelancers:")
        for email in freelancer_emails:
            print(f"  - {email} / Demo@1234")


if __name__ == "__main__":
    asyncio.run(seed_demo_data())
