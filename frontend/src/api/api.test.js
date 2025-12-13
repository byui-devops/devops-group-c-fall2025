import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as api from "./api";

describe("API functions", () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test("signup calls /auth/signup with correct data", async () => {
    const email = "test@example.com";
    const password = "123456";
    mock.onPost("/api/auth/signup").reply(201, { success: true });

    const response = await api.signup(email, password);
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ success: true });
  });

  test("login calls /auth/login with correct data", async () => {
    const email = "test@example.com";
    const password = "123456";
    mock.onPost("/api/auth/login").reply(200, { token: "abc123" });

    const response = await api.login(email, password);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ token: "abc123" });
  });

  test("getBoards calls /boards/:userId", async () => {
    const userId = 1;
    mock.onGet(`/api/boards/${userId}`).reply(200, [{ id: 1, title: "Board1" }]);

    const response = await api.getBoards(userId);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([{ id: 1, title: "Board1" }]);
  });

  test("createBoard calls /boards with correct data", async () => {
    const owner_id = 1;
    const title = "New Board";
    mock.onPost("/api/boards").reply(201, { id: 1, owner_id, title });

    const response = await api.createBoard(owner_id, title);
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ id: 1, owner_id, title });
  });

  test("getLists calls /lists/:boardId", async () => {
    const boardId = 1;
    mock.onGet(`/api/lists/${boardId}`).reply(200, [{ id: 1, title: "List1" }]);

    const response = await api.getLists(boardId);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([{ id: 1, title: "List1" }]);
  });

  test("createList calls /lists with correct data", async () => {
    const board_id = 1;
    const title = "New List";
    const position = 1;
    mock.onPost("/api/lists").reply(201, { id: 1, board_id, title, position });

    const response = await api.createList(board_id, title, position);
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ id: 1, board_id, title, position });
  });

  test("getCards calls /cards/:listId", async () => {
    const listId = 1;
    mock.onGet(`/api/cards/${listId}`).reply(200, [{ id: 1, title: "Card1" }]);

    const response = await api.getCards(listId);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([{ id: 1, title: "Card1" }]);
  });

  test("createCard calls /cards with correct data", async () => {
    const list_id = 1;
    const title = "New Card";
    const description = "desc";
    const position = 1;
    mock.onPost("/api/cards").reply(201, { id: 1, list_id, title, description, position });

    const response = await api.createCard(list_id, title, description, position);
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ id: 1, list_id, title, description, position });
  });

  test("updateCard calls /cards/:cardId with correct data", async () => {
    const cardId = 1;
    const updates = { title: "Updated Card" };
    mock.onPut(`/api/cards/${cardId}`).reply(200, { id: 1, ...updates });

    const response = await api.updateCard(cardId, updates);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ id: 1, ...updates });
  });

  test("getActivity calls /activity/:boardId", async () => {
    const boardId = 1;
    mock.onGet(`/api/activity/${boardId}`).reply(200, [{ id: 1, action: "test" }]);

    const response = await api.getActivity(boardId);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([{ id: 1, action: "test" }]);
  });

  test("logActivity calls /activity with correct data", async () => {
    const user_id = 1;
    const board_id = 1;
    const action = "created card";
    mock.onPost("/api/activity").reply(201, { id: 1, user_id, board_id, action });

    const response = await api.logActivity(user_id, board_id, action);
    expect(response.status).toBe(201);
    expect(response.data).toEqual({ id: 1, user_id, board_id, action });
  });
});

