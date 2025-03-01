const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const md5 = require("md5");
const TokenManager = require("../../../managers/token/Token.manager"); // Adjust the path

jest.mock("jsonwebtoken");
jest.mock("nanoid");
jest.mock("md5");

describe("TokenManager", () => {
  let tokenManager;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      dotEnv: {
        LONG_TOKEN_SECRET: "long_secret",
        SHORT_TOKEN_SECRET: "short_secret",
      },
    };
    tokenManager = new TokenManager({ config: mockConfig });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should generate a long token", () => {
    jwt.sign.mockReturnValue("mockedLongToken");
    const token = tokenManager.genLongToken({ userId: "123", userKey: "key" });
    expect(jwt.sign).toHaveBeenCalledWith(
      { userKey: "key", userId: "123" },
      "long_secret",
      { expiresIn: "3y" }
    );
    expect(token).toBe("mockedLongToken");
  });

  test("should generate a short token", () => {
    jwt.sign.mockReturnValue("mockedShortToken");
    const token = tokenManager.genShortToken({
      userId: "123",
      userKey: "key",
      sessionId: "session123",
      deviceId: "device123",
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userKey: "key",
        userId: "123",
        sessionId: "session123",
        deviceId: "device123",
      },
      "short_secret",
      { expiresIn: "1y" }
    );
    expect(token).toBe("mockedShortToken");
  });

  test("should verify a valid long token", () => {
    jwt.verify.mockReturnValue({ userId: "123", userKey: "key" });
    const decoded = tokenManager.verifyLongToken({ token: "validToken" });
    expect(jwt.verify).toHaveBeenCalledWith("validToken", "long_secret");
    expect(decoded).toEqual({ userId: "123", userKey: "key" });
  });

  test("should return null for an invalid long token", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const decoded = tokenManager.verifyLongToken({ token: "invalidToken" });
    expect(decoded).toBeNull();
  });

  test("should verify a valid short token", () => {
    jwt.verify.mockReturnValue({ userId: "123", sessionId: "abc" });
    const decoded = tokenManager.verifyShortToken({ token: "validShortToken" });
    expect(jwt.verify).toHaveBeenCalledWith("validShortToken", "short_secret");
    expect(decoded).toEqual({ userId: "123", sessionId: "abc" });
  });

  test("should return null for an invalid short token", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const decoded = tokenManager.verifyShortToken({ token: "invalidToken" });
    expect(decoded).toBeNull();
  });

  test("should create a short token from a long token", () => {
    nanoid.mockReturnValue("session123");
    md5.mockReturnValue("hashedDeviceId");
    jwt.sign.mockReturnValue("mockedShortToken");

    const shortToken = tokenManager.v1_createShortToken({
      __longToken: { userId: "123", userKey: "key" },
      __device: "device123",
    });

    expect(md5).toHaveBeenCalledWith("device123");
    expect(nanoid).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userKey: "key",
        userId: "123",
        sessionId: "session123",
        deviceId: "hashedDeviceId",
      },
      "short_secret",
      { expiresIn: "1y" }
    );
    expect(shortToken).toEqual({ shortToken: "mockedShortToken" });
  });
});
