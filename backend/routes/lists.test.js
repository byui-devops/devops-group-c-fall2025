const express = require("express");
const request = require("supertest");
const listsRoutes = require("./lists");

describe("Lists Routes", () => {
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

    app.use("/lists", listsRoutes(mockSupabase));
  });

  describe("GET /lists/:boardId", () => {
    it("should get all lists for a board successfully", async () => {
      const mockLists = [
        { id: "1", board_id: "board123", title: "To Do", position: 0 },
        { id: "2", board_id: "board123", title: "In Progress", position: 1 },
      ];

      mockSupabase.order.mockResolvedValue({
        data: mockLists,
        error: null,
      });

      const response = await request(app).get("/lists/board123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLists);
      expect(mockSupabase.from).toHaveBeenCalledWith("lists");
      expect(mockSupabase.select).toHaveBeenCalledWith("*");
      expect(mockSupabase.eq).toHaveBeenCalledWith("board_id", "board123");
      expect(mockSupabase.order).toHaveBeenCalledWith("position", { ascending: true });
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const response = await request(app).get("/lists/board123");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Database error" });
    });
  });

  describe("POST /lists", () => {
    it("should create a new list successfully", async () => {
      const newList = { id: "1", board_id: "board123", title: "Done", position: 2 };

      mockSupabase.select.mockResolvedValue({
        data: [newList],
        error: null,
      });

      const response = await request(app)
        .post("/lists")
        .send({ board_id: "board123", title: "Done", position: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(newList);
      expect(mockSupabase.from).toHaveBeenCalledWith("lists");
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        { board_id: "board123", title: "Done", position: 2 },
      ]);
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      });

      const response = await request(app)
        .post("/lists")
        .send({ board_id: "board123", title: "Done", position: 2 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Insert failed" });
    });
  });
});
