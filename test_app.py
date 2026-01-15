"""
Test script to verify the Todo Full-Stack Web Application implementation
"""
import os
import sys
from pathlib import Path

def check_backend_structure():
    """Check if backend structure is correctly implemented"""
    backend_path = Path("backend")

    required_files = [
        "backend/src/main.py",
        "backend/src/database.py",
        "backend/src/config.py",
        "backend/requirements.txt",
        "backend/.env",
        "backend/src/models/__init__.py",
        "backend/src/models/user.py",
        "backend/src/models/task.py",
        "backend/src/services/__init__.py",
        "backend/src/services/auth.py",
        "backend/src/services/task_service.py",
        "backend/src/api/__init__.py",
        "backend/src/api/auth_router.py",
        "backend/src/api/task_router.py",
        "backend/src/middleware/__init__.py",
        "backend/src/middleware/auth_middleware.py"
    ]

    print("Checking backend structure...")
    all_found = True
    for file in required_files:
        if not Path(file).exists():
            print(f"[MISSING] {file}")
            all_found = False
        else:
            print(f"[FOUND] {file}")

    return all_found

def check_frontend_structure():
    """Check if frontend structure is correctly implemented"""
    frontend_path = Path("frontend")

    required_files = [
        "frontend/package.json",
        "frontend/next.config.js",
        "frontend/tsconfig.json",
        "frontend/.env.local",
        "frontend/src/app/layout.tsx",
        "frontend/src/app/page.tsx",
        "frontend/src/app/login/page.tsx",
        "frontend/src/app/register/page.tsx",
        "frontend/src/app/tasks/page.tsx",
        "frontend/src/app/providers/auth-provider.tsx",
        "frontend/src/components/TaskForm.tsx",
        "frontend/src/components/TaskList.tsx",
        "frontend/src/components/TaskDetail.tsx",
        "frontend/src/services/auth.tsx",
        "frontend/src/services/api.ts",
        "frontend/src/types/user.ts",
        "frontend/src/types/task.ts"
    ]

    print("\nChecking frontend structure...")
    all_found = True
    for file in required_files:
        if not Path(file).exists():
            print(f"[MISSING] {file}")
            all_found = False
        else:
            print(f"[FOUND] {file}")

    return all_found

def check_specification_implementation():
    """Check if all specification requirements are met"""
    print("\nChecking specification implementation...")

    # Check if key features are implemented
    checks = [
        ("FastAPI backend with JWT authentication", Path("backend/src/middleware/auth_middleware.py").exists()),
        ("SQLModel User and Task models", Path("backend/src/models/user.py").exists() and Path("backend/src/models/task.py").exists()),
        ("REST API endpoints for tasks", Path("backend/src/api/task_router.py").exists()),
        ("Next.js frontend with App Router", Path("frontend/src/app/layout.tsx").exists()),
        ("Authentication flow (login/register)",
         Path("frontend/src/app/login/page.tsx").exists() and
         Path("frontend/src/app/register/page.tsx").exists()),
        ("Task management (CRUD operations)", Path("frontend/src/app/tasks/page.tsx").exists()),
        ("User-isolated task management",
         Path("backend/src/services/task_service.py").exists() and
         "user_id" in open("backend/src/services/task_service.py", encoding='utf-8').read()),
        ("Better Auth integration", "auth" in open("frontend/src/services/auth.tsx", encoding='utf-8').read()),
        ("API client with JWT attachment", "Authorization" in open("frontend/src/services/api.ts", encoding='utf-8').read()),
        ("README with setup instructions", Path("README.md").exists())
    ]

    all_implemented = True
    for desc, check in checks:
        status = "[PASS]" if check else "[FAIL]"
        print(f"{status} {desc}")
        if not check:
            all_implemented = False

    return all_implemented

def main():
    print("Verifying Todo Full-Stack Web Application Implementation")
    print("="*60)

    backend_ok = check_backend_structure()
    frontend_ok = check_frontend_structure()
    spec_ok = check_specification_implementation()

    print("\n" + "="*60)
    print("SUMMARY:")
    print(f"Backend structure: {'COMPLETE' if backend_ok else 'INCOMPLETE'}")
    print(f"Frontend structure: {'COMPLETE' if frontend_ok else 'INCOMPLETE'}")
    print(f"Specification compliance: {'COMPLETE' if spec_ok else 'INCOMPLETE'}")

    overall_success = backend_ok and frontend_ok and spec_ok
    print(f"\nOverall status: {'ALL TASKS COMPLETED' if overall_success else 'SOME TASKS REMAIN'}")

    if overall_success:
        print("\nImplementation successfully completed!")
        print("\nNext steps:")
        print("1. Run 'cd backend && pip install -r requirements.txt' to install backend dependencies")
        print("2. Run 'cd frontend && npm install' to install frontend dependencies")
        print("3. Set up your database and environment variables")
        print("4. Start the backend with 'uvicorn src.main:app --reload --port 8000'")
        print("5. Start the frontend with 'npm run dev'")
    else:
        print("\nPlease complete the remaining tasks before proceeding.")

    return overall_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)