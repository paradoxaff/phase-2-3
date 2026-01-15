---
id: 1
title: Todo Fullstack Constitution
stage: constitution
date: 2026-01-13
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: wahee
command: sp.constitution
labels: [constitution,fullstack,todo]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
---

## Prompt

Create speckit.constitution for Phase II: Todo Full-Stack Web Application.

Principles:
- Strict Spec-Driven Development (Specify → Plan → Tasks → Implement)
- No manual coding by the user
- Phase I (CLI) is complete and separate
- Phase II is a fresh full-stack web app
- Backend and frontend are separate services
- Authentication is mandatory
- All data access must be user-isolated

Technology Constraints:
- Frontend: Next.js 16+ (App Router)
- Backend: FastAPI (Python)
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT-based)
- API: REST only

Security Rules:
- All API endpoints require JWT
- JWT must be verified in FastAPI
- User ID must be extracted from token
- Users can only access their own tasks

Non-Negotiables:
- No AI features in Phase II
- No UI overengineering
- No feature beyond requirements
- Same JWT secret shared via env variable

Goal:
Deliver a working, secure, multi-user Todo web application.

## Response snapshot

Created a new constitution file for the Todo Full-Stack Web Application with six core principles covering Spec-Driven Development, no manual coding, phase separation, authentication & user isolation, technology stack compliance, and security-first architecture. Added sections for technology constraints, security requirements, development workflow, and governance.

## Outcome

- ✅ Impact: Created new constitution file with all specified principles
- 🧪 Tests: N/A
- 📁 Files: Updated .specify/memory/constitution.md
- 🔁 Next prompts: Continue with specification, planning, and task generation
- 🧠 Reflection: Constitution properly captures all requirements from user input

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin specification phase