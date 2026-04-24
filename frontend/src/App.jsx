import { useState, useEffect, useRef } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';


function App() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const conversationEndRef = useRef(null);


  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    setIsLoading(true);
    setInput('');
    setConversation((prev) => [...prev, { question, answer: null }]);

    try {
      // NEW
      // Build the history from prior exchanges (last 10 pairs)
      const history = conversation
        .filter(ex => ex.answer !== null)  // only include completed exchanges
        .slice(-10)                         // last 10 pairs
        .flatMap(ex => [
          { role: 'user', content: ex.question },
          { role: 'assistant', content: ex.answer },
        ]);

      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history }),
      });

      const data = await response.json();
      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { question, answer: data.response };
        return updated;
      });
    } catch (error) {
      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          question,
          answer: 'Sorry, something went wrong reaching the server.',
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className={`app ${conversation.length === 0 ? 'app--empty' : ''}`}>
      <button
        className="theme-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="theme-toggle-circle" aria-hidden="true"></span>
        <span className="theme-toggle-label">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
      {conversation.length === 0 && (
        <header className="welcome">
          <div className="lighthouse-stack">
            <img src="/lighthouse_v1.svg" alt="" className="lighthouse-base" />
            <img
              src="/lighthouse_v1_lit.svg"
              alt=""
              className={`lighthouse-lit ${isDarkMode ? 'lighthouse-lit--on' : ''}`}
            />
          </div>
          <div className="welcome-text">
            <h1>Faro</h1>
            <p>Ready to enlighten</p>
          </div>
        </header>
      )}

      <section className="conversation">
        {conversation.map((exchange, index) => {
          const isLast = index === conversation.length - 1;
          const isComplete = exchange.answer !== null;
          
          return (
            <div key={index} className="exchange">
              <div className="user-message">{exchange.question}</div>
              {exchange.answer === null ? (
                <div className="thinking-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              ) : (
                <div className="bot-message">
                  <ReactMarkdown>{exchange.answer}</ReactMarkdown>
                </div>
              )}
              {isLast && isComplete && (
                <button
                  className="clear-link"
                  onClick={() => setConversation([])}
                  disabled={isLoading}
                >
                  Clear chat
                </button>
              )}
            </div>
          );
        })}
        <div ref={conversationEndRef} />
      </section>

      <div className="input-outer">
        {conversation.length > 0 && (
          <div className="lighthouse-avatar-stack">
            <img src="/lighthouse_v1.svg" alt="" className="lighthouse-avatar-base" />
            <img
              src="/lighthouse_v1_lit.svg"
              alt=""
              className={`lighthouse-avatar-lit ${isDarkMode ? 'lighthouse-avatar-lit--on' : ''}`}
            />
          </div>
        )}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Faro a question..."
              rows={3}
              disabled={isLoading}
            />
            <span className="model-badge">GPT-3.5 Turbo</span>
          </div>
          <button
            className="send-button"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;