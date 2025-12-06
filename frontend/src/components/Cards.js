import React, { useState, useEffect } from "react";
import { getCards, createCard } from "../api/api";

export default function Cards({ listId }) {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState("");

  useEffect(() => {
    fetchCards();
  }, [listId]);

  const fetchCards = async () => {
    const res = await getCards(listId);
    setCards(res.data);
  };

  const handleCreateCard = async () => {
    if (!newCard) return;
    await createCard(listId, newCard, "", cards.length);
    setNewCard("");
    fetchCards();
  };

  return (
    <div style={{ paddingLeft: "20px" }}>
      <input
        type="text"
        placeholder="New Card Title"
        value={newCard}
        onChange={(e) => setNewCard(e.target.value)}
      />
      <button onClick={handleCreateCard}>Create Card</button>

      <ul>
        {cards.map((card) => (
          <li key={card.id}>{card.title}</li>
        ))}
      </ul>
    </div>
  );
}
