# 🛠️ Uslugar - Tech Stack

## 📊 Pregled tehnologija

---

## 🗄️ **Baza podataka**

### **PostgreSQL** (AWS RDS)
- **Verzija**: PostgreSQL 14+
- **Hosting**: AWS RDS (eu-north-1)
- **Instance**: uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com
- **Port**: 5432
- **Database**: uslugar
- **User**: uslugar_user

**Zašto PostgreSQL?**
- ✅ Relacijska baza (najbolja za složene relacije)
- ✅ JSONB podrška (portfolio, nested data)
- ✅ Full-text search
- ✅ Geospatial capabilities
- ✅ ACID compliance
- ✅ Excellent Prisma support

---

## 🔧 **Backend**

### **Runtime**
- **Node.js** v20.x (LTS)
- **Environment**: Production (Docker container na AWS ECS)

### **Framework & Libraries**

#### Core
- **Express.js** ^4.19.2 - Web framework
- **Prisma ORM** 5.22.0 - Database ORM
- **@prisma/client** 5.22.0 - Generated client

#### Authentication & Security
- **jsonwebtoken** ^9.0.2 - JWT tokens
- **bcryptjs** ^2.4.3 - Password hashing
- **cors** ^2.8.5 - CORS middleware

#### File Handling
- **multer** 1.4.5-lts.2 - File upload middleware
- **uuid** ^9.0.1 - Unique file names

#### Real-time & Communication
- **socket.io** ^4.8.1 - WebSocket server (chat, real-time)
- **nodemailer** ^6.10.1 - Email notifications

#### Database Driver
- **pg** ^8.12.0 - PostgreSQL driver

#### Utilities
- **dotenv** ^16.4.5 - Environment variables
- **morgan** ^1.10.0 - HTTP request logger

---

## 🎨 **Frontend**

### **Framework**
- **React** 18.3.1
- **React DOM** 18.3.1
- **Vite** 5.4.2 - Build tool & dev server

### **UI & Styling**
- **Tailwind CSS** 3.4.10 - Utility-first CSS
- **PostCSS** 8.4.47 - CSS processing
- **Autoprefixer** 10.4.20 - CSS vendor prefixes

### **Routing & Navigation**
- **React Router DOM** 7.9.4 - Client-side routing

### **Data Fetching**
- **Axios** 1.7.2 - HTTP client
- **React Query** 3.39.3 - Server state management

### **Forms**
- **React Hook Form** 7.48.2 - Form management

### **Real-time**
- **socket.io-client** 4.7.4 - WebSocket client

### **Maps & Geolocation**
- **Leaflet** 1.9.4 - Map library
- **React Leaflet** 4.2.1 - React wrapper for Leaflet

---

## 🐳 **DevOps & Infrastructure**

### **Containerization**
- **Docker** - Multi-stage builds
- **Docker Compose** - Local development

### **Cloud Provider: AWS**

#### Compute
- **AWS ECS (Fargate)** - Container orchestration
  - Cluster: `apps-cluster`
  - Service: `uslugar-service-2gk1f1mv`
  - Task Definition: `uslugar:79`
  - CPU: 512 units (0.5 vCPU)
  - Memory: 1024 MB (1 GB)

#### Container Registry
- **AWS ECR** - Docker image registry
  - Repository: `uslugar`
  - Region: eu-north-1

#### Database
- **AWS RDS PostgreSQL** - Managed database
  - Instance class: db.t3.micro (ili veći)
  - Storage: SSD
  - Automated backups

#### Networking
- **Application Load Balancer (ALB)** - Load balancing & HTTPS
- **VPC** - Private networking
- **Security Groups** - Firewall rules
- **Target Groups** - Health checks

#### Secrets Management
- **AWS Secrets Manager** - Database credentials
  - Secret: `uslugar-db-secret`

#### Logging
- **CloudWatch Logs** - Centralized logging
  - Log Group: `/ecs/uslugar`

#### Reverse Proxy
- **NGINX** (stable-alpine) - Proxy & health checks
  - Port 80 → 8080
  - Health endpoint: `/hc`

---

## 📦 **ORM & Database Tools**

### **Prisma**
- **Version**: 5.22.0
- **Binary Target**: `debian-openssl-3.0.x`
- **Generator**: Prisma Client

