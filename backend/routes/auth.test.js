const express = require("express");
const request = require("supertest");
const authRoutes = require("./auth");

describe("Auth Routes", () => {
  let app;
  let mockSupabase;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockSupabase = {
      auth: {
        admin: {
          createUser: jest.fn(),
        },
        signInWithPassword: jest.fn(),
      },
    };

    app.use("/auth", authRoutes(mockSupabase));
  });

  describe("POST /auth/signup", () => {
    it("should create a new user successfully", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      mockSupabase.auth.admin.createUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const response = await request(app)
        .post("/auth/signup")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(mockSupabase.auth.admin.createUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        email_confirm: true,
      });
    });

    it("should return 400 when Supabase returns an error", async () => {
      mockSupabase.auth.admin.createUser.mockResolvedValue({
        data: null,
        error: { message: "User already exists" },
      });

      const response = await request(app)
        .post("/auth/signup")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "User already exists" });
    });

    it("should return 500 when an exception occurs", async () => {
      mockSupabase.auth.admin.createUser.mockRejectedValue(
        new Error("Database connection failed")
      );

      const response = await request(app)
        .post("/auth/signup")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Server error signing up" });
    });
  });

  describe("POST /auth/login", () => {
    it("should login user successfully", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should return 400 when credentials are invalid", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid credentials" },
      });

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid credentials" });
    });

    it("should return 500 when an exception occurs", async () => {
      mockSupabase.auth.signInWithPassword.mockRejectedValue(
        new Error("Service unavailable")
      );

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Server error logging in" });
    });
  });
});
