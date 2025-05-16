import React, { useState } from 'react';

const restaurants = [
  {
    id: 1,
    name: "La Boqueria Market",
    type: "Food Market",
    description: "Historic market with fresh produce, tapas bars, and local delicacies.",
    specialties: ["Fresh seafood", "Iberian ham", "Local fruits"],
    location: "La Rambla, 91",
    priceRange: "€-€€",
    image: "https://images.unsplash.com/photo-1589213682455-c9f3bbc9c0db?w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Cal Pep",
    type: "Tapas Bar",
    description: "Intimate tapas bar known for seafood and counter seating.",
    specialties: ["Tuna tartare", "Daily specials", "Fresh seafood"],
    location: "Plaça de les Olles, 8",
    priceRange: "€€€",
    image: "https://images.unsplash.com/photo-1593870682262-8c9d5f720cee?w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "7 Portes",
    type: "Traditional Catalan",
    description: "Historic restaurant serving traditional paella since 1836.",
    specialties: ["Paella", "Seafood rice", "Catalan classics"],
    location: "Passeig d'Isabel II, 14",
    priceRange: "€€€",
    image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&auto=format&fit=crop"
  }
];

const dishes = [
  {
    id: 1,
    name: "Paella",
    description: "Traditional Spanish rice dish with seafood or meat.",
    bestAt: ["7 Portes", "Can Solé"],
    image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Patatas Bravas",
    description: "Fried potatoes with spicy tomato sauce and aioli.",
    bestAt: ["Bar Tomás", "El Vaso de Oro"],
    image: "https://images.unsplash.com/photo-1593182440959-ae2447b0c67f?w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Crema Catalana",
    description: "Catalan custard dessert with caramelized sugar top.",
    bestAt: ["Granja La Pallaresa", "Petritxol Café"],
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop"
  }
];

function FoodChat({ onMessage }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { sender: "ai", text: "¡Hola! I can help you discover Barcelona's amazing food. Ask me about restaurants, local dishes, or specific cuisines!" }
  ]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setHistory(prev => [...prev, userMsg]);
    onMessage(input, setHistory, history);
    setInput("");
  }

  return (
    <div className="food-chat">
      <div className="chat-history">
        {history.map((msg, i) => (
          <div key={i} className={msg.sender}>{msg.text}</div>
        ))}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about food recommendations..."
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

function RestaurantList({ suggested }) {
  const selected = suggested.length > 0 ? restaurants.filter(r => suggested.includes(r.id)) : restaurants;
  return (
    <div className="restaurant-list">
      <h2>Recommended Restaurants</h2>
      <div className="restaurant-grid">
        {selected.map(r => (
          <div key={r.id} className="restaurant-card">
            <img src={r.image} alt={r.name} />
            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <span className="type">{r.type}</span>
              <span className="price">{r.priceRange}</span>
              <p>{r.description}</p>
              <div className="specialties">
                <strong>Specialties:</strong>
                <ul>
                  {r.specialties.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <small>{r.location}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocalDishes() {
  return (
    <div className="local-dishes">
      <h2>Must-Try Local Dishes</h2>
      <div className="dishes-grid">
        {dishes.map(d => (
          <div key={d.id} className="dish-card">
            <img src={d.image} alt={d.name} />
            <div className="dish-info">
              <h3>{d.name}</h3>
              <p>{d.description}</p>
              <div className="best-at">
                <strong>Best places to try:</strong>
                <ul>
                  {d.bestAt.map((place, i) => (
                    <li key={i}>{place}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FoodRecommendations() {
  const [suggestedRestaurants, setSuggestedRestaurants] = useState([]);

  function handleFoodMessage(input, setHistory, history) {
    const text = input.toLowerCase();
    let reply = "";
    
    if (text.includes("paella") || text.includes("rice")) {
      setSuggestedRestaurants([3]);
      reply = "For the best paella in Barcelona, you must try 7 Portes! It's a historic restaurant that's been serving traditional paella since 1836.";
    } else if (text.includes("tapas") || text.includes("seafood")) {
      setSuggestedRestaurants([1, 2]);
      reply = "For amazing tapas and seafood, check out La Boqueria Market and Cal Pep. La Boqueria is great for casual bites, while Cal Pep offers a more upscale experience.";
    } else if (text.includes("traditional") || text.includes("catalan")) {
      setSuggestedRestaurants([2, 3]);
      reply = "For traditional Catalan cuisine, I recommend Cal Pep for tapas and 7 Portes for classic dishes like paella.";
    } else if (text.includes("market") || text.includes("fresh")) {
      setSuggestedRestaurants([1]);
      reply = "La Boqueria Market is a must-visit! It's one of Europe's best food markets with amazing fresh produce and tapas bars.";
    } else {
      setSuggestedRestaurants([]);
      reply = "You can ask me about paella, tapas, seafood, traditional Catalan cuisine, or food markets. What interests you?";
    }
    
    setHistory([...history, { sender: "ai", text: reply }]);
  }

  return (
    <div className="food-recommendations">
      <h1>Barcelona Food Guide</h1>
      <FoodChat onMessage={handleFoodMessage} />
      <RestaurantList suggested={suggestedRestaurants} />
      <LocalDishes />
      <style>{`
        .food-recommendations {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
          background: #fff;
          min-height: 100vh;
        }

        .food-chat {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 40px;
          border: 1px solid #f0f0f0;
        }

        .chat-history {
          height: 240px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding: 15px;
          background: #fafafa;
          border-radius: 12px;
        }

        .chat-history .ai {
          background: #f0f7ff;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 12px;
          max-width: 80%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .chat-history .user {
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

        .input-row input {
          flex: 1;
          padding: 14px;
          border: 2px solid #eef2f7;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s;
        }

        .input-row input:focus {
          border-color: #2075d6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(32,117,214,0.1);
        }

        .input-row button {
          padding: 14px 28px;
          background: #2075d6;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .input-row button:hover {
          background: #1b6ac2;
          transform: translateY(-1px);
        }

        .restaurant-grid, .dishes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }

        .restaurant-card, .dish-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s;
          border: 1px solid #f0f0f0;
        }

        .restaurant-card:hover, .dish-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .restaurant-card img, .dish-card img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          transition: all 0.3s;
        }

        .restaurant-card:hover img, .dish-card:hover img {
          transform: scale(1.05);
        }

        .restaurant-info, .dish-info {
          padding: 24px;
        }

        .restaurant-info h3, .dish-info h3 {
          margin: 0 0 12px 0;
          color: #1a202c;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .type, .price {
          display: inline-block;
          padding: 6px 12px;
          background: #f7fafc;
          border-radius: 8px;
          margin-right: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #4a5568;
        }

        .price {
          color: #2075d6;
          background: #ebf4ff;
        }

        .specialties, .best-at {
          margin-top: 20px;
        }

        .specialties ul, .best-at ul {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .specialties li, .best-at li {
          background: #f7fafc;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 14px;
          color: #4a5568;
          border: 1px solid #edf2f7;
        }

        h1 {
          font-size: 2.5rem;
          color: #1a202c;
          margin-bottom: 30px;
          font-weight: 700;
        }

        h2 {
          font-size: 2rem;
          color: #2d3748;
          margin: 40px 0 20px 0;
          font-weight: 600;
        }

        p {
          color: #4a5568;
          line-height: 1.6;
          margin: 12px 0;
        }

        small {
          color: #718096;
          display: block;
          margin-top: 12px;
          font-size: 14px;
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
      `}</style>
    </div>
  );
} 