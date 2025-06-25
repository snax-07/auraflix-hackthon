from fastapi import FastAPI
from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List
from datetime import datetime

# Define the Message model using Beanie
class Message(Document):
    chat_id: str
    sender: str
    content: str
    timestamp: datetime = datetime.utcnow()

    class Settings:
        name = "messages"  # MongoDB collection name

# FastAPI app
app = FastAPI()

# Connect to MongoDB and initialize Beanie
@app.on_event("startup")
async def app_init():
    client = AsyncIOMotorClient("mongodb+srv://snax:snax@snax1.svjz8.mongodb.net/")
    await init_beanie(database=client.signifyChat, document_models=[Message])

# Endpoint to add a message
@app.post("/add_message")
async def add_message(message: Message):
    await message.insert()
    return {"status": "Message added successfully!"}

# Endpoint to get messages for a specific chat
@app.get("/messages/{chat_id}", response_model=List[Message])
async def get_messages(chat_id: str):
    return await Message.find(Message.chat_id == chat_id).sort("-timestamp").to_list()

