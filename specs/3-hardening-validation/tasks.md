---
description: "Task list for Hardening and Validation implementation"
---

# Tasks: Hardening and Validation

**Input**: Design documents from `/specs/3-hardening-validation/`
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

- [x] T401 Create feature branch 3-hardening-validation
- [x] T402 Verify existing project structure from Phase I & II
- [x] T403 Review existing implementation for validation points

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T404 Review all existing API routes for JWT enforcement
- [x] T405 Validate user_id ownership checks in task service
- [x] T406 Verify consistent error response format across endpoints
- [x] T407 Confirm JWT attachment to all frontend API calls

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure API Access (Priority: P1) 🎯 MVP

**Goal**: Ensure all API endpoints properly validate JWT tokens and enforce user isolation

**Independent Test**: Unauthorized requests are properly rejected and users cannot access other users' resources

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T408 [P] [US1] Contract test for unauthorized access in backend/tests/contract/test_unauthorized_access.py
- [ ] T409 [P] [US1] Integration test for cross-user access prevention in backend/tests/integration/test_cross_user_access.py

### Implementation for User Story 1

- [x] T410 [P] [US1] Verify JWT enforcement on all API routes in backend/src/api/task_router.py
- [x] T411 [US1] Validate user_id ownership checks in backend/src/services/task_service.py
- [x] T412 [US1] Ensure consistent 401 responses for missing tokens in backend/src/middleware/auth_middleware.py
- [x] T413 [US1] Ensure consistent 403 responses for cross-user access in backend/src/api/task_router.py
- [x] T414 [US1] Confirm no task data leakage between users in backend/src/services/task_service.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Valid API Behavior (Priority: P1)

**Goal**: Ensure all API endpoints return proper HTTP status codes as specified

**Independent Test**: All endpoints return correct HTTP status codes for valid and invalid requests

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T415 [P] [US2] Contract test for proper HTTP status codes in backend/tests/contract/test_status_codes.py
- [ ] T416 [P] [US2] Integration test for CRUD status codes in backend/tests/integration/test_crud_status_codes.py

### Implementation for User Story 2

- [x] T417 [P] [US2] Verify GET endpoints return 200 OK in backend/src/api/task_router.py
- [x] T418 [P] [US2] Verify POST endpoints return 201 Created in backend/src/api/task_router.py
- [x] T419 [US2] Verify error responses return appropriate status codes in backend/src/api/task_router.py
- [x] T420 [US2] Confirm 404 responses for non-existent resources in backend/src/api/task_router.py
- [x] T421 [US2] Validate response format consistency in backend/src/api/task_router.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Configuration Compliance (Priority: P2)

**Goal**: Ensure application properly uses existing configuration without duplicating or hardcoding values

**Independent Test**: Application connects to database using environment configuration without hardcoded values

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T422 [P] [US3] Integration test for database connection in backend/tests/integration/test_db_connection.py
- [ ] T423 [P] [US3] Test configuration validation in backend/tests/unit/test_config_validation.py

### Implementation for User Story 3

- [x] T424 [P] [US3] Verify DATABASE_URL usage from environment in backend/src/config.py
- [x] T425 [US3] Ensure no hardcoded database URLs in backend source files
- [x] T426 [US3] Confirm .env.example configuration in project root
- [x] T427 [US3] Validate JWT secret configuration consistency between frontend and backend

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Validation & Cleanup Tasks

**Purpose**: Execute the specific validation and cleanup tasks provided by the user

### Implementation Tasks

- [x] T221 [P] Audit all backend routes for JWT enforcement in backend/src/api/task_router.py
- [x] T222 [P] Enforce user_id and token user match on all endpoints in backend/src/api/task_router.py
- [x] T223 [P] Standardize HTTP error responses in backend/src/api/task_router.py
- [x] T224 [P] Validate frontend attaches JWT to every request in frontend/src/services/api.ts
- [x] T225 [P] Handle unauthorized responses on frontend in frontend/src/services/api.ts
- [x] T226 [P] Verify .env.example usage for DATABASE_URL in .env.example
- [x] T227 [P] Remove any hardcoded secrets in backend/src/config.py and frontend/src/services/api.ts
- [x] T228 [P] Update README for submission readiness in README.md
- [x] T229 [P] Manual test pass for all scenarios in docs/testing_scenarios.md

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T442 [P] Documentation updates in README.md
- [x] T443 Code cleanup and refactoring
- [x] T444 Performance optimization across all stories
- [ ] T445 [P] Additional unit tests in backend/tests/unit/ and frontend/tests/
- [x] T446 Security hardening
- [x] T447 Run quickstart.md validation
- [x] T448 End-to-end verification

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Validation Tasks (Phase 6)**: Can be executed in parallel with user stories or after
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on User Story 1 for basic security
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories

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
- Validation tasks (T221-T229) can run in parallel with user stories

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for unauthorized access in backend/tests/contract/test_unauthorized_access.py"
Task: "Integration test for cross-user access prevention in backend/tests/integration/test_cross_user_access.py"

# Launch all components for User Story 1 together:
Task: "Verify JWT enforcement on all API routes in backend/src/api/task_router.py"
Task: "Validate user_id ownership checks in backend/src/services/task_service.py"
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
5. Execute validation tasks (T221-T229) → Validate hardening and cleanup
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: Validation tasks (T221-T229)
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
- Validation tasks (T221-T229) are specific implementation tasks from user requirements
- All Phase II - Part 1 & 2 functionality remains unchanged as per requirements
- No schema changes, new endpoints, frontend redesign, or Next.js reconfiguration as specified
- Focus on security hardening and validation of existing functionality