import * as userModel from "../../models/userModel";
import { supabase } from "../../supabase/supabaseClient";
import * as argon2 from "argon2";
import { logger } from "../../utils/logger";

// Mock Supabase
jest.mock("../../supabase/supabaseClient", () => ({
  supabase: {
    from: jest.fn((table: string) => ({
      select: jest.fn(() => ({
        eq: jest.fn((column: string, value: any) => ({
          single: jest.fn(),
        })),
      })),
      insert: jest.fn(
        (
          values: any,
          options?: { count?: "exact" | "planned" | "estimated" }
        ) => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })
      ),
      update: jest.fn((values: any) => ({
        eq: jest.fn((column: string, value: any) => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn((column: string, value: any) => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

// Mock argon2
jest.mock("argon2", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
}));

// Mock logger
jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("User Model Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addUser", () => {
    it("should add a new user", async () => {
      const mockUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password",
      };
      const mockReturnedUser = {
        id: "1",
        ...mockUser,
        password: "hashedPassword",
      };
      const insertMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockReturnedUser }),
        }),
      });
      (supabase.from as jest.Mock).mockReturnValue({ insert: insertMock });

      const result = await userModel.addUser(mockUser);

      expect(result).toEqual(mockReturnedUser);
      expect(argon2.hash).toHaveBeenCalledWith("password");
      expect(supabase.from).toHaveBeenCalledWith("users");
      expect(insertMock).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        password: "hashedPassword",
      });
    });

    it("should throw an error if Supabase insert fails", async () => {
      const mockUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password",
      };
      const insertMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest
            .fn()
            .mockResolvedValue({ error: new Error("Insert failed") }),
        }),
      });
      (supabase.from as jest.Mock).mockReturnValue({ insert: insertMock });

      await expect(userModel.addUser(mockUser)).rejects.toThrow(
        "Insert failed"
      );
    });
  });

  describe("findUserByEmail", () => {
    it("should find a user by email", async () => {
      const mockUser = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      };
      const selectMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUser }),
        }),
      });
      (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

      const result = await userModel.findUserByEmail("test@example.com");

      expect(result).toEqual(mockUser);
      expect(supabase.from).toHaveBeenCalledWith("users");
      expect(selectMock).toHaveBeenCalledWith("*");
      expect(selectMock().eq).toHaveBeenCalledWith("email", "test@example.com");
    });

    it("should return null if user is not found", async () => {
      const selectMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null }),
        }),
      });
      (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

      const result = await userModel.findUserByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const mockUpdatedUser = { id: "1", name: "Updated User" };
      const updateMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockUpdatedUser }),
          }),
        }),
      });
      (supabase.from as jest.Mock).mockReturnValue({ update: updateMock });

      const result = await userModel.updateUser("1", { name: "Updated User" });

      expect(result).toEqual(mockUpdatedUser);
      expect(supabase.from).toHaveBeenCalledWith("users");
      expect(updateMock).toHaveBeenCalledWith({ name: "Updated User" });
      expect(updateMock().eq).toHaveBeenCalledWith("id", "1");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const deleteMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });
      (supabase.from as jest.Mock).mockReturnValue({ delete: deleteMock });

      const result = await userModel.deleteUser("1");

      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith("users");
      expect(deleteMock().eq).toHaveBeenCalledWith("id", "1");
    });

    it("should return false if deletion fails", async () => {
      const deleteMock = jest.fn().mockReturnValue({
        eq: jest
          .fn()
          .mockResolvedValue({ error: new Error("Deletion failed") }),
      });
      (supabase.from as jest.Mock).mockReturnValue({ delete: deleteMock });

      const result = await userModel.deleteUser("1");

      expect(result).toBe(false);
    });
  });

  describe("getAllUsers", () => {
    it("should get all users", async () => {
      const mockUsers = [
        { id: "1", name: "User 1" },
        { id: "2", name: "User 2" },
      ];
      const selectMock = jest.fn().mockResolvedValue({ data: mockUsers });
      (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

      const result = await userModel.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(supabase.from).toHaveBeenCalledWith("users");
      expect(selectMock).toHaveBeenCalledWith("*");
    });
  });

  describe("getUserById", () => {
    it("should get a user by id", async () => {
      const mockUser = { id: "1", name: "Test User" };
      const selectMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUser }),
        }),
      });
      (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

      const result = await userModel.getUserById("1");

      expect(result).toEqual(mockUser);
      expect(supabase.from).toHaveBeenCalledWith("users");
      expect(selectMock).toHaveBeenCalledWith("*");
      expect(selectMock().eq).toHaveBeenCalledWith("id", "1");
    });
  });

  describe("saveRefreshToken", () => {
    it("should save a refresh token", async () => {
      const insertMock = jest.fn().mockResolvedValue({ data: {}, error: null });
      (supabase.from as jest.Mock).mockReturnValue({ insert: insertMock });

      await userModel.saveRefreshToken("1", "refreshToken");

      expect(supabase.from).toHaveBeenCalledWith("user_refresh_tokens");
      expect(insertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "1",
          refresh_token: "refreshToken",
          expires_at: expect.any(String),
        })
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Successfully saved refresh token")
      );
    });

    it("should throw an error if saving fails", async () => {
      const insertMock = jest
        .fn()
        .mockResolvedValue({ error: new Error("Save failed") });
      (supabase.from as jest.Mock).mockReturnValue({ insert: insertMock });

      await expect(
        userModel.saveRefreshToken("1", "refreshToken")
      ).rejects.toThrow("Failed to save refresh token");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  // Add tests for validateRefreshToken, replaceRefreshToken, and deleteRefreshToken here
});
