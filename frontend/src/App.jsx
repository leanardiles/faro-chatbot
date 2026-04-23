import { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    setIsLoading(true);
    setInput('');
    setConversation((prev) => [...prev, { question, answer: null }]);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
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
      {conversation.length === 0 && (
        <header className="welcome">
          <img src="/lighthouse_v1.svg" alt="" className="lighthouse" />
          <div className="welcome-text">
            <h1>Faro</h1>
            <p>Ready to enlighten</p>
            <div className="welcome-spacer" aria-hidden="true" />
          </div>
        </header>
      )}

      <section className="conversation">
          {conversation.map((exchange, index) => (
            <div key={index} className="exchange">
              <div className="user-message">{exchange.question}</div>
              {exchange.answer === null ? (
                <div className="thinking-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              ) : (
                <div className="bot-message">{exchange.answer}</div>
              )}
            </div>
          ))}
        </section>

      <div className="input-outer">
        {conversation.length > 0 && (
          <img src="/lighthouse_v1.svg" alt="" className="lighthouse-avatar" />
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
        {conversation.length > 0 && (
          <button
            className="clear-button"
            onClick={() => setConversation([])}
            disabled={isLoading}
          >
            Clear chat
          </button>
        )}
      </div>
    </main>
  );
}

export default App;