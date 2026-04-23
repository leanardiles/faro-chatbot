# Faro

A lighthouse-inspired chatbot built with React, FastAPI, and Azure OpenAI.

Faro takes its name from the Spanish and Italian word for *lighthouse* — descended from the Greek *Pháros*, the ancient lighthouse of Alexandria and one of the Seven Wonders of the Ancient World. Like its namesake, Faro is designed to be a steady guide: you ask a question, and it helps you find your way.

## Status

🚧 **Work in progress.** This project is being built as part of an internship evaluation. See the [Roadmap](#roadmap) below for progress.

## Tech Stack

- **Frontend:** React (via Vite), vanilla CSS with CSS variables
- **Backend:** Python + FastAPI
- **LLM:** Azure OpenAI (GPT-3.5 Turbo)
- **Config:** python-dotenv for environment variables

## Project Structure
'''
faro-chatbot/
├── backend/              # FastAPI + Azure OpenAI integration
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example      # Template for required env variables
│   └── venv/             # (not committed)
├── frontend/             # React + Vite app
│   ├── src/
│   │   ├── App.jsx       # Main chat UI component
│   │   ├── App.css
│   │   ├── index.css     # Sherpa palette and Inter font
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
└── README.md
'''

## Setup

### Backend

1. Navigate to the backend folder:
```bash
   cd backend
```

2. Create and activate a virtual environment:
```bash
   python -m venv venv
   source venv/Scripts/activate    # Windows (Git Bash)
   # or: source venv/bin/activate   # macOS / Linux
```

3. Install dependencies:
```bash
   pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example` and fill in your Azure OpenAI credentials:
'''
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=your-deployment-name
AZURE_OPENAI_API_VERSION=2024-10-21
'''

5. Run the server:
```bash
   uvicorn main:app --reload
```

   The API will be available at `http://127.0.0.1:8000`, with interactive docs at `http://127.0.0.1:8000/docs`.

### Frontend

1. Navigate to the frontend folder:
```bash
   cd frontend
```

2. Install dependencies:
```bash
   npm install
```

3. Run the development server:
```bash
   npm run dev
```

   The app will be available at `http://localhost:5173`.

### Running the app

With both servers running (backend on port 8000, frontend on port 5173), open `http://localhost:5173` in your browser. Type a question and press Enter or click Send.

## How it works

1. The user types a question in the React frontend and submits it (via Enter or the Send button).
2. The frontend sends a `POST` request to the FastAPI backend's `/query` endpoint with the question as JSON.
3. The backend validates the input (rejecting empty or whitespace-only messages) and forwards it to Azure OpenAI, along with a system prompt that defines Faro's lighthouse-guide persona.
4. Azure OpenAI returns a response, which the backend passes back to the frontend.
5. The frontend appends the exchange to the conversation history and displays it in the UI.

The backend uses CORS middleware to allow the frontend's development origin (`http://localhost:5173`) to make cross-origin requests.

## User interface

Faro's UI has two states that respond to whether a conversation is underway:

- **Empty state:** a centered welcome with an illustrated lighthouse, the name "Faro," and the tagline *"Ready to enlighten."* The input textarea sits directly below.
- **Conversation state:** the welcome is replaced by the scrolling message history. A small lighthouse avatar accompanies the input at the bottom of the screen, indicating Faro's continued presence.

Supporting details:
- The input supports `Enter` to send and `Shift+Enter` for multi-line questions.
- The model name ("GPT-3.5 Turbo") is displayed subtly in the bottom-right corner of the input area.
- User messages appear in soft-blue rounded bubbles, right-aligned; Faro's responses appear as plain text below, left-aligned.
- The conversation scrolls internally while the input remains fixed at the bottom, so the page viewport never scrolls.

## Design

Faro's visual identity borrows from [Sherpa Digital's](https://www.sherpadigital.nl/) own brand palette:

- **Background:** `#FFFFFF`
- **Primary action (Send):** `#38FC9E` (Sherpa green)
- **Secondary action / links / heading:** `#0031FF` (Sherpa blue)
- **Text:** `#111928`
- **Typeface:** Inter (loaded from Google Fonts)

The lighthouse illustration is a custom SVG in a warm, storybook-inspired palette that complements — rather than duplicates — the Sherpa brand colors.

## Roadmap

### Assignment scope

- [x] Backend scaffolding (FastAPI + venv + `.gitignore`)
- [x] Environment variable management (python-dotenv)
- [x] Azure OpenAI client initialization
- [x] `/query` endpoint with Azure OpenAI integration
- [x] Empty-input validation
- [x] System prompt defining Faro's persona and response guidelines
- [x] CORS middleware for frontend development origin
- [x] React frontend scaffolding
- [x] Input/response UI
- [x] Backend-frontend integration
- [x] Visual styling (palette, typography, message bubbles, state-based layout)
- [x] Lighthouse illustration in welcome and conversation states
- [x] Model badge and viewport-bound conversation scrolling
- [x] "Thinking…" loading state *(bonus)*
- [x] Clear conversation button *(bonus)*
- [ ] Demo screenshots / video
- [ ] Final submission polish (README finalization + zip)

### Future enhancements (beyond the current scope)

- [ ] **Conversation memory**: pass prior messages as context so Faro can reference earlier parts of the conversation (currently single-turn).
- [ ] **Dark mode**: a UI toggle for light/dark themes, persisted across sessions.

## Notes

Faro currently operates in **single-turn mode**: each question is sent independently to the backend with no conversation memory. The frontend displays the full exchange history for the user's reference, but the model does not see previous messages when generating responses. See the [Roadmap](#roadmap) for planned enhancements including conversation memory and dark mode.

## License

*TBD*