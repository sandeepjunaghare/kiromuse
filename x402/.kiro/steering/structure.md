# Project Structure

## Directory Layout
```
x402/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API communication layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Static assets (images, icons)
│   ├── public/              # Public static files
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript configuration
├── backend/                 # Python backend services
│   ├── app/
│   │   ├── api/             # FastAPI route handlers
│   │   ├── agents/          # PydanticAI agent definitions
│   │   ├── models/          # Database models (SQLAlchemy)
│   │   ├── schemas/         # Pydantic schemas for validation
│   │   ├── services/        # Business logic layer
│   │   ├── core/            # Core configuration and utilities
│   │   └── x402/            # x402 protocol implementation
│   ├── tests/               # Backend test suite
│   ├── requirements.txt     # Python dependencies
│   └── alembic/             # Database migrations
├── docs/                    # Project documentation
├── docker/                  # Docker configuration files
├── scripts/                 # Development and deployment scripts
├── .kiro/                   # Kiro CLI configuration
└── docker-compose.yml       # Local development environment
```

## File Naming Conventions
**Python Backend:**
- Snake_case for files and directories: `payment_service.py`
- PascalCase for classes: `PaymentAgent`, `TransactionModel`
- UPPER_CASE for constants: `MAX_TRANSACTION_AMOUNT`

**React Frontend:**
- PascalCase for components: `PaymentForm.tsx`, `AgentDashboard.tsx`
- camelCase for utilities and hooks: `usePayment.ts`, `apiClient.ts`
- kebab-case for assets: `payment-icon.svg`

## Module Organization
**Backend Services:**
- `agents/`: PydanticAI agents for transaction processing
- `api/`: REST API endpoints grouped by domain (payments, agents, creators)
- `services/`: Business logic separated from API handlers
- `models/`: Database models with clear relationships
- `schemas/`: Request/response validation schemas

**Frontend Components:**
- `components/`: Reusable UI components (buttons, forms, modals)
- `pages/`: Route-level components for different app sections
- `services/`: API communication and external service integrations
- `hooks/`: Custom React hooks for state management and side effects

## Configuration Files
**Backend Configuration:**
- `backend/app/core/config.py`: Environment-specific settings
- `backend/alembic.ini`: Database migration configuration
- `backend/.env`: Environment variables (not committed)

**Frontend Configuration:**
- `frontend/.env`: Environment variables for different stages
- `frontend/tsconfig.json`: TypeScript compiler options
- `frontend/vite.config.ts`: Build tool configuration

**Development:**
- `docker-compose.yml`: Local development services
- `.gitignore`: Version control exclusions
- `Makefile`: Common development commands

## Documentation Structure
```
docs/
├── api/                     # API documentation
├── architecture/            # System design documents
├── deployment/              # Deployment guides
├── development/             # Developer setup and guidelines
└── x402-protocol/           # Protocol specification
```

## Asset Organization
**Frontend Assets:**
```
frontend/src/assets/
├── images/                  # Application images and logos
├── icons/                   # SVG icons and graphics
└── styles/                  # Global CSS and theme files
```

**Static Files:**
- `frontend/public/`: Static files served directly
- CDN assets for production deployment

## Build Artifacts
**Frontend Build:**
- `frontend/dist/`: Production build output
- `frontend/node_modules/`: Dependencies (excluded from git)

**Backend Build:**
- `backend/__pycache__/`: Python bytecode (excluded from git)
- `backend/.pytest_cache/`: Test cache (excluded from git)

**Docker:**
- Built images tagged with version numbers
- Multi-stage builds for optimized production images

## Environment-Specific Files
**Environment Variables:**
- `.env.development`: Local development settings
- `.env.staging`: Staging environment configuration
- `.env.production`: Production environment settings

**Configuration Management:**
- Environment-specific database URLs
- API keys and secrets management
- Feature flags for different environments
- Logging levels and monitoring configuration

**Deployment Configurations:**
- `docker-compose.dev.yml`: Development services
- `docker-compose.prod.yml`: Production deployment
- Kubernetes manifests for cloud deployment
