# Kefit Freelance Marketplace

**Kefit** is an Ethiopian freelance marketplace API built with **FastAPI**. It provides a robust backend for connecting freelancers and clients, handling job postings, applications, and payments.

---

## 📋 Features
- **User Management**: Registration, authentication (JWT), profile handling.
- **Job Posting**: Create, browse, filter, and apply to freelance jobs.
- **Messaging**: Real-time chat between freelancers and clients.
- **Payments**: Integration with popular Ethiopian payment gateways.
- **Admin Dashboard**: Manage users, jobs, and transactions.

---

## 🛠️ Tech Stack
- **Backend**: FastAPI, Python 3.12+
- **Database**: PostgreSQL
- **ORM**: SQLModel / SQLAlchemy
- **Authentication**: JWT
- **Environment Management**: `python-dotenv`
- **Testing**: Pytest
- **Documentation**: OpenAPI (auto-generated) & Swagger UI

---

## 🚀 Getting Started
### Prerequisites
- PostgreSQL running locally or remotely
- Python 3.12+ installed
- `git` installed

### Installation
```bash
# Clone the repository
git clone https://github.com/FayselN/Kefit-Job-Portal.git
cd Kefit-Job-Portal

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Database Setup
```bash
# Start PostgreSQL service (if not already running)
sudo systemctl start postgresql

# Create the database
sudo -u postgres createdb kefit_db
```

> **Note**: Ensure the `.env` file contains the correct `DATABASE_URL` (e.g., `postgresql://postgres:password@localhost/kefit_db`). You can copy the template:
```bash
cp .env.example .env
```

### Running the Server
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000` and the interactive docs at `http://localhost:8000/docs`.

---

## 📚 API Overview
- **GET /jobs** – List all job postings
- **POST /jobs** – Create a new job (authenticated)
- **GET /jobs/{id}** – Retrieve a specific job
- **POST /auth/register** – Register a new user
- **POST /auth/login** – Obtain JWT token
- *...and many more endpoints* – see the Swagger UI for full details.

---

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes with clear messages.
4. Open a Pull Request targeting `master`.

Make sure to run tests:
```bash
pytest
```

---

## 📄 License
This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

*Happy coding!*
