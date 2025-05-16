import React, { useState } from "react";
import FoodRecommendations from "./components/FoodRecommendations";
import { searchLandmarks } from "./services/openai";

// --- Mock data ---
const landmarks = [
  {
    id: 1,
    name: "Sagrada Família",
    description: "Antoni Gaudí's iconic, still-unfinished basilica, a must-see for any Barcelona visitor.",
    location: "C/ de Mallorca, 401",
    image: "https://images.unsplash.com/photo-1583779457094-ab6c595c9d0e?w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Parc Güell",
    description: "Famous park with colorful mosaics and whimsical architecture by Gaudí.",
    location: "Carrer d'Olot, 5",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "La Rambla",
    description: "Barcelona's bustling main street, full of life, cafes, and local color.",
    location: "La Rambla",
    image: "https://images.unsplash.com/photo-1583425595426-5b3f8640deb9?w=800&auto=format&fit=crop"
  }
];

const events = [
  {
    id: 1,
    title: "Open Air Jazz at Parc de la Ciutadella",
    time: "Today, 18:00",
    location: "Parc de la Ciutadella",
    description: "Live jazz in the park. Free entry. Bring your own blanket!"
  },
  {
    id: 2,
    title: "Tapas Food Market",
    time: "Tomorrow, 12:00 - 17:00",
    location: "Mercat de Sant Antoni",
    description: "Sample the best local tapas from vendors all over the city."
  }
];

// --- Components ---
function ChatBox({ onMessage }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { sender: "ai", text: "¡Hola! Ask me anything about Barcelona or get a custom walking tour." }
  ]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setHistory(prev => [...prev, userMsg]);
    onMessage(input, setHistory, history);
    setInput("");
  }

  return (
    <div className="chatbox">
      <div className="history">
        {history.map((msg, i) => (
          <div key={i} className={msg.sender}>{msg.text}</div>
        ))}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

function TourList({ suggested }) {
  const selected = suggested.length > 0 ? landmarks.filter(l => suggested.includes(l.id)) : landmarks;
  return (
    <div className="tour-list">
      <h2>Suggested Landmarks</h2>
      <ul>
        {selected.map(l => (
          <li key={l.id}>
            <img src={l.image} alt={l.name} width={80} />
            <div>
              <strong>{l.name}</strong>
              <div>{l.description}</div>
              <small>{l.location}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EventList() {
  return (
    <div className="event-list">
      <h2>Events Nearby</h2>
      <ul>
        {events.map(e => (
          <li key={e.id}>
            <strong>{e.title}</strong> – {e.time}<br />
            <em>{e.location}</em>
            <div>{e.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Navigation({ activePage, onNavigate }) {
  return (
    <nav className="main-nav">
      <button 
        className={activePage === 'tour' ? 'active' : ''} 
        onClick={() => onNavigate('tour')}
      >
        Tour Guide
      </button>
      <button 
        className={activePage === 'food' ? 'active' : ''} 
        onClick={() => onNavigate('food')}
      >
        Food Guide
      </button>
    </nav>
  );
}

function TourGuide({ onMessage, tourIds, isLoading }) {
  return (
    <div className="tour-guide">
      <h1>Barcelona AI Tour Guide</h1>
      <ChatBox onMessage={onMessage} />
      {isLoading ? (
        <div className="loading">Loading suggested landmarks...</div>
      ) : (
        <TourList suggested={tourIds} />
      )}
      <EventList />
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [tourIds, setTourIds] = useState([]);
  const [activePage, setActivePage] = useState('tour');
  const [isLoading, setIsLoading] = useState(false);

  // Updated to use OpenAI API
  async function handleMessage(input, setHistory, history) {
    try {
      setIsLoading(true);
      const text = input.toLowerCase();
      
      // Switch to food guide if requested
      if (text.includes("food") || text.includes("eat") || text.includes("restaurant")) {
        setActivePage('food');
        setHistory([...history, { 
          sender: "ai", 
          text: "I've switched you to our Food Guide! You can ask about restaurants, local dishes, and more." 
        }]);
        return;
      }

      // Get AI response
      const aiResponse = await searchLandmarks(input);
      
      // Set suggested landmarks based on response content
      if (text.includes("gaudi") || text.includes("sagrada") || text.includes("güell")) {
        setTourIds([1, 2]);
      } else if (text.includes("rambla")) {
        setTourIds([3]);
      } else if (text.includes("all") || text.includes("everything") || text.includes("tour")) {
        setTourIds([1, 2, 3]);
      }

      setHistory([...history, { sender: "ai", text: aiResponse }]);
    } catch (error) {
      setHistory([...history, { 
        sender: "ai", 
        text: "I apologize, but I encountered an error. Please make sure your OpenAI API key is correctly set up." 
      }]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-container">
      <Navigation activePage={activePage} onNavigate={setActivePage} />
      {activePage === 'tour' ? (
        <TourGuide onMessage={handleMessage} tourIds={tourIds} isLoading={isLoading} />
      ) : (
        <FoodRecommendations />
      )}
      <style>{`
        .app-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 30px;
          color: #333;
        }

        .main-nav {
          display: flex;
          gap: 16px;
          margin-bottom: 40px;
          padding: 16px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #f0f0f0;
        }

        .main-nav button {
          padding: 14px 28px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          background: #f1f3f5;
          color: #495057;
          transition: all 0.2s ease;
        }

        .main-nav button.active {
          background: #2075d6;
          color: white;
          box-shadow: 0 4px 12px rgba(32,117,214,0.2);
        }

        .main-nav button:hover {
          transform: translateY(-2px);
        }

        .tour-guide {
          background: #fff;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #f0f0f0;
        }

        .chatbox { 
          border: 1px solid #eef2f7;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          background: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .history { 
          height: 200px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .history .ai { 
          background: #f0f7ff;
          color: #2075d6;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 12px;
          max-width: 80%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .history .user { 
          background: #2075d6;
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 12px;
          margin-left: auto;
          max-width: 80%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .input-row { 
          display: flex;
          gap: 12px;
        }

        input { 
          flex: 1;
          padding: 14px;
          border: 2px solid #eef2f7;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s;
        }

        input:focus {
          border-color: #2075d6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(32,117,214,0.1);
        }

        button { 
          padding: 14px 28px;
          border-radius: 12px;
          background: #2075d6;
          color: white;
          border: none;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover {
          background: #1b6ac2;
          transform: translateY(-1px);
        }

        .tour-list, .event-list { 
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #f0f0f0;
        }

        .tour-list ul, .event-list ul { 
          list-style: none;
          padding: 0;
          display: grid;
          gap: 20px;
        }

        .tour-list li { 
          display: flex;
          gap: 24px;
          align-items: flex-start;
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .tour-list li:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .tour-list img { 
          border-radius: 12px;
          width: 200px;
          height: 140px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .tour-list div {
          flex: 1;
        }

        .event-list li { 
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .event-list li:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        h1 {
          font-size: 2.5rem;
          color: #1a202c;
          margin-bottom: 32px;
          font-weight: 700;
        }

        h2 {
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 24px;
          font-weight: 600;
        }

        strong {
          color: #2d3748;
          font-size: 1.2rem;
          display: block;
          margin-bottom: 8px;
        }

        small {
          color: #718096;
          display: block;
          margin-top: 8px;
          font-size: 0.9rem;
        }

        em {
          color: #2075d6;
          font-style: normal;
          font-weight: 500;
        }

        body {
          background: #f8fafc;
          line-height: 1.6;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #c5d1e1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a9b9cc;
        }

        .loading {
          text-align: center;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 32px;
        }
      `}</style>
    </div>
  );
}
