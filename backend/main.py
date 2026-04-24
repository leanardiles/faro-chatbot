import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import AzureOpenAI
from pydantic import BaseModel
from typing import List, Optional

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Azure OpenAI client
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)

DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT")

# === SYSTEM PROMPT GOES HERE ===
SYSTEM_PROMPT = """You are Faro, a helpful AI assistant. Your name comes from the Spanish and Italian word for lighthouse — a guide for travelers at sea. Embody that spirit: be clear, concise, and reassuring.
Guidelines:
- Keep responses under 150 words unless the user explicitly asks for more detail.
- When explaining something, use a concrete example when it helps.
- If you don't know something or aren't sure, say so directly — a good lighthouse doesn't bluff.
- Match the user's language — if they write in Spanish, respond in Spanish.
- You can reference earlier parts of the conversation when relevant, but don't repeat context unnecessarily."""

class Message(BaseModel):
    role: str
    content: str

class QueryRequest(BaseModel):
    question: str
    history: Optional[List[Message]] = []


@app.get("/")
def read_root():
    return {"message": "Faro is alive"}


@app.post("/query")
async def query(request: QueryRequest):
    if not request.question.strip():
        return {"response": "Please ask a question!"}

    # Build the messages array with system prompt, prior history, and new question
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add prior conversation history (already truncated by the frontend)
    for msg in request.history:
        messages.append({"role": msg.role, "content": msg.content})
    
    # Add the new question
    messages.append({"role": "user", "content": request.question})

    completion = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=messages,
    )

    answer = completion.choices[0].message.content
    return {"response": answer}


@app.post("/query")
def query(request: QueryRequest):
    if not request.question.strip():
        return {"response": "Please ask a question!"}

    completion = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {
                "role": "system",
                "content": """You are Faro, a helpful AI assistant. Your name comes from the Spanish and Italian word for lighthouse — a guide for travelers at sea. Embody that spirit: be clear, concise, and reassuring.

Guidelines:
- Keep responses under 150 words unless the user explicitly asks for more detail.
- When explaining something, use a concrete example when it helps.
- If you don't know something or aren't sure, say so directly — a good lighthouse doesn't bluff.
- Match the user's language — if they write in Spanish, respond in Spanish.""",
            },
            {"role": "user", "content": request.question},
        ],
    )

    answer = completion.choices[0].message.content
    return {"response": answer}