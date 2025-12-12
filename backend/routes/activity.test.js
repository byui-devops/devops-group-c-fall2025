const express = require("express");
const request = require("supertest");
const activityRoutes = require("./activity");

describe("Activity Routes", () => {
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

    app.use("/activity", activityRoutes(mockSupabase));
  });

  describe("GET /activity/:boardId", () => {
    it("should get all activity for a board successfully", async () => {
      const mockActivity = [
        { id: "1", board_id: "board123", user_id: "user123", action: "created card" },
        { id: "2", board_id: "board123", user_id: "user123", action: "moved card" },
      ];

      mockSupabase.order.mockResolvedValue({
        data: mockActivity,
        error: null,
      });

      const response = await request(app).get("/activity/board123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockActivity);
      expect(mockSupabase.from).toHaveBeenCalledWith("activity");
      expect(mockSupabase.select).toHaveBeenCalledWith("*");
      expect(mockSupabase.eq).toHaveBeenCalledWith("board_id", "board123");
      expect(mockSupabase.order).toHaveBeenCalledWith("created_at", { ascending: false });
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const response = await request(app).get("/activity/board123");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Database error" });
    });
  });

  describe("POST /activity", () => {
    it("should log a new activity successfully", async () => {
      const newActivity = {
        id: "1",
        user_id: "user123",
        board_id: "board123",
        action: "created board",
      };

      mockSupabase.select.mockResolvedValue({
        data: [newActivity],
        error: null,
      });

      const response = await request(app)
        .post("/activity")
        .send({
          user_id: "user123",
          board_id: "board123",
          action: "created board",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(newActivity);
      expect(mockSupabase.from).toHaveBeenCalledWith("activity");
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        {
          user_id: "user123",
          board_id: "board123",
          action: "created board",
        },
      ]);
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      });

      const response = await request(app)
        .post("/activity")
        .send({
          user_id: "user123",
          board_id: "board123",
          action: "created board",
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Insert failed" });
    });
  });
});
