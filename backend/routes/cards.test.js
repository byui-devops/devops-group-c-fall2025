const express = require("express");
const request = require("supertest");
const cardsRoutes = require("./cards");

describe("Cards Routes", () => {
  let app;
  let mockSupabase;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockSupabase = {
      from: jest.fn(() => mockSupabase),
      select: jest.fn(() => mockSupabase),
      insert: jest.fn(() => mockSupabase),
      update: jest.fn(() => mockSupabase),
      eq: jest.fn(() => mockSupabase),
      order: jest.fn(() => mockSupabase),
    };

    app.use("/cards", cardsRoutes(mockSupabase));
  });

  describe("GET /cards/:listId", () => {
    it("should get all cards for a list successfully", async () => {
      const mockCards = [
        { id: "1", list_id: "list123", title: "Task 1", position: 0 },
        { id: "2", list_id: "list123", title: "Task 2", position: 1 },
      ];

      mockSupabase.order.mockResolvedValue({
        data: mockCards,
        error: null,
      });

      const response = await request(app).get("/cards/list123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCards);
      expect(mockSupabase.from).toHaveBeenCalledWith("cards");
      expect(mockSupabase.select).toHaveBeenCalledWith("*");
      expect(mockSupabase.eq).toHaveBeenCalledWith("list_id", "list123");
      expect(mockSupabase.order).toHaveBeenCalledWith("position", { ascending: true });
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const response = await request(app).get("/cards/list123");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Database error" });
    });
  });

  describe("POST /cards", () => {
    it("should create a new card successfully", async () => {
      const newCard = {
        id: "1",
        list_id: "list123",
        title: "New Task",
        description: "Task description",
        position: 2,
      };

      mockSupabase.select.mockResolvedValue({
        data: [newCard],
        error: null,
      });

      const response = await request(app)
        .post("/cards")
        .send({
          list_id: "list123",
          title: "New Task",
          description: "Task description",
          position: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(newCard);
      expect(mockSupabase.from).toHaveBeenCalledWith("cards");
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        {
          list_id: "list123",
          title: "New Task",
          description: "Task description",
          position: 2,
        },
      ]);
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      });

      const response = await request(app)
        .post("/cards")
        .send({
          list_id: "list123",
          title: "New Task",
          description: "Task description",
          position: 2,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Insert failed" });
    });
  });

  describe("PUT /cards/:cardId", () => {
    it("should update a card successfully", async () => {
      const updatedCard = {
        id: "card123",
        list_id: "list123",
        title: "Updated Task",
        description: "Updated description",
        position: 3,
      };

      mockSupabase.select.mockResolvedValue({
        data: [updatedCard],
        error: null,
      });

      const response = await request(app)
        .put("/cards/card123")
        .send({
          title: "Updated Task",
          description: "Updated description",
          position: 3,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCard);
      expect(mockSupabase.from).toHaveBeenCalledWith("cards");
      expect(mockSupabase.update).toHaveBeenCalledWith({
        title: "Updated Task",
        description: "Updated description",
        position: 3,
      });
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "card123");
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: { message: "Update failed" },
      });

      const response = await request(app)
        .put("/cards/card123")
        .send({ title: "Updated Task" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Update failed" });
    });
  });
});
