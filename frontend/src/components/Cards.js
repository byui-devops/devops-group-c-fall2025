import React, { useState, useEffect } from "react";
import { getCards, createCard, updateCard } from "../api/api";
import "./Cards.css";

export default function Cards({ listId, onProgressChange }) {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchCards();
  }, [listId]);

  const fetchCards = async () => {
    try {
      const res = await getCards(listId);
      const cardsWithChecklists = res.data.map(card => {
        let checklist = [];
        if (card.description) {
          try {
            checklist = JSON.parse(card.description);
          } catch {
            checklist = [];
          }
        }
        return { ...card, checklist };
      });
      setCards(cardsWithChecklists);
      
      // Calculate and notify parent of progress
      if (onProgressChange) {
        const totalItems = cardsWithChecklists.reduce((sum, card) => 
          sum + (card.checklist?.length || 0), 0);
        const completedItems = cardsWithChecklists.reduce((sum, card) => 
          sum + (card.checklist?.filter(item => item.completed).length || 0), 0);
        onProgressChange({ totalItems, completedItems });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!newCard.trim()) return;
    
    try {
      const initialChecklist = [];
      await createCard(listId, newCard, JSON.stringify(initialChecklist), cards.length);
      setNewCard("");
      setIsCreating(false);
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleChecklistItem = async (cardId, itemIndex) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const updatedChecklist = [...card.checklist];
    updatedChecklist[itemIndex].completed = !updatedChecklist[itemIndex].completed;

    try {
      await updateCard(cardId, { description: JSON.stringify(updatedChecklist) });
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChecklistItem = async (cardId) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const updatedChecklist = [...card.checklist, { text: "", completed: false }];

    try {
      await updateCard(cardId, { description: JSON.stringify(updatedChecklist) });
      await fetchCards();
      setEditingItem({ cardId, itemIndex: updatedChecklist.length - 1 });
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChecklistItem = async (cardId, itemIndex) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const updatedChecklist = card.checklist.filter((_, idx) => idx !== itemIndex);

    try {
      await updateCard(cardId, { description: JSON.stringify(updatedChecklist) });
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEdit = (cardId, itemIndex, currentText) => {
    setEditingItem({ cardId, itemIndex });
    setEditText(currentText);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    const { cardId, itemIndex } = editingItem;
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const updatedChecklist = [...card.checklist];
    updatedChecklist[itemIndex].text = editText.trim() || "Untitled item";

    try {
      await updateCard(cardId, { description: JSON.stringify(updatedChecklist) });
      setEditingItem(null);
      setEditText("");
      fetchCards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditText("");
  };

  const calculateProgress = (checklist) => {
    if (!checklist || checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  return (
    <>
      {cards.map((card) => {
        const progress = calculateProgress(card.checklist);
        const completedCount = card.checklist.filter(item => item.completed).length;
        
        return (
          <div key={card.id} className="card">
            <div className="card-header">
              <h5 className="card-title">{card.title}</h5>
            </div>

            <div className="card-checklist">
              {card.checklist && card.checklist.length > 0 && (
                <div className="checklist-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{progress}%</span>
                </div>
              )}

              {card.checklist && card.checklist.map((item, index) => (
                <div 
                  key={index} 
                  className={`checklist-item ${item.completed ? 'completed' : ''}`}
                >
                  <input
                    type="checkbox"
                    id={`card-${card.id}-item-${index}`}
                    checked={item.completed}
                    onChange={() => handleToggleChecklistItem(card.id, index)}
                  />
                  
                  {editingItem?.cardId === card.id && editingItem?.itemIndex === index ? (
                    <div className="checklist-item-edit">
                      <input
                        type="text"
                        className="checklist-edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                      <div className="checklist-edit-actions">
                        <button 
                          className="btn-icon btn-icon-success"
                          onClick={handleSaveEdit}
                          title="Save"
                        >
                          ✓
                        </button>
                        <button 
                          className="btn-icon btn-icon-secondary"
                          onClick={handleCancelEdit}
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <label 
                        htmlFor={`card-${card.id}-item-${index}`}
                        onDoubleClick={() => handleStartEdit(card.id, index, item.text)}
                        title="Double-click to edit"
                      >
                        {item.text || "Click to edit"}
                      </label>
                      <button 
                        className="btn-delete-item"
                        onClick={() => handleDeleteChecklistItem(card.id, index)}
                        title="Delete item"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              ))}

              <button 
                className="add-checklist-item-button"
                onClick={() => handleAddChecklistItem(card.id)}
              >
                Add item
              </button>
            </div>

            {card.checklist && card.checklist.length > 0 && (
              <div className="card-meta">
                <span className="card-badge badge-checklist">
                  {completedCount}/{card.checklist.length}
                </span>
                {progress === 100 && (
                  <span className="card-badge badge-completed">
                    Complete
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}

      {isCreating ? (
        <form className="create-card-form" onSubmit={handleCreateCard}>
          <input
            type="text"
            className="input"
            placeholder="Enter card title..."
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
            autoFocus
          />
          <div className="create-card-actions">
            <button type="submit" className="btn btn-primary">
              Add Card
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setIsCreating(false);
                setNewCard("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button 
          className="add-card-button"
          onClick={() => setIsCreating(true)}
        >
          Add a card
        </button>
      )}

      {cards.length === 0 && !isCreating && (
        <div className="cards-empty">
          <p>No cards yet. Click "Add a card" to create one.</p>
        </div>
      )}
    </>
  );
}
