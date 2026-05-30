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


async def seed_data():
    async with async_session_maker() as session:
        print("Checking and seeding database with demo data...")

        # Check existing data counts
        user_count = (await session.execute(select(func.count()).select_from(User))).scalar()
        skill_count = (await session.execute(select(func.count()).select_from(Skill))).scalar()
        job_count = (await session.execute(select(func.count()).select_from(Job))).scalar()

        print(f"Existing data: {user_count} users, {skill_count} skills, {job_count} jobs")

        # Create Skills if none exist
        skills = {}
        if skill_count == 0:
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

            for skill_data in skills_data:
                skill = Skill(name=skill_data["name"], category=skill_data["category"], created_at=datetime.utcnow())
                session.add(skill)
                await session.flush()
                skills[skill_data["name"]] = skill

            print("✓ Created skills...")
        else:
            # Load existing skills
            result = await session.execute(select(Skill))
            for skill in result.scalars():
                skills[skill.name] = skill
            print("✓ Skills already exist...")

        # Create Admin if not exists
        admin = (await session.execute(select(User).where(User.email == "admin@kefit.com"))).scalar_one_or_none()
        if not admin:
            admin = User(
                email="admin@kefit.com",
                hashed_password=get_password_hash("admin123"),
                name="Admin User",
                role=UserRole.ADMIN,
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
                bio="System administrator",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            session.add(admin)
            await session.flush()
            print("✓ Created admin user...")
        else:
            print("✓ Admin user already exists...")

        # Create Clients if they don't exist
        clients_data = [
            {"email": "client1@kefit.com", "name": "Abebe Kebede", "bio": "Startup founder looking for talented developers"},
            {"email": "client2@kefit.com", "name": "Tigist Haile", "bio": "Marketing agency owner needing web solutions"},
            {"email": "client3@kefit.com", "name": "Mohammed Ali", "bio": "Entrepreneur with multiple projects"},
        ]

        clients = []
        for client_data in clients_data:
            client = (await session.execute(select(User).where(User.email == client_data["email"]))).scalar_one_or_none()
            if not client:
                client = User(
                    email=client_data["email"],
                    hashed_password=get_password_hash("password123"),
                    name=client_data["name"],
                    role=UserRole.CLIENT,
                    avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={client_data['email']}",
                    bio=client_data["bio"],
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(client)
                await session.flush()
                print(f"✓ Created client: {client_data['email']}...")
            else:
                print(f"✓ Client already exists: {client_data['email']}...")
            clients.append(client)

        # Create Freelancers if they don't exist
        freelancers_data = [
            {
                "email": "freelancer1@kefit.com",
                "name": "Sara Tesfaye",
                "bio": "Full-stack developer with 5 years experience",
                "skills": ["Python", "Django", "PostgreSQL", "React"],
                "title": "Senior Full-Stack Developer",
                "hourly_rate": 45.0,
                "years_exp": 5
            },
            {
                "email": "freelancer2@kefit.com",
                "name": "Dawit Bekele",
                "bio": "Frontend specialist focused on React and Vue",
                "skills": ["JavaScript", "TypeScript", "React", "Vue.js"],
                "title": "Frontend Developer",
                "hourly_rate": 35.0,
                "years_exp": 3
            },
            {
                "email": "freelancer3@kefit.com",
                "name": "Hanan Mohammed",
                "bio": "UI/UX designer creating beautiful interfaces",
                "skills": ["UI/UX Design", "Figma", "Graphic Design"],
                "title": "UI/UX Designer",
                "hourly_rate": 40.0,
                "years_exp": 4
            },
            {
                "email": "freelancer4@kefit.com",
                "name": "Yonas Girma",
                "bio": "Backend developer specializing in APIs and microservices",
                "skills": ["Python", "FastAPI", "Node.js", "MongoDB", "Docker"],
                "title": "Backend Engineer",
                "hourly_rate": 50.0,
                "years_exp": 6
            },
            {
                "email": "freelancer5@kefit.com",
                "name": "Meron Tadesse",
                "bio": "Content writer and digital marketing expert",
                "skills": ["Content Writing", "SEO", "Digital Marketing"],
                "title": "Content & Marketing Specialist",
                "hourly_rate": 25.0,
                "years_exp": 3
            },
        ]

        freelancers = []
        for fl_data in freelancers_data:
            freelancer = (await session.execute(select(User).where(User.email == fl_data["email"]))).scalar_one_or_none()
            if not freelancer:
                freelancer = User(
                    email=fl_data["email"],
                    hashed_password=get_password_hash("password123"),
                    name=fl_data["name"],
                    role=UserRole.FREELANCER,
                    avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={fl_data['email']}",
                    bio=fl_data["bio"],
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(freelancer)
                await session.flush()

                # Create freelancer profile
                profile = FreelancerProfile(
                    user_id=freelancer.id,
                    title=fl_data["title"],
                    hourly_rate=fl_data["hourly_rate"],
                    availability="Full-time",
                    years_of_experience=fl_data["years_exp"],
                    portfolio_url=f"https://portfolio.example.com/{fl_data['email'].split('@')[0]}",
                    linkedin_url=f"https://linkedin.com/in/{fl_data['email'].split('@')[0]}",
                    github_url=f"https://github.com/{fl_data['email'].split('@')[0]}",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(profile)

                # Add user skills
                for skill_name in fl_data["skills"]:
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

                print(f"✓ Created freelancer: {fl_data['email']}...")
            else:
                print(f"✓ Freelancer already exists: {fl_data['email']}...")
            freelancers.append(freelancer)

        # Create Jobs if none exist
        if job_count == 0:
            jobs_data = [
                {
                    "title": "Build an E-commerce Website",
                    "description": "Need a full-featured e-commerce platform with product catalog, shopping cart, user authentication, and payment integration. Must be responsive and SEO optimized.",
                    "category": "Web Development",
                    "budget": 3000.0,
                    "deadline_days": 30,
                    "skills": ["Python", "Django", "React", "PostgreSQL"],
                    "status": JobStatus.OPEN,
                    "client": clients[0]
                },
                {
                    "title": "Design Mobile App UI",
                    "description": "Looking for a skilled UI/UX designer to design a mobile app for food delivery. Need wireframes, prototypes, and final designs.",
                    "category": "Design",
                    "budget": 1500.0,
                    "deadline_days": 20,
                    "skills": ["UI/UX Design", "Figma"],
                    "status": JobStatus.OPEN,
                    "client": clients[1]
                },
                {
                    "title": "SEO Optimization for Blog",
                    "description": "Need help optimizing our blog for search engines. Looking for keyword research, content optimization, and technical SEO improvements.",
                    "category": "Marketing",
                    "budget": 800.0,
                    "deadline_days": 15,
                    "skills": ["SEO", "Content Writing", "Digital Marketing"],
                    "status": JobStatus.OPEN,
                    "client": clients[2]
                },
                {
                    "title": "React Native App Development",
                    "description": "Building a fitness tracking mobile app with React Native. Need features like workout logging, progress tracking, and social sharing.",
                    "category": "Mobile Development",
                    "budget": 4000.0,
                    "deadline_days": 45,
                    "skills": ["React Native", "Mobile Development", "JavaScript"],
                    "status": JobStatus.IN_PROGRESS,
                    "client": clients[0]
                },
                {
                    "title": "Backend API Development",
                    "description": "Need to build a RESTful API for a real estate platform. Should include property listings, user management, and search functionality.",
                    "category": "Backend Development",
                    "budget": 2500.0,
                    "deadline_days": 25,
                    "skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
                    "status": JobStatus.OPEN,
                    "client": clients[1]
                },
                {
                    "title": "Website Content Writing",
                    "description": "Need engaging content for a new tech startup website. About 10 pages including homepage, services, about us, and blog posts.",
                    "category": "Writing",
                    "budget": 600.0,
                    "deadline_days": 10,
                    "skills": ["Content Writing", "SEO"],
                    "status": JobStatus.CLOSED,
                    "client": clients[2]
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
                    client_id=job_data["client"].id,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(job)
                await session.flush()

                # Add job skills
                for skill_name in job_data["skills"]:
                    if skill_name in skills:
                        # Check if job skill already exists
                        result = await session.execute(
                            select(func.count()).select_from(job_skills).where(
                                (job_skills.c.job_id == job.id) & 
                                (job_skills.c.skill_id == skills[skill_name].id)
                            )
                        )
                        if result.scalar() == 0:
                            await session.execute(
                                insert(job_skills).values(job_id=job.id, skill_id=skills[skill_name].id)
                            )

                jobs.append(job)

            print("✓ Created jobs...")
        else:
            # Load existing jobs
            result = await session.execute(select(Job))
            jobs = list(result.scalars())
            print(f"✓ Jobs already exist ({len(jobs)} jobs)...")

        # Create Bids if none exist
        bid_count = (await session.execute(select(func.count()).select_from(Bid))).scalar()
        if bid_count == 0 and len(jobs) >= 6 and len(freelancers) >= 5:
            bids_data = [
                {
                    "job": jobs[0],
                    "freelancer": freelancers[0],
                    "amount": 2800.0,
                    "delivery_days": 28,
                    "proposal": "I have extensive experience building e-commerce platforms with Django and React. I'll deliver a fully functional, SEO-optimized store.",
                    "status": BidStatus.PENDING
                },
                {
                    "job": jobs[0],
                    "freelancer": freelancers[3],
                    "amount": 3200.0,
                    "delivery_days": 25,
                    "proposal": "As a backend specialist, I'll build a robust e-commerce solution with microservices architecture using FastAPI and React.",
                    "status": BidStatus.PENDING
                },
                {
                    "job": jobs[1],
                    "freelancer": freelancers[2],
                    "amount": 1400.0,
                    "delivery_days": 18,
                    "proposal": "I'm a UI/UX designer with strong portfolio in mobile app design. I'll create intuitive and beautiful designs for your food delivery app.",
                    "status": BidStatus.ACCEPTED
                },
                {
                    "job": jobs[2],
                    "freelancer": freelancers[4],
                    "amount": 750.0,
                    "delivery_days": 12,
                    "proposal": "I specialize in SEO and content optimization. I'll conduct thorough keyword research and optimize all your blog content.",
                    "status": BidStatus.ACCEPTED
                },
                {
                    "job": jobs[3],
                    "freelancer": freelancers[1],
                    "amount": 3800.0,
                    "delivery_days": 40,
                    "proposal": "React Native expert here. I've built multiple fitness apps with similar features. I'll deliver a high-quality cross-platform app.",
                    "status": BidStatus.ACCEPTED
                },
                {
                    "job": jobs[4],
                    "freelancer": freelancers[3],
                    "amount": 2300.0,
                    "delivery_days": 22,
                    "proposal": "FastAPI is my specialty. I'll build a scalable, well-documented RESTful API for your real estate platform.",
                    "status": BidStatus.PENDING
                },
                {
                    "job": jobs[4],
                    "freelancer": freelancers[0],
                    "amount": 2600.0,
                    "delivery_days": 24,
                    "proposal": "I can build this API using Django REST Framework with PostgreSQL. Solid, reliable, and well-tested.",
                    "status": BidStatus.PENDING
                },
                {
                    "job": jobs[5],
                    "freelancer": freelancers[4],
                    "amount": 550.0,
                    "delivery_days": 8,
                    "proposal": "Experienced content writer here. I'll create engaging, SEO-optimized content for all your website pages.",
                    "status": BidStatus.ACCEPTED
                },
            ]

            bids = []
            for bid_data in bids_data:
                bid = Bid(
                    job_id=bid_data["job"].id,
                    freelancer_id=bid_data["freelancer"].id,
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

            print("✓ Created bids...")
        else:
            bids = (await session.execute(select(Bid))).scalars().all()
            print(f"✓ Bids already exist ({len(bids)} bids)...")

        # Create Contracts for accepted bids
        contract_count = (await session.execute(select(func.count()).select_from(Contract))).scalar()
        if contract_count == 0 and bids:
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

            print("✓ Created contracts...")
        else:
            contracts = (await session.execute(select(Contract))).scalars().all()
            print(f"✓ Contracts already exist ({len(contracts)} contracts)...")

        # Create Messages if none exist
        message_count = (await session.execute(select(func.count()).select_from(Message))).scalar()
        if message_count == 0 and clients and freelancers:
            messages_data = [
                {
                    "sender": clients[0],
                    "receiver": freelancers[0],
                    "content": "Hi Sara, I saw your bid on my e-commerce project. Can we discuss the timeline?",
                    "days_ago": 2
                },
                {
                    "sender": freelancers[0],
                    "receiver": clients[0],
                    "content": "Sure Abebe! I can complete it in 28 days as mentioned. Let me know if you have specific milestones in mind.",
                    "days_ago": 2
                },
                {
                    "sender": clients[1],
                    "receiver": freelancers[2],
                    "content": "Hi Hanan, I've accepted your bid for the mobile app design. When can we start?",
                    "days_ago": 5
                },
                {
                    "sender": freelancers[2],
                    "receiver": clients[1],
                    "content": "Great news Tigist! I can start immediately. I'll send you the initial wireframes within 3 days.",
                    "days_ago": 5
                },
                {
                    "sender": clients[2],
                    "receiver": freelancers[4],
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

            print("✓ Created messages...")
        else:
            print(f"✓ Messages already exist ({message_count} messages)...")

        # Create Notifications if none exist
        notif_count = (await session.execute(select(func.count()).select_from(Notification))).scalar()
        if notif_count == 0 and freelancers and clients:
            notifications_data = [
                {
                    "user": freelancers[2],
                    "title": "Bid Accepted!",
                    "message": "Your bid for 'Design Mobile App UI' has been accepted.",
                    "type": NotificationType.BID,
                    "days_ago": 5
                },
                {
                    "user": freelancers[4],
                    "title": "Bid Accepted!",
                    "message": "Your bid for 'Website Content Writing' has been accepted.",
                    "type": NotificationType.BID,
                    "days_ago": 1
                },
                {
                    "user": freelancers[0],
                    "title": "New Message",
                    "message": "You have a new message from Abebe Kebede regarding 'Build an E-commerce Website'.",
                    "type": NotificationType.MESSAGE,
                    "days_ago": 2
                },
                {
                    "user": clients[0],
                    "title": "New Bid Received",
                    "message": "Sara Tesfaye placed a bid on your job 'Build an E-commerce Website'.",
                    "type": NotificationType.BID,
                    "days_ago": 3
                },
                {
                    "user": clients[1],
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

            print("✓ Created notifications...")
        else:
            print(f"✓ Notifications already exist ({notif_count} notifications)...")

        # Create Reviews for completed contracts
        review_count = (await session.execute(select(func.count()).select_from(Review))).scalar()
        if review_count == 0 and contracts:
            # Find completed contracts
            completed_contracts = [c for c in contracts if c.status == ContractStatus.COMPLETED]
            if completed_contracts and len(freelancers) >= 5 and len(clients) >= 3:
                reviews_data = [
                    {
                        "contract": completed_contracts[0],
                        "reviewer": clients[2],
                        "reviewee": freelancers[4],
                        "rating": 5,
                        "comment": "Excellent work! The content was engaging and SEO-optimized. Will hire again.",
                        "review_type": ReviewType.CLIENT_REVIEW
                    },
                    {
                        "contract": completed_contracts[0],
                        "reviewer": freelancers[4],
                        "reviewee": clients[2],
                        "rating": 5,
                        "comment": "Great client to work with. Clear requirements and quick feedback.",
                        "review_type": ReviewType.FREELANCER_REVIEW
                    },
                ]

                for review_data in reviews_data:
                    review = Review(
                        contract_id=review_data["contract"].id,
                        reviewer_id=review_data["reviewer"].id,
                        reviewee_id=review_data["reviewee"].id,
                        rating=review_data["rating"],
                        comment=review_data["comment"],
                        review_type=review_data["review_type"],
                        created_at=datetime.utcnow() - timedelta(days=1),
                    )
                    session.add(review)

                print("✓ Created reviews...")
        else:
            print(f"✓ Reviews already exist ({review_count} reviews)...")

        await session.commit()
        print("\n✅ Database seeding completed!")
        print("\nDemo Accounts:")
        print("Admin: admin@kefit.com / admin123")
        print("Clients: client1@kefit.com, client2@kefit.com, client3@kefit.com / password123")
        print("Freelancers: freelancer1-5@kefit.com / password123")


if __name__ == "__main__":
    asyncio.run(seed_data())