**Features:**
- Type-safe database queries
- Auto-generated migrations
- Schema validation
- Introspection support

**Prisma Schema Location:**
```
uslugar/backend/prisma/schema.prisma
```

**Migrations:**
- `20251004183616_init` - Initial schema
- `20251019125637_add_missing_features` - Full feature set

---

## 🔐 **Security**

### Authentication
- **JWT (JSON Web Tokens)** - Stateless auth
  - Expiration: 7 days
  - Algorithm: HS256
  - Secret: Environment variable

### Password Security
- **bcrypt** - Password hashing
  - Salt rounds: 10
  - One-way hashing

### Environment Security
- ✅ Secrets in AWS Secrets Manager
- ✅ Environment variables via .env
- ✅ No credentials in code
- ✅ HTTPS enforced

---

## 🌐 **Deployment Architecture**

```
┌─────────────────────────────────────────────┐
│          Internet (HTTPS)                   │
└──────────────┬──────────────────────────────┘
               │
       ┌───────▼────────┐
       │  Application   │
       │  Load Balancer │ (HTTPS → HTTP)
       └───────┬────────┘
               │
       ┌───────▼────────┐
       │   ECS Fargate  │
       │   Task (79)    │
       │  ┌──────────┐  │
       │  │  nginx   │  │ :80
       │  │  proxy   │  │
       │  └─────┬────┘  │
       │        │       │
       │  ┌─────▼────┐  │
       │  │  Node.js │  │ :8080
       │  │  API     │  │
       │  └─────┬────┘  │
       └────────┼────────┘
                │
         ┌──────▼──────┐
         │     RDS     │
         │ PostgreSQL  │
         └─────────────┘
```

---

## 📁 **Project Structure**

```
uslugar/
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── auth.js          # JWT & bcrypt
│   │   │   ├── prisma.js        # Prisma client
│   │   │   ├── email.js         # Nodemailer
│   │   │   ├── socket.js        # Socket.io
│   │   │   ├── upload.js        # Multer config
│   │   │   └── notifications.js # Notification logic
│   │   ├── routes/
│   │   │   ├── auth.js          # Login/Register
│   │   │   ├── admin.js         # Admin CRUD
│   │   │   ├── jobs.js          # Job endpoints
│   │   │   ├── offers.js        # Offer endpoints
│   │   │   ├── providers.js     # Provider endpoints
│   │   │   ├── reviews.js       # Review endpoints
│   │   │   ├── categories.js    # Category endpoints
│   │   │   ├── notifications.js # Notification endpoints
│   │   │   ├── chat.js          # Chat endpoints
│   │   │   ├── subscriptions.js # Subscription endpoints
│   │   │   └── upload.js        # Upload endpoints
│   │   └── server.js            # Main server
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── seed.js              # Seed data
│   │   └── migrations/          # DB migrations
│   ├── Dockerfile.prod          # Production Docker
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── admin/               # Admin panel
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Layout.jsx       # Admin layout
│   │   │   ├── ModelPage.jsx    # CRUD interface
│   │   │   └── router.jsx       # Admin routing
│   │   ├── components/
│   │   │   ├── JobCard.jsx      # Job display
│   │   │   ├── JobForm.jsx      # Job creation
│   │   │   └── ProviderCard.jsx # Provider display
│   │   ├── api.js               # Axios config
│   │   ├── App.jsx              # Main app
│   │   └── main.jsx             # Entry point
│   ├── tailwind.config.js       # Tailwind config
│   ├── vite.config.js           # Vite config
│   └── package.json
│
└── docker-compose.yml           # Local development
```

---

## 🔢 **Database Schema**

### **10 Modela:**

1. **User** - Korisnici (users, providers, admins)
2. **ProviderProfile** - Provider profili i specijalizacije
3. **Category** - Hijerarhijske kategorije
4. **Job** - Poslovi sa geolokacijom
5. **Offer** - Ponude za poslove
6. **Review** - Recenzije i ocjene
7. **Notification** - Push/email notifikacije
8. **ChatRoom** - Chat sobe
9. **ChatMessage** - Chat poruke
10. **Subscription** - Pretplate i krediti

