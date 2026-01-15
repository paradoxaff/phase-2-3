from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.auth_router import router as auth_router
from .api.task_router import router as task_router

app = FastAPI(title="Todo API", version="1.0.0")

# CORS middleware - adjust origins as needed for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(task_router, prefix="/api", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}