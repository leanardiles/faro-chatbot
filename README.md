# Faro

A lighthouse-inspired chatbot built with React, FastAPI, and Azure OpenAI.

Faro takes its name from the Spanish and Italian word for *lighthouse* — 
descended from the Greek *Pháros*, the ancient lighthouse of Alexandria 
and one of the Seven Wonders of the Ancient World. Like its namesake, 
Faro is designed to be a steady guide: you ask a question, and it helps 
you find your way.

## Status

🚧 **Work in progress.** This project is being built as part of an 
internship evaluation. See the [Roadmap](#roadmap) below for progress.

## Tech Stack

- **Frontend:** React (via Vite)
- **Backend:** Python + FastAPI
- **LLM:** Azure OpenAI (GPT-3.5 Turbo)
- **Config:** python-dotenv for environment variables

## Project Structure
''
faro-chatbot/
├── backend/          # FastAPI + Azure OpenAI integration
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example  # Template for required env variables
│   └── venv/         # (not committed)
└── frontend/         # React + Vite app (coming soon)
''

## Setup

### Backend

1. Navigate to the backend folder:
```bash
   cd backend
```

2. Create and activate a virtual environment:
```bash
   python -m venv venv
   source venv/Scripts/activate   # Windows (Git Bash)
   # or: source venv/bin/activate  # macOS / Linux
```

3. Install dependencies:
```bash
   pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example` and fill in your 
   Azure OpenAI credentials.

5. Run the server:
```bash
   uvicorn main:app --reload
```

   The API will be available at `http://127.0.0.1:8000`, with 
   interactive docs at `http://127.0.0.1:8000/docs`.

### Frontend

*Coming soon.*

## Roadmap

- [x] Backend scaffolding (FastAPI + venv + .gitignore)
- [x] Environment variable management (python-dotenv)
- [x] Azure OpenAI client initialization
- [x] `/query` endpoint with Azure OpenAI integration
- [x] Empty-input validation
- [ ] React frontend scaffolding
- [ ] Input/response UI
- [ ] Backend-frontend integration (CORS, API calls)
- [ ] "Thinking…" loading state *(bonus)*
- [ ] Clear conversation button *(bonus)*
- [ ] Demo screenshots / video
- [ ] Deployment *(optional)*

## License

*TBD*