### **Enumi:**
- `Role` - USER, PROVIDER, ADMIN
- `JobStatus` - OPEN, IN_PROGRESS, COMPLETED, CANCELLED
- `OfferStatus` - PENDING, ACCEPTED, REJECTED
- `NotificationType` - 7 tipova (NEW_JOB, NEW_OFFER...)
- `Urgency` - LOW, NORMAL, HIGH, URGENT
- `JobSize` - SMALL, MEDIUM, LARGE, EXTRA_LARGE

### **Key Features:**
- ✅ Many-to-many relations (ChatRoom ↔ User)
- ✅ Self-referencing relations (Category hierarchy)
- ✅ JSONB fields (portfolio)
- ✅ Array fields (images, specialties)
- ✅ Geolocation (latitude/longitude)
- ✅ Timestamps (createdAt, updatedAt)

---

## 🚀 **Development Tools**

### Backend
- **ES Modules** (type: "module")
- **Morgan** - HTTP logging
- **Dotenv** - Environment management
- **Prisma Studio** - Database GUI (optional)

### Frontend
- **Vite** - Lightning-fast build tool
- **Hot Module Replacement (HMR)** - Instant updates
- **PostCSS** - CSS processing
- **ESLint** (recommended)

---

## 🌍 **API Architecture**

### **RESTful API**
- Base URL: `https://uslugar.api.oriph.io/api`
- Auth: JWT Bearer tokens
- Content-Type: `application/json`

### **WebSocket (Socket.io)**
- Real-time chat
- Live notifications
- Bidirectional communication

---

## 📦 **Package Versions Summary**

### Backend Key Dependencies
```json
{
  "node": "20.x",
  "express": "4.19.2",
  "prisma": "5.22.0",
  "@prisma/client": "5.22.0",
  "postgresql": "14+",
  "jsonwebtoken": "9.0.2",
  "bcryptjs": "2.4.3",
  "socket.io": "4.8.1",
  "multer": "1.4.5-lts.2",
  "nodemailer": "6.10.1"
}
```

### Frontend Key Dependencies
```json
{
  "react": "18.3.1",
  "vite": "5.4.2",
  "tailwindcss": "3.4.10",
  "axios": "1.7.2",
  "react-router-dom": "7.9.4",
  "socket.io-client": "4.7.4",
  "leaflet": "1.9.4"
}
```

---

## 🏗️ **Infrastructure**

### **AWS Services Used:**
1. **ECS (Fargate)** - Serverless containers
2. **ECR** - Container registry
3. **RDS (PostgreSQL)** - Managed database
4. **ALB** - Application Load Balancer
5. **VPC** - Virtual Private Cloud
6. **Security Groups** - Network security
7. **Secrets Manager** - Credential storage
8. **CloudWatch** - Logging & monitoring

### **Region**
- **eu-north-1** (Stockholm)

---

## 🔄 **CI/CD**

### **Build Process:**
1. Git push → GitHub
2. Local Docker build
3. Tag with commit hash
4. Push to AWS ECR
5. Register new task definition
6. Update ECS service
7. Rolling deployment

### **Deployment Tools:**
- Git (version control)
- Docker (containerization)
- AWS CLI (deployment automation)
- PowerShell scripts (Windows automation)

---

## 📊 **Database Spec**

### **Connection String:**
```
postgres://uslugar_user:PASSWORD@uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com:5432/uslugar?schema=public
```

### **Features:**
- ✅ SSL/TLS connection
- ✅ Connection pooling (Prisma)
- ✅ Automated backups (AWS RDS)
- ✅ Multi-AZ availability (optional)
- ✅ Auto-scaling storage

### **Migrations:**
- **Tool**: Prisma Migrate
- **Strategy**: Incremental migrations
- **Deployment**: Auto-run on container startup

---

## 🎯 **Key Features by Technology**

### **Express.js**
- RESTful API endpoints
- Middleware chain (CORS, auth, logging)
- Error handling
- Static file serving (uploads)

### **Prisma**
- Type-safe queries
- Auto-generated client
- Migration management
- Relationship handling
- Query optimization

### **Socket.io**
- Real-time chat
- Room-based messaging
- Event broadcasting
- Connection management

### **JWT**
- Stateless authentication
- 7-day expiration
- Role-based access (USER, PROVIDER, ADMIN)
- Secure token signing

