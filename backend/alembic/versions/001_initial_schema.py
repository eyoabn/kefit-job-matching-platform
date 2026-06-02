"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-04-28

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), nullable=False, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("role", sa.Enum("CLIENT", "FREELANCER", "ADMIN", name="userrole"), nullable=False),
        sa.Column("avatar_url", sa.String(length=500), nullable=True),
        sa.Column("bio", sa.String(length=1000), nullable=True),
        sa.Column("skills", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "skills",
        sa.Column("id", sa.UUID(), nullable=False, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_skills_name"), "skills", ["name"], unique=True)

    op.create_table(
        "freelancer_profiles",
        sa.Column("id", sa.UUID(), nullable=False, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=True),
        sa.Column("hourly_rate", sa.Float(), nullable=True),
        sa.Column("availability", sa.String(length=100), nullable=True),
        sa.Column("portfolio_url", sa.String(length=500), nullable=True),
        sa.Column("linkedin_url", sa.String(length=500), nullable=True),
        sa.Column("github_url", sa.String(length=500), nullable=True),
        sa.Column("years_of_experience", sa.Integer(), nullable=True),
        sa.Column("education", sa.Text(), nullable=True),
        sa.Column("certifications", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )

    op.create_table(
        "jobs",
        sa.Column("id", sa.UUID(), nullable=False, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("title", sa.String(length=500), nullable=False),
        sa.Column("description", sa.String(length=5000), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("budget", sa.Float(), nullable=False),
        sa.Column("deadline", sa.DateTime(), nullable=False),
        sa.Column("skills", sa.JSON(), nullable=False),
        sa.Column("status", sa.Enum("OPEN", "IN_PROGRESS", "CLOSED", name="jobstatus"), nullable=False),
        sa.Column("client_id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["client_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_jobs_title"), "jobs", ["title"], unique=False)

    op.create_table(
        "bids",
        sa.Column("id", sa.UUID(), nullable=False, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("job_id", sa.UUID(), nullable=False),
        sa.Column("freelancer_id", sa.UUID(), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("delivery_days", sa.Integer(), nullable=False),
        sa.Column("proposal", sa.String(length=2000), nullable=False),
        sa.Column("status", sa.Enum("PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN", name="bidstatus"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["freelancer_id"], ["users.id"], ),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("job_id", "freelancer_id", name="uq_job_freelancer"),
    )

    op.create_table(
        "contracts",
        sa.Column("id", sa.UUID(), nullable=False, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("job_id", sa.UUID(), nullable=False),
        sa.Column("client_id", sa.UUID(), nullable=False),
        sa.Column("freelancer_id", sa.UUID(), nullable=False),
        sa.Column("bid_id", sa.UUID(), nullable=False),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("start_date", sa.DateTime(), nullable=False),
        sa.Column("end_date", sa.DateTime(), nullable=True),
        sa.Column("status", sa.Enum("ACTIVE", "COMPLETED", "CANCELLED", name="contractstatus"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["bid_id"], ["bids.id"], ),
        sa.ForeignKeyConstraint(["client_id"], ["users.id"], ),
        sa.ForeignKeyConstraint(["freelancer_id"], ["users.id"], ),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "reviews",
        sa.Column("id", sa.UUID(), nullable=False, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("contract_id", sa.UUID(), nullable=False),
        sa.Column("reviewer_id", sa.UUID(), nullable=False),
        sa.Column("reviewee_id", sa.UUID(), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("comment", sa.String(length=1000), nullable=True),
        sa.Column("review_type", sa.Enum("CLIENT_REVIEW", "FREELANCER_REVIEW", name="reviewtype"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["contract_id"], ["contracts.id"], ),
        sa.ForeignKeyConstraint(["reviewee_id"], ["users.id"], ),
        sa.ForeignKeyConstraint(["reviewer_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("contract_id", "reviewer_id", name="uq_contract_reviewer"),
        sa.CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating_range"),
    )

    op.create_table(
        "messages",
        sa.Column("id", sa.UUID(), nullable=False, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("sender_id", sa.UUID(), nullable=False),
        sa.Column("receiver_id", sa.UUID(), nullable=False),
        sa.Column("content", sa.String(length=2000), nullable=False),
        sa.Column("read", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["receiver_id"], ["users.id"], ),
        sa.ForeignKeyConstraint(["sender_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_conversation", "messages", ["sender_id", "receiver_id"], unique=False)

    op.create_table(
        "notifications",
        sa.Column("id", sa.UUID(), nullable=False, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("message", sa.String(length=500), nullable=False),
        sa.Column("type", sa.Enum("BID", "CONTRACT", "MESSAGE", "SYSTEM", name="notificationtype"), nullable=False),
        sa.Column("read", sa.Boolean(), nullable=False),
        sa.Column("link", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_user_unread", "notifications", ["user_id", "read"], unique=False)

    op.create_table(
        "user_skills",
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("skill_id", sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(["skill_id"], ["skills.id"], ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("user_id", "skill_id"),
    )

    op.create_table(
        "job_skills",
        sa.Column("job_id", sa.UUID(), nullable=False),
        sa.Column("skill_id", sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ),
        sa.ForeignKeyConstraint(["skill_id"], ["skills.id"], ),
        sa.PrimaryKeyConstraint("job_id", "skill_id"),
    )


def downgrade() -> None:
    op.drop_table("job_skills")
    op.drop_table("user_skills")
    op.drop_index("idx_user_unread", table_name="notifications")
    op.drop_table("notifications")
    op.drop_index("idx_conversation", table_name="messages")
    op.drop_table("messages")
    op.drop_table("reviews")
    op.drop_table("contracts")
    op.drop_table("bids")
    op.drop_index(op.f("ix_jobs_title"), table_name="jobs")
    op.drop_table("jobs")
    op.drop_table("freelancer_profiles")
    op.drop_index(op.f("ix_skills_name"), table_name="skills")
    op.drop_table("skills")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")