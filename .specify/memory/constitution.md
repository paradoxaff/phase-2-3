<!-- Sync Impact Report:
     Version change: N/A (initial version) → 1.0.0
     Modified principles: N/A (new constitution)
     Added sections: All sections (new constitution)
     Removed sections: N/A
     Templates requiring updates: ⚠ pending - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
     Follow-up TODOs: None
-->
# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Strict Spec-Driven Development (Specify → Plan → Tasks → Implement)
All development follows the strict sequence: Specification → Planning → Task Generation → Implementation. No code implementation occurs without prior specification and planning. This ensures architectural coherence and prevents ad-hoc development.

### II. No Manual Coding by User
The user does not manually write code. All implementation is generated through automated processes guided by specifications and tasks. This enforces consistency and reduces human error.

### III. Phase Separation: Fresh Full-Stack Web App
Phase II is a completely separate full-stack web application from Phase I (CLI). The backend and frontend are developed as separate services with clean separation of concerns. Phase I and Phase II remain independent.

### IV. Mandatory Authentication & User Isolation
Every API endpoint requires authentication. All data access must be user-isolated. Users can only access their own data. Authentication is mandatory for all operations. This ensures security and privacy.

### V. Technology Stack Compliance
Strict adherence to mandated technologies: Frontend: Next.js 16+ (App Router); Backend: FastAPI (Python); ORM: SQLModel; Database: Neon Serverless PostgreSQL; Authentication: Better Auth (JWT-based); API: REST only. Deviations require explicit constitutional amendment.

### VI. Security-First Architecture
All API endpoints require JWT authentication. JWT verification must occur in FastAPI. User ID must be extracted from token for access control. Users can only access their own tasks. Shared JWT secret via environment variable. This ensures robust security posture.

## Additional Constraints

### Technology Constraints
- Frontend: Next.js 16+ with App Router pattern
- Backend: FastAPI framework in Python
- ORM: SQLModel for database interactions
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth for JWT-based authentication
- API: RESTful only (no GraphQL or other protocols)
- No AI features allowed in Phase II
- No UI overengineering - focus on functional requirements
- No features beyond specified requirements
- Same JWT secret shared via environment variable

### Security Requirements
- All endpoints must validate JWT tokens
- User isolation: users can only access their own data
- JWT verification in FastAPI middleware
- User ID extraction from JWT for access control
- Environment-based JWT secret sharing
- Proper error handling without information leakage

## Development Workflow

### Implementation Process
1. Specifications must be complete before planning begins
2. Plans must be approved before task generation
3. Tasks must be generated before implementation
4. Implementation follows tasks exactly
5. All changes must pass through the Spec-Plan-Tasks-Implement pipeline
6. No skipping steps in the process

### Quality Gates
- All API endpoints require authentication validation
- Database queries must include user isolation
- Frontend must properly handle authentication state
- Error handling must not expose sensitive information
- Tests must cover authentication and authorization
- Security validation required before deployment

## Governance

All development activities must comply with this constitution. Amendments require formal approval process documenting rationale and migration plan. All pull requests and code reviews must verify constitutional compliance. Complexity must be justified with clear business value. This constitution supersedes all other development practices and guidelines.

**Version**: 1.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13