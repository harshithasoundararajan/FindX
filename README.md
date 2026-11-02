# FindX — Cloud-Native Lost & Found Management System

**Kumaraguru College of Technology** · Cloud Application Development semester project

FindX lets students report lost items, report found items, browse and search
the registry, and submit claims. Administrators manage users, categories,
locations, and approve or reject claims.

---

## 1. Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, Vite, React Router, Axios, Tailwind CSS, React Hook Form |
| Backend    | Java 21, Spring Boot 3, Spring Security, JWT, Spring Data JPA, Hibernate, MapStruct, Lombok, springdoc-openapi |
| Database   | PostgreSQL |
| Storage    | Amazon S3 (item images — URLs only are stored in Postgres) |
| Cloud      | AWS EC2, AWS RDS (PostgreSQL), AWS S3, AWS IAM |
| DevOps     | Docker, Docker Compose, Jenkins, Terraform, Nginx |

---

## 2. Folder Structure

```
findx/
├── backend/                     Spring Boot application
│   ├── src/main/java/com/kct/findx/
│   │   ├── config/               Security, Swagger, S3, data-seed config
│   │   ├── controller/           REST controllers
│   │   ├── dto/request|response/ DTOs (entities are never exposed)
│   │   ├── entity/                JPA entities + enums
│   │   ├── exception/             Custom exceptions + global handler
│   │   ├── mapper/                 MapStruct entity <-> DTO mappers
│   │   ├── repository/             Spring Data JPA repositories
│   │   ├── security/                JWT filter, UserDetails, JwtUtil
│   │   └── service / service/impl/  Business logic
│   ├── src/main/resources/application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                    React + Vite application
│   ├── src/
│   │   ├── api/                 Axios instance + per-resource services
│   │   ├── components/          Reusable UI (Header, ItemCard, ReportModal…)
│   │   ├── context/             AuthContext (JWT session)
│   │   ├── hooks/                Custom hooks (useLookups)
│   │   ├── layouts/               MainLayout
│   │   ├── pages/                  Home, Login, Register, ItemDetail, Dashboard, AdminDashboard
│   │   └── routes/                  ProtectedRoute, AdminRoute
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── terraform/                    AWS infrastructure as code
├── Jenkinsfile                   CI/CD pipeline definition
├── docker-compose.yml            Local / single-EC2 orchestration
└── README.md
```

---

## 3. Authentication Rules

Only **@kct.ac.in** email addresses may register.

```java
if (!email.endsWith("@kct.ac.in")) {
    // HTTP 400 — "Only Kumaraguru College of Technology email addresses are allowed."
}
```

JWT bearer tokens are issued on login/register (24h expiry by default) and
must be sent as `Authorization: Bearer <token>`. Roles: `USER`, `ADMIN`.
A default admin is seeded on first boot: `admin@kct.ac.in` / `Admin@123`
(**change this immediately in any real deployment**).

---

## 4. REST API Overview

Full interactive documentation is served by Swagger UI at
`/swagger-ui.html` once the backend is running.

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/auth/register` | Public | Register (kct.ac.in only) |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET  | `/api/items` | Public | Search/filter/paginate items |
| GET  | `/api/items/{id}` | Public | Item detail |
| POST | `/api/items` | USER | Report a lost/found item |
| PUT  | `/api/items/{id}` | Owner/ADMIN | Update item |
| DELETE | `/api/items/{id}` | Owner/ADMIN | Delete item |
| GET  | `/api/items/mine` | USER | My reported items |
| PATCH | `/api/items/{id}/return` | ADMIN | Mark item returned |
| POST | `/api/claims` | USER | Submit a claim |
| GET  | `/api/claims/mine` | USER | My claims |
| GET  | `/api/categories` | Public | List categories |
| GET  | `/api/locations` | Public | List locations |
| POST | `/api/files/upload` | USER | Upload image to S3, returns URL |
| GET  | `/api/admin/users` | ADMIN | List users (paginated) |
| PATCH | `/api/admin/users/{id}/status` | ADMIN | Enable/disable user |
| GET  | `/api/admin/claims` | ADMIN | List/filter claims |
| PATCH | `/api/admin/claims/{id}/decision` | ADMIN | Approve/reject claim |
| POST/DELETE | `/api/admin/categories`, `/api/admin/locations` | ADMIN | Manage lookups |
| GET  | `/api/admin/stats` | ADMIN | Dashboard statistics |

All responses are wrapped in a consistent envelope:

```json
{ "success": true, "message": "...", "data": { ... }, "timestamp": "..." }
```

---

## 5. Running Locally

### Option A — Docker Compose (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost
- Backend:  http://localhost:8080
- Swagger:  http://localhost:8080/swagger-ui.html
- Login as admin: `admin@kct.ac.in` / `Admin@123` (seeded on first start)

Everything except photo upload works without any AWS credentials. Item photos
are stored in S3, so the upload endpoint needs `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`, `AWS_REGION` and `AWS_S3_BUCKET` (export them before
`docker compose up`). Without them, posting an item *without* a photo still works.

### Option B — Run services individually

**Backend**
```bash
cd backend
# requires a local PostgreSQL at localhost:5432/findx (findx_user/findx_pass)
mvn spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:8080/api
npm run dev
```

---

## 6. Deployment Pipeline

```
Developer → GitHub → Jenkins (checkout, build, test, dockerize, push)
          → Docker Hub → AWS EC2 (docker compose up)
          → Nginx (served by the frontend container) → React → Spring Boot → RDS Postgres / S3
```

- **Jenkinsfile** at repo root drives the pipeline; configure the
  `dockerhub-credentials`, `findx-ec2-host`, and `findx-ec2-ssh-key`
  credentials in Jenkins before running it.
- **terraform/** provisions the EC2 instance, RDS database, S3 bucket,
  IAM role, and security groups. See `terraform/README.md`.
- The frontend's own Nginx container performs the reverse-proxy role
  (serves the React build and proxies `/api/*` to the backend container),
  fulfilling the Nginx layer in the architecture without a separate
  container — swap in a standalone Nginx service in `docker-compose.yml`
  if you want SSL termination or a shared entrypoint for multiple apps.

---

## 7. What's implemented vs. what needs your environment

**Fully implemented, real code (no placeholders):**
JWT auth with domain restriction, all entities/DTOs/repositories/services/
controllers described above, item search with dynamic Specification-based
filtering, claim workflow (submit → pending → approve/reject → item marked
claimed), admin user/claim/category/location management, global exception
handling, Swagger docs, the full React app (routing, protected/admin routes,
axios interceptor with 401 handling, the report modal, dashboards),
Dockerfiles for both services, docker-compose, a working Jenkinsfile, and
a complete Terraform stack.

**Needs your credentials/values to actually run in AWS:**
- `terraform.tfvars` (EC2 key pair name, DB password, unique S3 bucket name)
- Jenkins credentials (Docker Hub, EC2 SSH key/host)
- Real AWS IAM credentials on the EC2 instance (or attached instance
  profile, which Terraform creates) for the backend's S3 uploads
- A production JWT secret (`JWT_SECRET` env var) — the default in
  `application.yml` is for local development only

**Admin dashboard** has four tabs: pending claims (approve/reject), items
(mark returned / delete), categories & locations (add/delete), and users
(enable/disable).

**Reasonable scope decisions** (flag if you'd like these expanded):
- No email/password-reset flow (Forgot Password) yet — register/login only
- No automated test suite yet (JUnit/RTL) — the Jenkinsfile test stage
  tolerates an empty report until tests are added
