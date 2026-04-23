import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import AzureOpenAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)

DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT")


class QueryRequest(BaseModel):
    question: str


@app.get("/")
def read_root():
    return {"message": "Faro is alive"}


@app.post("/query")
def query(request: QueryRequest):
    if not request.question.strip():
        return {"response": "Please ask a question!"}

    completion = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {"role": "user", "content": request.question}
        ],
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