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

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setConversation((prev) => [
        ...prev,
        { question, answer: data.response },
      ]);
    } catch (error) {
      setConversation((prev) => [
        ...prev,
        { question, answer: 'Sorry, something went wrong reaching the server.' },
      ]);
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
          <h1>Faro</h1>
          <p>Ready to enlighten.</p>
        </header>
      )}

      <section className="conversation">
        {conversation.map((exchange, index) => (
          <div key={index} className="exchange">
            <div className="user-message">{exchange.question}</div>
            <div className="bot-message">{exchange.answer}</div>
          </div>
        ))}
      </section>

      <div className="input-area">
        <textarea
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Faro a question..."
          rows={3}
          disabled={isLoading}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </div>
    </main>
  );
}

export default App;