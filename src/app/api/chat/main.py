from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend (Next.js) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, use specific origins in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the custom route
@app.get("/user/api/v1/helloworld")
def hello_world():
    return {"message": "Hello, world from FastAPI!"}
