import os
from dotenv import load_dotenv
from fastapi import FastAPI
from openai import AzureOpenAI

load_dotenv()

app = FastAPI()

client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)


@app.get("/")
def read_root():
    return {"message": "Faro is alive"}