const User = require("../../../managers/user/User.manager");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../../../libs/utils");

jest.mock("../../../libs/utils", () => ({
  hashPassword: jest.fn(),
}));

describe("User class", () => {
  let userInstance, mockConfig, mockManagers, mockValidators, mockMongoModels;

  beforeEach(() => {
    mockConfig = {};
    mockValidators = {
      user: {
        createUser: jest.fn().mockResolvedValue(null),
        loginUser: jest.fn().mockResolvedValue(null),
        updateProfile: jest.fn().mockResolvedValue(null),
      },
    };
    mockMongoModels = {
      User: {
        findOne: jest.fn(),
        insertOne: jest.fn(),
      },
      Role: {
        findOne: jest.fn(),
      },
    };
    mockManagers = {
      token: {
        genLongToken: jest.fn().mockReturnValue("mockLongToken"),
      },
    };

    userInstance = new User({
      config: mockConfig,
      validators: mockValidators,
      mongomodels: mockMongoModels,
      managers: mockManagers,
    });
  });

  describe("createUser", () => {
    it("should return validation errors if user is invalid", async () => {
      mockValidators.user.createUser.mockResolvedValue("Validation error");

      const result = await userInstance.createUser({
        name: "John",
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toEqual({ errors: "Validation error", code: 422 });
    });

    it("should return an error if user already exists", async () => {
      mockMongoModels.User.findOne.mockResolvedValue({
        email: "john@example.com",
      });

      const result = await userInstance.createUser({
        name: "John",
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toEqual({ error: "User already exists", code: 422 });
    });

    it("should create user and return token", async () => {
      mockMongoModels.User.findOne.mockResolvedValue(null);
      mockMongoModels.Role.findOne.mockResolvedValue({ _id: "mockRoleId" });
      hashPassword.mockResolvedValue("hashedPassword");
      mockMongoModels.User.insertOne.mockResolvedValue({
        _id: "mockUserId",
        key: "mockUserKey",
        name: "John",
        email: "john@example.com",
      });

      const result = await userInstance.createUser({
        name: "John",
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        user: { name: "John", email: "john@example.com" },
        longToken: "mockLongToken",
      });
    });
  });

  describe("loginUser", () => {
    it("should return validation errors if login data is invalid", async () => {
      mockValidators.user.loginUser.mockResolvedValue("Validation error");

      const result = await userInstance.loginUser({
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toEqual({ errors: "Validation error", code: 422 });
    });

    it("should return error if user does not exist", async () => {
      mockMongoModels.User.findOne.mockResolvedValue(null);

      const result = await userInstance.loginUser({
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toEqual({ error: "User does not exist", code: 422 });
    });

    it("should return error if password is incorrect", async () => {
      mockMongoModels.User.findOne.mockResolvedValue({
        email: "john@example.com",
        password: "hashedPassword",
      });
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      const result = await userInstance.loginUser({
        email: "john@example.com",
        password: "wrongPassword",
      });

      expect(result).toEqual({ error: "Invalid password", code: 422 });
    });

    it("should return user and token on successful login", async () => {
      mockMongoModels.User.findOne.mockResolvedValue({
        _id: "mockUserId",
        key: "mockUserKey",
        name: "John",
        email: "john@example.com",
        password: "hashedPassword",
      });
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const result = await userInstance.loginUser({
        email: "john@example.com",
        password: "password123",
      });

      expect(result).toEqual({
        user: { name: "John", email: "john@example.com" },
        longToken: "mockLongToken",
      });
    });
  });

  describe("updateProfile", () => {
    it("should return validation errors if profile data is invalid", async () => {
      mockValidators.user.updateProfile.mockResolvedValue("Validation error");

      const result = await userInstance.updateProfile({
        name: "John",
        password: "password123",
        __shortToken: { userId: "mockUserId" },
      });

      expect(result).toEqual({ errors: "Validation error", code: 422 });
    });

    it("should return error if user does not exist", async () => {
      mockMongoModels.User.findOne.mockResolvedValue(null);

      const result = await userInstance.updateProfile({
        name: "John",
        password: "password123",
        __shortToken: { userId: "mockUserId" },
      });

      expect(result).toEqual({ error: "User does not exist", code: 422 });
    });

    it("should update profile and return user", async () => {
      mockMongoModels.User.findOne.mockResolvedValue({
        _id: "mockUserId",
        name: "Old Name",
        email: "john@example.com",
        password: "hashedPassword",
        save: jest
          .fn()
          .mockResolvedValue({ name: "John", email: "john@example.com" }),
      });
      hashPassword.mockResolvedValue("hashedPassword");

      const result = await userInstance.updateProfile({
        name: "John",
        password: "password123",
        __shortToken: { userId: "mockUserId" },
      });

      expect(result).toEqual({
        user: { name: "John", email: "john@example.com" },
      });
    });
  });
});
