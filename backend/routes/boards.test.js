const express = require("express");
const request = require("supertest");
const boardsRoutes = require("./boards");

describe("Boards Routes", () => {
  let app;
  let mockSupabase;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockSupabase = {
      from: jest.fn(() => mockSupabase),
      select: jest.fn(() => mockSupabase),
      insert: jest.fn(() => mockSupabase),
      eq: jest.fn(() => mockSupabase),
      order: jest.fn(() => mockSupabase),
    };

    app.use("/boards", boardsRoutes(mockSupabase));
  });

  describe("GET /boards/:userId", () => {
    it("should get all boards for a user successfully", async () => {
      const mockBoards = [
        { id: "1", owner_id: "user123", title: "Board 1" },
        { id: "2", owner_id: "user123", title: "Board 2" },
      ];

      mockSupabase.order.mockResolvedValue({
        data: mockBoards,
        error: null,
      });

      const response = await request(app).get("/boards/user123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBoards);
      expect(mockSupabase.from).toHaveBeenCalledWith("boards");
      expect(mockSupabase.select).toHaveBeenCalledWith("*");
      expect(mockSupabase.eq).toHaveBeenCalledWith("owner_id", "user123");
      expect(mockSupabase.order).toHaveBeenCalledWith("created_at", { ascending: true });
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const response = await request(app).get("/boards/user123");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Database error" });
    });

    it("should return 500 when an exception occurs", async () => {
      mockSupabase.order.mockRejectedValue(new Error("Connection failed"));

      const response = await request(app).get("/boards/user123");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Server error fetching boards" });
    });
  });

  describe("POST /boards", () => {
    it("should create a new board successfully", async () => {
      const newBoard = { id: "1", owner_id: "user123", title: "New Board" };

      mockSupabase.select.mockResolvedValue({
        data: [newBoard],
        error: null,
      });

      const response = await request(app)
        .post("/boards")
        .send({ owner_id: "user123", title: "New Board" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(newBoard);
      expect(mockSupabase.from).toHaveBeenCalledWith("boards");
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        { owner_id: "user123", title: "New Board" },
      ]);
    });

    it("should return 400 when owner_id is missing", async () => {
      const response = await request(app)
        .post("/boards")
        .send({ title: "New Board" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "owner_id and title are required" });
    });

    it("should return 400 when title is missing", async () => {
      const response = await request(app)
        .post("/boards")
        .send({ owner_id: "user123" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "owner_id and title are required" });
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      });

      const response = await request(app)
        .post("/boards")
        .send({ owner_id: "user123", title: "New Board" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Insert failed" });
    });

    it("should return 500 when an exception occurs", async () => {
      mockSupabase.select.mockRejectedValue(new Error("Connection failed"));

      const response = await request(app)
        .post("/boards")
        .send({ owner_id: "user123", title: "New Board" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Server error creating board" });
    });
  });
});
