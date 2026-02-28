# Govi Guru - Pest Identification & Management System 🌿

Govi Guru is an integrated ecosystem designed to bridge the gap between farmers, agriculture experts, and administrative oversight. The platform features an AI-powered pest detection system combined with farmer-to-officer consultation bridging, educational knowledge bases, and advanced administrative capabilities based on modern React (Vite) frontends and a Python FastAPI backend.

---

## 🏗️ System Architecture

### High-Level Architecture
The system consists of three distinct frontends for separate user personas communicating with a centralized FastAPI backend, backed by MySQL and Object Storage.

```mermaid
flowchart LR
    classDef actor fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#000
    classDef usecase fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#000,rx:20,ry:20
    classDef system fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#000,stroke-dasharray: 5 5

    UserAdmin["👤 Admin User"] 
    UserFarmer["👤 Farmer"] 
    UserAgri["👤 Agri Officer"]

    subgraph System ["🌿 Govi Guru System"]
        direction TB
        
        subgraph AdminUC ["Admin Functions"]
            UC_AdminDashboard(["View Analytics & Dashboard (Port 5173)"]) 
            UC_ManageUsers(["Manage Users & Roles"])
            UC_ManagePests(["Manage Pests & Datasets"]) 
        end
        
        subgraph FarmerUC ["Farmer Functions"]
            UC_ScanPest(["Scan & Identify Pest (Port 5174)"]) 
            UC_ViewKB(["View Knowledge Base & Treatments"]) 
            UC_ReqConsult(["Request Consultation"]) 
        end
        
        subgraph OfficerUC ["Officer Functions"]
            UC_OfficerDashboard(["View Officer Dashboard (Port 5175)"]) 
            UC_ManageFarmers(["Manage Assigned Farmers"]) 
            UC_AnswerConsult(["Respond to Consultations"]) 
        end
    end

    UserAdmin --> UC_AdminDashboard
    UserAdmin --> UC_ManageUsers
    UserAdmin --> UC_ManagePests

    UserFarmer --> UC_ScanPest
    UserFarmer --> UC_ViewKB
    UserFarmer --> UC_ReqConsult

    UserAgri --> UC_OfficerDashboard
    UserAgri --> UC_ManageFarmers
    UserAgri --> UC_AnswerConsult
    UserAgri --> UC_ViewKB
```

### Data Model Structure (ER Diagram)
The unified backend interacts with a centralized relational schema to maintain consistency across the entire Govi Guru network.

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string phone UK
        string hashed_password
        string role
        string region
        string status
    }

    PESTS {
        int id PK
        string name_en
        string crop_stage
        text chemical_methods
        text kem_methods
        string status
    }

    SCANS {
        int id PK
        int farmer_id FK
        int pest_id FK
        float confidence
        string status
    }

    CONSULTATIONS {
        int id PK
        int farmer_id FK
        int officer_id FK
        string status
    }

    USERS ||--o{ SCANS : "Initiates"
    PESTS ||--o{ SCANS : "Yields"
    USERS ||--o{ CONSULTATIONS : "Participates In"
```

---

## 🛠️ Technology Stack

- **Frontend Ecosystem:** React 18, Vite, Tailwind CSS, Radix UI Primitives, Lucide Icons
- **Backend Infrastructure:** Python 3.10+, FastAPI, SQLAlchemy (ORM), Pydantic
- **Database Layer:** MySQL 8.0
- **Object Storage:** MinIO (Local S3 Protocol)
- **Containerization:** Docker & Docker Compose

---

## 🚀 Getting Started

You can run the entire platform quickly using Docker Compose, which builds the microservices locally and provisions the necessary databases.

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) plugin available.
- Open ports `5173`, `5174`, `5175`, `8000`, `9000`, `9001`, and `3306` on localhost.

### Running with Docker (Recommended Method)

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <repository_url>
   cd govi-guru
   ```

2. Using Docker Compose, initiate the build and spin up the containers:
   ```bash
   docker compose up --build -d
   ```

3. **Verify the Services**:
   - Backend API is running on [http://localhost:8000](http://localhost:8000). The interactive API docs can be viewed natively at [http://localhost:8000/docs](http://localhost:8000/docs).
   - MySQL is exposed on `localhost:3306`
   - MinIO Storage Console is active on [http://localhost:9001](http://localhost:9001)

### Accessing the Frontends
Once the Docker containers are successfully standing, you can access the three standalone portals via:

| App | Sub-directory | Local URL | Target Description |
| :--- | :--- | :--- | :--- |
| **Admin Portal** | `./admin` | [http://localhost:5173](http://localhost:5173) | System-wide analytics, user & role management |
| **Farmer App** | `./farmer` | [http://localhost:5174](http://localhost:5174) | Pest scanning, knowledge base, consultations |
| **Agri Officer** | `./agriculture` | [http://localhost:5175](http://localhost:5175) | Handling assigned farmers and consultation requests |

*Note: In development, the frontends utilize Vite hot-reloading native mapping, meaning they can be modified locally and updates will propagate instantly within their respective containers.*

---

## 🗄️ Running Services Natively (Without Docker)

If you prefer to run specific components standalone natively, you'll need the foundational backing services (MySQL & Minio) already running.

### 1. Setting up the Backend
```bash
cd backend

# Setup Python Virtual Environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Create .env file based on example
cp .env.example .env

# Run the Uvicorn ASGI Web Server
fastapi dev app/main.py --port 8000
```

### 2. Setting up the Frontends
To run any of the frontends (`admin` / `agriculture` / `farmer`), follow the same Vite launch sequences inside each folder:

```bash
cd <frontend-folder>

# Install Next/React Dependencies
npm install

# Run the Vite Dev Server
npm run dev
```
