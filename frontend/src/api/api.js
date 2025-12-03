import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const signup = (email, password) =>
  axios.post(`${BASE_URL}/auth/signup`, { email, password });

export const login = (email, password) =>
  axios.post(`${BASE_URL}/auth/login`, { email, password });

export const getBoards = (userId) => axios.get(`${BASE_URL}/boards/${userId}`);

export const createBoard = (owner_id, title) =>
  axios.post(`${BASE_URL}/boards`, { owner_id, title });

export const getLists = (boardId) => axios.get(`${BASE_URL}/lists/${boardId}`);

export const createList = (board_id, title, position) =>
  axios.post(`${BASE_URL}/lists`, { board_id, title, position });

export const getCards = (listId) => axios.get(`${BASE_URL}/cards/${listId}`);

export const createCard = (list_id, title, description, position) =>
  axios.post(`${BASE_URL}/cards`, { list_id, title, description, position });

export const updateCard = (cardId, updates) =>
  axios.put(`${BASE_URL}/cards/${cardId}`, updates);

export const getActivity = (boardId) =>
  axios.get(`${BASE_URL}/activity/${boardId}`);

export const logActivity = (user_id, board_id, action) =>
  axios.post(`${BASE_URL}/activity`, { user_id, board_id, action });