### **React**
- Component-based UI
- React Hooks (useState, useEffect)
- Context API (optional)
- Virtual DOM

### **Tailwind CSS**
- Utility-first classes
- Responsive design
- Custom color palette
- Production optimization (PurgeCSS)

### **Vite**
- Lightning-fast HMR
- ES modules native
- Optimized production builds
- Code splitting

---

## 🔧 **Development Workflow**

### **Local Development:**
```bash
# Backend
cd uslugar/backend
npm install
npx prisma generate
npm run dev  # Port 4000

# Frontend
cd uslugar/frontend
npm install
npm run dev  # Port 5173
```

### **Production Build:**
```bash
# Backend
docker build -f Dockerfile.prod -t uslugar-backend .

# Frontend
npm run build  # Creates dist/
```

---

## 📈 **Performance Optimizations**

### **Backend**
- ✅ Connection pooling (Prisma)
- ✅ Indexed database queries
- ✅ Gzip compression
- ✅ Static file caching
- ✅ Query optimization with Prisma

### **Frontend**
- ✅ Code splitting (Vite)
- ✅ Lazy loading
- ✅ Production minification
- ✅ Tree shaking
- ✅ CSS purging (Tailwind)

### **Infrastructure**
- ✅ Auto-scaling (ECS)
- ✅ Load balancing (ALB)
- ✅ Health checks
- ✅ Circuit breaker (deployment)
- ✅ Rolling updates (zero downtime)

---

## 🔒 **Security Stack**

### **Application Level**
- JWT authentication
- bcrypt password hashing (10 rounds)
- CORS configuration
- SQL injection prevention (Prisma)
- XSS protection (React escaping)

### **Infrastructure Level**
- VPC isolation
- Security groups (firewall)
- HTTPS/TLS (ALB)
- Private subnets (database)
- Secrets Manager (credentials)

---

## 📊 **Monitoring & Logging**

### **Logs:**
- **Morgan** - HTTP request logs (development)
- **CloudWatch Logs** - Production logs
- **ECS Task logs** - Container stdout/stderr

### **Metrics:**
- ECS task CPU/Memory
- ALB request count
- Database connections
- Health check status

---

## 🎓 **Technology Choices - Why?**

| Tech | Why Chosen |
|------|------------|
| **PostgreSQL** | Best relational DB, JSONB support, geospatial |
| **Prisma** | Type-safe, migrations, excellent DX |
| **Express** | Minimal, flexible, huge ecosystem |
| **React** | Component-based, huge ecosystem, job market |
| **Tailwind** | Fast development, consistent design, small bundle |
| **Vite** | Fastest build tool, modern, ESM-first |
| **AWS ECS** | Serverless containers, auto-scaling, managed |
| **Socket.io** | Real-time, WebSocket abstraction, reliable |
| **JWT** | Stateless, scalable, standard |

---

## 📚 **Version Control**

- **Git** - Source control
- **GitHub** - Remote repository
  - Repo: `oriphiel-hr/AWS_projekti`
  - Branch strategy: `main` (production)

---

## 🔮 **Future Tech Considerations**

### Potential Additions:
- [ ] **Redis** - Caching layer
- [ ] **Elasticsearch** - Advanced search
- [ ] **S3** - Image storage (currently local)
- [ ] **CloudFront** - CDN for static assets
- [ ] **Lambda** - Serverless functions
- [ ] **SQS/SNS** - Message queuing
- [ ] **Stripe** - Payment processing
- [ ] **Sentry** - Error tracking
- [ ] **DataDog** - Advanced monitoring

---

## 🎯 **Quick Stats**

```
Backend Dependencies:  11 packages
Frontend Dependencies: 11 packages
Database Models:       10 models
API Endpoints:         ~50 endpoints
Docker Images:         2 (backend + nginx)
AWS Services:          8 services
Lines of Code:         ~5000+ LOC
```

---

## 📖 **Documentation**

All documentation located in `uslugar/` folder:
- Architecture & deployment
- API reference
- Admin panel guides
- JSON examples
- WHERE/INCLUDE filtering
- Setup & configuration

---

**Modern, scalable, production-ready tech stack!** 🚀✨

