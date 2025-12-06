import React, { useState, useEffect } from "react";
import { getLists, createList } from "../api/api";
import Cards from "./Cards";
import "./Lists.css";

export default function Lists({ boardId, onProgressChange }) {
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [listProgress, setListProgress] = useState({});

  useEffect(() => {
    fetchLists();
  }, [boardId]);

  useEffect(() => {
    // Calculate total board progress whenever list progress changes
    if (onProgressChange) {
      const totalItems = Object.values(listProgress).reduce((sum, lp) => 
        sum + (lp.totalItems || 0), 0);
      const completedItems = Object.values(listProgress).reduce((sum, lp) => 
        sum + (lp.completedItems || 0), 0);
      onProgressChange({ totalItems, completedItems });
    }
  }, [listProgress, onProgressChange]);

  const fetchLists = async () => {
    try {
      const res = await getLists(boardId);
      setLists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newList.trim()) return;
    
    try {
      await createList(boardId, newList, lists.length);
      setNewList("");
      setIsCreating(false);
      fetchLists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleListProgressChange = (listId, progress) => {
    setListProgress(prev => ({
      ...prev,
      [listId]: progress
    }));
  };

  const calculateListProgress = (listId) => {
    const progress = listProgress[listId];
    if (!progress || progress.totalItems === 0) return 0;
    return Math.round((progress.completedItems / progress.totalItems) * 100);
  };

  return (
    <div className="lists-container">
      {lists.length === 0 && !isCreating ? (
        <div className="lists-empty">
          <h3>No lists yet</h3>
          <p>Create your first list to start organizing tasks</p>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsCreating(true)}
          >
            Create List
          </button>
        </div>
      ) : (
        <div className="lists-board">
          {lists.map((list) => {
            const progress = calculateListProgress(list.id);
            const progressData = listProgress[list.id] || { totalItems: 0, completedItems: 0 };
            
            return (
              <div key={list.id} className="list-column">
                <div className="list-header">
                  <div className="list-title-row">
                    <h4>{list.title}</h4>
                    <span className="list-count">{progressData.totalItems}</span>
                  </div>
                  {progressData.totalItems > 0 && (
                    <div className="list-progress">
                      <div className="list-progress-bar">
                        <div 
                          className="list-progress-fill" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="list-progress-text">{progress}%</span>
                    </div>
                  )}
                </div>
                <div className="list-cards">
                  <Cards 
                    listId={list.id} 
                    onProgressChange={(progress) => handleListProgressChange(list.id, progress)}
                  />
                </div>
              </div>
            );
          })}

          {isCreating ? (
            <div className="list-column">
              <form onSubmit={handleCreateList}>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter list title..."
                  value={newList}
                  onChange={(e) => setNewList(e.target.value)}
                  autoFocus
                  style={{ marginBottom: "8px", width: "100%" }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="submit" className="btn btn-primary" style={{ fontSize: "13px", padding: "8px 16px" }}>
                    Add List
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsCreating(false);
                      setNewList("");
                    }}
                    style={{ fontSize: "13px", padding: "8px 16px" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div 
              className="add-list-column"
              onClick={() => setIsCreating(true)}
            >
              Add List
            </div>
          )}
        </div>
      )}
    </div>
  );
}
