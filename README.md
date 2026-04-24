# Faro

A lighthouse-inspired chatbot built with React, FastAPI, and Azure OpenAI.

Faro takes its name from the Spanish and Italian word for *lighthouse* — descended from the Greek *Pháros*, the ancient lighthouse of Alexandria and one of the Seven Wonders of the Ancient World. Like its namesake, Faro is designed to be a steady guide: you ask a question, and it helps you find your way.

## Tech Stack

- **Frontend:** React (via Vite), vanilla CSS with CSS variables, react-markdown for response rendering
- **Backend:** Python + FastAPI
- **LLM:** Azure OpenAI (GPT-3.5 Turbo)
- **Config:** python-dotenv for environment variables

## Project Structure

```
faro-chatbot/
├── backend/              # FastAPI + Azure OpenAI integration
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example      # Template for required env variables
│   └── venv/             # (not committed)
├── frontend/             # React + Vite app
│   ├── public/
│   │   ├── lighthouse_v1.svg      # Unlit lighthouse illustration
│   │   └── lighthouse_v1_lit.svg  # Lit lighthouse illustration (dark mode)
│   ├── src/
│   │   ├── App.jsx       # Main chat UI component
│   │   ├── App.css       # Component styles
│   │   ├── index.css     # Global styles and theme variables
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

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

4. Create a `.env` file, copy .env.example content to .env and fill in your own Azure OpenAI credentials:
   ```
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_API_KEY=your-api-key
   AZURE_OPENAI_DEPLOYMENT=your-deployment-name
   AZURE_OPENAI_API_VERSION=2024-10-21
   ```
   Note: .env is gitignored and not included in the submission. You'll need to provide your own Azure OpenAI credentials to run the app.

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
2. The frontend sends a `POST` request to the FastAPI backend's `/query` endpoint, including the new question and the most recent 10 question/answer pairs as conversation history.
3. The backend validates the input (rejecting empty or whitespace-only messages) and forwards the full message list to Azure OpenAI, along with a system prompt that defines Faro's lighthouse-guide persona.
4. Azure OpenAI returns a response, which the backend passes back to the frontend.
5. The frontend appends the exchange to the conversation history and displays it in the UI, with Markdown formatting rendered via react-markdown.

The backend uses CORS middleware to allow the frontend's development origin (`http://localhost:5173`) to make cross-origin requests.

## User interface

Faro's UI has two states that respond to whether a conversation is underway:

- **Empty state:** a centered welcome with an illustrated lighthouse, the name "Faro," and the tagline *"Ready to enlighten."* The input textarea sits directly below.
- **Conversation state:** the welcome is replaced by the scrolling message history. A small lighthouse avatar accompanies the input at the bottom of the screen, indicating Faro's continued presence.

Supporting details:
- The input supports `Enter` to send and `Shift+Enter` for multi-line questions.
- The model name ("GPT-3.5 Turbo") is displayed subtly in the bottom-right corner of the input area.
- User messages appear in soft-blue rounded bubbles, right-aligned; Faro's responses appear as formatted Markdown (with bold, lists, inline code, etc.) below, left-aligned.
- The conversation scrolls internally while the input remains fixed at the bottom. New messages auto-scroll into view so the latest exchange is always visible without manual scrolling.
- A subtle "Clear chat" link appears at the end of the latest bot response, allowing the user to reset the conversation with a single click.

## Features beyond the assignment scope

A few features were added beyond the minimum requirements to demonstrate product thinking and attention to detail:

### Conversation memory

Faro remembers the most recent 10 question/answer pairs within a session, allowing it to understand follow-up questions that reference earlier context (e.g., "Tell me more about that" or "What about the second one?"). Older exchanges are dropped from the context window to keep token usage bounded, though they remain visible in the UI for the user's reference.

### Dark mode

Faro supports light and dark themes, toggled from the top-left corner of the app. The theme is managed via CSS variables that define both palettes, with a `.dark` class applied to the root element switching between them. Theme preference is tracked in React state for the current session.

When dark mode is active, the lighthouse illustration "lights up" — a warm golden glow crossfades in around the lantern with a brief delay, suggesting the lamp has just turned on. The effect uses two overlaid SVGs (unlit and lit) whose opacities animate via CSS transitions.

### Markdown rendering

Bot responses are parsed and rendered as Markdown via `react-markdown`, so formatting like bold text, bullet lists, headers, and inline code is displayed properly rather than as raw syntax. Custom styles match the rest of the UI's typography and theme palette.

## Design

Faro's visual identity borrows from [Sherpa Digital's](https://www.sherpadigital.nl/) own brand palette:

- **Background:** `#FFFFFF` (light) / `#111928` (dark)
- **Primary action (Send):** `#38FC9E` (Sherpa green)
- **Secondary action / links / heading:** `#0031FF` (Sherpa blue, lightened for dark mode)
- **Text:** `#111928` (light mode) / `#F5F5F5` (dark mode)
- **Typeface:** Inter (loaded from Google Fonts)

The lighthouse illustration is a custom SVG in a warm, storybook-inspired palette that complements — rather than duplicates — the Sherpa brand colors.

## Features

### Assignment scope

- Backend scaffolding (FastAPI + venv + `.gitignore`)
- Environment variable management (python-dotenv)
- Azure OpenAI client initialization
- `/query` endpoint with Azure OpenAI integration
- Empty-input validation
- System prompt defining Faro's persona and response guidelines
- CORS middleware for frontend development origin
- React frontend scaffolding
- Input/response UI
- Backend-frontend integration
- Visual styling (palette, typography, message bubbles, state-based layout)
- Lighthouse illustration in welcome and conversation states
- Model badge and viewport-bound conversation scrolling
- "Thinking…" loading state *(bonus)*
- Clear conversation button *(bonus)*

### Beyond scope

- Dark mode toggle with crossfading lit lighthouse
- Conversation memory (last 10 exchanges sent as context)
- Auto-scroll to latest message
- Markdown rendering of bot responses

## Notes

Conversations are **not persisted** — refreshing the page resets state.