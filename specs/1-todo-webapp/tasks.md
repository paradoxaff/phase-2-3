---
description: "Task list for Todo Full-Stack Web Application implementation"
---

# Tasks: Todo Full-Stack Web Application

**Input**: Design documents from `/specs/1-todo-webapp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T201 Initialize monorepo structure with backend/ and frontend/ directories
- [x] T202 Setup FastAPI backend skeleton in backend/src/
- [x] T203 Setup Next.js App Router frontend skeleton in frontend/src/
- [x] T204 Configure project dependencies for both backend and frontend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T205 Configure Neon PostgreSQL connection in backend
- [x] T206 Define SQLModel User and Task models in backend/src/models/
- [x] T207 Implement JWT verification middleware in backend/src/middleware/
- [x] T208 Setup Better Auth integration in frontend/src/services/
- [x] T209 Configure shared JWT secret between backend and frontend
- [x] T210 Implement API client with JWT attachment in frontend/src/services/api.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable new users to register, sign in, and access their accounts securely

**Independent Test**: Can register a new user, log in, and verify access to a protected page

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T211 [P] [US1] Contract test for auth endpoints in backend/tests/contract/test_auth.py
- [ ] T212 [P] [US1] Integration test for registration flow in backend/tests/integration/test_registration.py
- [ ] T213 [P] [US1] Integration test for login flow in backend/tests/integration/test_login.py

### Implementation for User Story 1

- [x] T214 [P] [US1] Implement User registration endpoint in backend/src/api/auth_router.py
- [x] T215 [P] [US1] Implement User login endpoint in backend/src/api/auth_router.py
- [x] T216 [US1] Implement logout endpoint in backend/src/api/auth_router.py
- [x] T217 [US1] Create authentication service in backend/src/services/auth.py
- [x] T218 [US1] Create login page component in frontend/src/app/login/page.tsx
- [x] T219 [US1] Create registration page component in frontend/src/app/register/page.tsx
- [x] T220 [US1] Implement auth state management in frontend/src/services/auth.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Create and Manage Personal Tasks (Priority: P1)

**Goal**: Allow authenticated users to create, view, update, and delete their personal tasks with title and description

**Independent Test**: Can create a task, view it, update it, and delete it to deliver the core value proposition of the todo application

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T221 [P] [US2] Contract test for task endpoints in backend/tests/contract/test_tasks.py
- [ ] T222 [P] [US2] Integration test for CRUD operations in backend/tests/integration/test_task_crud.py

### Implementation for User Story 2

- [x] T223 [P] [US2] Implement GET /tasks endpoint in backend/src/api/task_router.py
- [x] T224 [P] [US2] Implement POST /tasks endpoint in backend/src/api/task_router.py
- [x] T225 [US2] Implement GET /tasks/{id} endpoint in backend/src/api/task_router.py
- [x] T226 [US2] Implement PUT /tasks/{id} endpoint in backend/src/api/task_router.py
- [x] T227 [US2] Implement DELETE /tasks/{id} endpoint in backend/src/api/task_router.py
- [x] T228 [US2] Implement PATCH /tasks/{id}/complete endpoint in backend/src/api/task_router.py
- [x] T229 [US2] Create Task service in backend/src/services/task_service.py
- [x] T230 [US2] Create Task list page in frontend/src/app/tasks/page.tsx
- [x] T231 [US2] Create Task form component in frontend/src/components/TaskForm.tsx
- [x] T232 [US2] Create Task list component in frontend/src/components/TaskList.tsx
- [x] T233 [US2] Create Task detail component in frontend/src/components/TaskDetail.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Secure Access Control (Priority: P2)

**Goal**: Enforce that users can only access and modify their own tasks, preventing unauthorized access

**Independent Test**: Attempting to access another user's tasks is properly rejected, ensuring data isolation between users

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T234 [P] [US3] Integration test for access control in backend/tests/integration/test_access_control.py
- [ ] T235 [P] [US3] Test unauthorized access attempts in backend/tests/integration/test_unauthorized.py

### Implementation for User Story 3

- [x] T236 [P] [US3] Enhance JWT middleware to extract user ID for access control in backend/src/middleware/auth_middleware.py
- [x] T237 [US3] Update Task service to filter queries by authenticated user ID in backend/src/services/task_service.py
- [x] T238 [US3] Add authorization checks to all task endpoints in backend/src/api/task_router.py
- [x] T239 [US3] Update frontend to handle 401 responses appropriately in frontend/src/services/api.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T240 [P] Documentation updates in docs/
- [ ] T241 Code cleanup and refactoring
- [ ] T242 Performance optimization across all stories
- [ ] T243 [P] Additional unit tests in backend/tests/unit/ and frontend/tests/
- [ ] T244 Security hardening
- [ ] T245 Run quickstart.md validation
- [ ] T246 End-to-end testing and verification

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on User Story 1 for authentication
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on User Story 1 (auth) and User Story 2 (tasks)

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for auth endpoints in backend/tests/contract/test_auth.py"
Task: "Integration test for registration flow in backend/tests/integration/test_registration.py"

# Launch all models for User Story 1 together:
Task: "Implement User registration endpoint in backend/src/api/auth_router.py"
Task: "Implement User login endpoint in backend/src/api/auth_router.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence