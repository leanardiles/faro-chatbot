import os
from dotenv import load_dotenv
from fastapi import FastAPI
from openai import AzureOpenAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

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