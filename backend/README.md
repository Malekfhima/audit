# Audit Management System - Backend

## Project Structure

This is a complete backend application for managing audits, non-conformities, corrective actions, risks, and legal compliance.

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Architecture**: Modular Clean Architecture

### Project Architecture

```
src/
├── config/              # Configuration files
│   ├── config.ts        # Environment variables and app config
│   └── database.ts      # MongoDB connection setup
│
├── core/                # Core utilities and shared code
│   ├── http/            # HTTP-related utilities
│   │   ├── httpError.ts       # Custom error classes
│   │   ├── errorHandler.ts    # Global error middleware
│   │   └── asyncHandler.ts    # Async wrapper utility
│   ├── auth/            # Authentication utilities
│   │   ├── authMiddleware.ts  # JWT authentication
│   │   ├── roleMiddleware.ts  # Role-based authorization
│   │   ├── tokenUtils.ts      # JWT token generation/verification
│   │   └── passwordUtils.ts   # Password hashing/comparison
│   └── utils/           # General utilities
│       ├── logger.ts          # Winston logger
│       └── pagination.ts      # Pagination helpers
│
├── modules/             # Feature modules (one per domain)
│   ├── auth/            # Authentication module
│   ├── users/           # User management
│   ├── roles/           # Role and permission management
│   ├── norms/           # Audit norms/standards (ISO, etc.)
│   ├── sites/           # Physical sites/facilities
│   ├── processes/       # Business processes
│   ├── audits/          # Audit management
│   ├── auditEntries/    # Audit checklist items
│   ├── nonConformities/ # Non-conformity management
│   ├── correctiveActions/ # Corrective actions
│   ├── risks/           # Risk management
│   ├── legal/           # Legal compliance tracking
│   ├── notifications/   # User notifications
│   ├── reports/         # Report generation
│   ├── dashboard/       # Dashboard statistics
│   └── auditLog/        # System audit trail
│
├── swagger/             # API documentation
│   └── swagger.ts       # Swagger/OpenAPI configuration
│
├── app.ts               # Express app configuration
├── server.ts            # Application entry point
└── routes.ts            # Main routes aggregator
```

### Module Structure

Each module follows this consistent structure:

```
module/
├── module.types.ts      # TypeScript interfaces and types
├── module.model.ts      # Mongoose schema and model
├── module.repository.ts # Database operations (data access layer)
├── module.service.ts    # Business logic layer
├── module.controller.ts # HTTP request handlers
└── module.routes.ts     # Route definitions
```

### Layer Responsibilities

1. **Model Layer**: Mongoose schemas, data validation, database structure
2. **Repository Layer**: Database operations only (CRUD, queries)
3. **Service Layer**: Business logic, validation, orchestration
4. **Controller Layer**: HTTP handling, request/response formatting
5. **Routes Layer**: Route definitions, middleware application

### Key Modules

#### Authentication & Authorization
- **auth**: JWT-based authentication, login, register, refresh tokens
- **users**: User management (CRUD, profile, activation)
- **roles**: Role-based access control with permissions

#### Audit Management
- **norms**: Audit standards (ISO 9001, etc.) with clauses and checklists
- **sites**: Physical locations to be audited
- **processes**: Business processes within sites
- **audits**: Main audit entity with workflow (PLANNED → IN_PROGRESS → COMPLETED)
- **auditEntries**: Individual checklist items/findings per audit

#### Quality Management
- **nonConformities**: Track non-conformities found during audits
- **correctiveActions**: Actions to address non-conformities
- **risks**: Risk assessment and management with risk matrix

#### Compliance
- **legal**: Legal/regulatory requirements and compliance tracking

#### Supporting Modules
- **notifications**: In-app notifications for users
- **reports**: Generate reports (PDF, Excel, CSV)
- **dashboard**: Aggregate statistics for overview
- **auditLog**: System audit trail for compliance

### Environment Variables

See `.env.example` for required environment variables:
- Database connection (MONGO_URI)
- JWT secrets
- Server configuration
- Security settings

### Getting Started

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
npm start
```

### API Documentation

Once the server is running, access Swagger UI at:
```
http://localhost:4000/api-docs
```

### Main API Endpoints

- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/roles/*` - Role management
- `/api/norms/*` - Norms/standards
- `/api/sites/*` - Site management
- `/api/processes/*` - Process management
- `/api/audits/*` - Audit management
- `/api/audit-entries/*` - Audit entries
- `/api/non-conformities/*` - NC management
- `/api/corrective-actions/*` - Action management
- `/api/risks/*` - Risk management
- `/api/legal/*` - Legal compliance
- `/api/notifications/*` - Notifications
- `/api/reports/*` - Report generation
- `/api/dashboard/*` - Dashboard stats

### Security Features

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt
- HTTP security headers with Helmet
- CORS configuration
- Rate limiting
- Request validation
- Audit logging

### Database Design

The system uses MongoDB with Mongoose ODM. Key relationships:

- Users → Audits (many-to-many via auditorIds)
- Audits → Sites (many-to-one)
- Audits → Norms (many-to-one)
- Audits → AuditEntries (one-to-many)
- AuditEntries → NonConformities (one-to-one)
- NonConformities → CorrectiveActions (one-to-many)
- Sites → Processes (one-to-many)
- Risks → various entities (via RiskLinks)

### Development Guidelines

1. **No Implementation Code**: This project contains ONLY comments and structure
2. **Follow the Pattern**: Each module uses the same layered architecture
3. **Type Safety**: Use TypeScript interfaces throughout
4. **Error Handling**: Use custom error classes, handle all errors
5. **Validation**: Validate all inputs at controller/service level
6. **Authorization**: Check permissions at route level
7. **Logging**: Log important actions and errors
8. **Testing**: Write unit tests for services, integration tests for endpoints

### Next Steps for Implementation

1. Implement each layer starting from models
2. Add validation schemas (Joi/class-validator)
3. Implement authentication middleware
4. Add comprehensive error handling
5. Write unit and integration tests
6. Add API documentation with Swagger comments
7. Implement file upload for attachments
8. Add email service for notifications
9. Implement background jobs for scheduled tasks
10. Add caching layer (Redis) for performance

### License

[Your License Here]
