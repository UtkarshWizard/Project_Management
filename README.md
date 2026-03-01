# Subscription & Feature Entitlement System  
Multi-Tenant SaaS Architecture (React + Node + Prisma + PostgreSQL)

---

## Overview

This project implements a multi-tenant SaaS subscription and feature entitlement system with:

- Database-driven plans and features
- Usage-based limits (Projects & Members)
- Centralized entitlement middleware
- Subscription lifecycle management (Active / Expired)
- Atomic usage enforcement with race-condition protection
- React frontend integrated with backend APIs

The system demonstrates scalable, production-style subscription enforcement without hardcoded plan logic.

---

## System Architecture Summary

### Core Layers

Frontend (React)  
↓  
Express API  
↓  
Middleware Layer  
- Authentication (JWT)  
- Subscription Enforcement  
- Feature Gating  
- Usage Enforcement  
↓  
Service Layer (Business Logic)  
↓  
Prisma ORM  
↓  
PostgreSQL (Neon)  

### Key Architectural Decisions

- Multi-tenancy enforced via `organizationId`
- All entitlement logic centralized in middleware
- Plans and features dynamically controlled from database
- Usage limits enforced atomically using database transactions
- Expired subscriptions enter read-only mode

---

## Multi-Tenant Strategy

- Each tenant is represented by an **Organization**
- All tenant-bound tables include `organizationId`
- Every query is scoped using `organizationId`
- JWT contains organization context

Example:

```ts
prisma.project.findMany({
  where: { organizationId: req.organizationId }
}); 
```
This ensures strict row-level tenant isolation.
---

## Subscription Model

Each organization has:

- **Plan** (Free / Pro / Enterprise)
- **Status** (ACTIVE / EXPIRED)
- **Start Date**
- **End Date**

### Lifecycle Behavior

- Signup → Free plan assigned automatically  
- Upgrade → Plan updated with 1-month validity  
- Expiry → Write operations blocked  
- Expired → Read-only access allowed  

---

## Feature & Usage Enforcement

### Feature Gating

Features are mapped via:

- **Plan**
- **Feature**
- **PlanFeature** (junction table)

Access is checked dynamically via middleware:

```ts
requireFeature("FEATURE_CODE")
```
---

No plan names are hardcoded in the backend.

## Usage Limits

### Enforced Metrics

- `PROJECT_COUNT`
- `MEMBER_COUNT`

### Atomic Usage Updates

Usage updates are handled atomically using database transactions:

```ts
prisma.$transaction(async (tx) => {
  check usage
  create resource
  increment usage
});
```

This ensures:

- Atomic operations
- No partial updates
- Race-condition protection under concurrent requests

This prevents limit bypass even under high concurrency.

**Plan Feature Matrix**

| Feature              | Free      | Pro          | Enterprise |
|----------------------|-----------|--------------|------------|
| Create Project       | Limited   | Higher Limit | Unlimited  |
| Add Members          | Limited   | Higher Limit | Unlimited  |
| Archive Project      | ❌        | ✅           | ✅         |
| Analytics            | ❌        | ✅           | ✅         |
| Advanced Analytics   | ❌        | ❌           | ✅         |
| Export               | ❌        | ✅           | ✅         |

All feature access is dynamically controlled from the database.


## Database Design

**Core Entities**

- Organization
- User
- Subscription
- Plan
- Feature
- PlanFeature (Junction Table)
- UsageTracking
- Project

**Indexing Considerations**

A composite index is used on:

`(organizationId, metric)`

This enables fast lookup for usage enforcement and ensures efficient quota checks.

Additional indexing strategy:

- `organizationId` indexed across tenant-bound tables
- Unique index on feature code
- Foreign key indexing on `planId` and `organizationId`


## Design Considerations

### Scalability

- Stateless backend (horizontal scaling supported)
- Indexed tenant filtering via `organizationId`
- Middleware-based entitlement enforcement
- Database-driven plan configuration
- No in-memory entitlement logic

The system can scale by:

- Adding read replicas
- Sharding by `organizationId`
- Introducing caching for feature-plan mappings


### Extensibility

**To Add a New Feature**

1. Insert a new record into the `Feature` table
2. Map the feature to plans via `PlanFeature`
3. Apply `requireFeature("NEW_FEATURE")` in the route

No schema redesign required.

**To Add a New Usage Metric**

1. Extend the usage metric enum
2. Insert corresponding `UsageTracking` rows
3. Apply `requireUsageLimit("NEW_METRIC")` middleware

The system is fully extensible without structural changes.


## How To Run

### Clone Repository

```bash
git clone <your-repo-url>
cd <project-folder>

**Backend**

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```
#### Backend will run at - http://localhost:3000

**Frontend**

```bash
cd frontend
npm install
npm run dev
```
#### Frontend will run at - http://localhost:5173


## 🌍 Deployment

**Backend:** (Add Render / Railway URL here)
**Frontend:** (Add Vercel URL here)

Deployment URL:
[Add your deployed URL here]


## 📌 TODO / Future Improvements

- Add subscription history tracking
- Implement downgrade enforcement logic
- Add role-based access control (RBAC)
- Add caching layer for plan-feature lookup
- Add rate limiting
- Add automated expiry cron job
- Add integration tests
