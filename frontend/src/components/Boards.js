import React, { useState, useEffect } from "react";
import { getBoards, createBoard } from "../api/api";
import Lists from "./Lists";
import "./Boards.css";

export default function Boards({ userId }) {
  const [boards, setBoards] = useState([]);
  const [newBoard, setNewBoard] = useState("");
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boardProgress, setBoardProgress] = useState({});

  useEffect(() => {
    if (userId) fetchBoards();
  }, [userId]);

  const fetchBoards = async () => {
    try {
      const res = await getBoards(userId);
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoard.trim()) return;
    
    try {
      await createBoard(userId, newBoard);
      setNewBoard("");
      fetchBoards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBoardProgressChange = (boardId, progress) => {
    setBoardProgress(prev => ({
      ...prev,
      [boardId]: progress
    }));
  };

  const calculateBoardProgress = (boardId) => {
    const progress = boardProgress[boardId];
    if (!progress || progress.totalItems === 0) return 0;
    return Math.round((progress.completedItems / progress.totalItems) * 100);
  };

  return (
    <div className="boards-container">
      <div className="boards-header">
        <h2>My Boards</h2>
        <form className="create-board-form" onSubmit={handleCreateBoard}>
          <input
            type="text"
            className="input"
            placeholder="Enter board name..."
            value={newBoard}
            onChange={(e) => setNewBoard(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Create Board
          </button>
        </form>
      </div>

      {boards.length === 0 ? (
        <div className="empty-state">
          <h3>No boards yet</h3>
          <p>Create your first board to get started organizing your tasks</p>
        </div>
      ) : (
        <>
          {!selectedBoard ? (
            <div className="boards-grid">
              {boards.map((board) => {
                const progress = calculateBoardProgress(board.id);
                const progressData = boardProgress[board.id] || { totalItems: 0, completedItems: 0 };
                
                return (
                  <div
                    key={board.id}
                    className="board-card"
                    onClick={() => setSelectedBoard(board)}
                  >
                    <div className="board-card-header">
                      <h3>{board.title}</h3>
                    </div>
                    <div className="board-card-meta">
                      <div className="board-card-meta-item">
                        <span>Tasks: {progressData.totalItems}</span>
                      </div>
                      <div className="board-card-meta-item">
                        <span>Completed: {progressData.completedItems}</span>
                      </div>
                    </div>
                    {progressData.totalItems > 0 && (
                      <div className="board-card-progress">
                        <div className="board-progress-header">
                          <span>Overall Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="board-progress-bar">
                          <div 
                            className="board-progress-fill" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="board-card-expanded">
              <div className="board-expanded-header">
                <div className="board-expanded-title-section">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setSelectedBoard(null)}
                  >
                    ← Back to Boards
                  </button>
                  <h3>{selectedBoard.title}</h3>
                </div>
                {boardProgress[selectedBoard.id]?.totalItems > 0 && (
                  <div className="board-overall-progress">
                    <div className="board-overall-progress-bar">
                      <div 
                        className="board-overall-progress-fill" 
                        style={{ width: `${calculateBoardProgress(selectedBoard.id)}%` }}
                      />
                    </div>
                    <span className="board-overall-progress-text">
                      {calculateBoardProgress(selectedBoard.id)}%
                    </span>
                  </div>
                )}
              </div>
              <Lists 
                boardId={selectedBoard.id} 
                onProgressChange={(progress) => handleBoardProgressChange(selectedBoard.id, progress)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
