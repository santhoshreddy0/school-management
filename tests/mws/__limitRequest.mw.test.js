const useragent = require("useragent");
const requestIp = require("request-ip");
const middleware = require("../../mws/__limitRequests.mw");

describe("Rate Limiter Middleware", () => {
  let rateLimiter, req, res, next, cache, mockManagers;

  beforeEach(() => {
    cache = {
      client: {
        incr: jest.fn(),
        pexpire: jest.fn(),
      },
    };

    mockManagers = {
      responseDispatcher: {
        dispatch: jest.fn(),
      },
    };

    rateLimiter = middleware({
      meta: {},
      config: {},
      managers: mockManagers,
      cache,
    });

    req = {
      headers: { "user-agent": "Mozilla/5.0" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.spyOn(requestIp, "getClientIp").mockReturnValue("192.168.1.1");
    jest
      .spyOn(useragent, "lookup")
      .mockReturnValue({ toString: () => "Chrome" });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should allow request when below rate limit", async () => {
    cache.client.incr.mockResolvedValue(50);

    await rateLimiter({ req, res, next });

    expect(requestIp.getClientIp).toHaveBeenCalledWith(req);
    expect(useragent.lookup).toHaveBeenCalledWith(req.headers["user-agent"]);
    expect(cache.client.incr).toHaveBeenCalledWith(
      "rate_limit:192.168.1.1Chrome"
    );
    expect(next).toHaveBeenCalled();
  });

  test("should set expiration on first request", async () => {
    cache.client.incr.mockResolvedValue(1);
    cache.client.pexpire.mockResolvedValue();

    await rateLimiter({ req, res, next });

    expect(cache.client.pexpire).toHaveBeenCalledWith(
      "rate_limit:192.168.1.1Chrome",
      10 * 60 * 1000
    );
    expect(next).toHaveBeenCalled();
  });

  test("should return 429 when rate limit is exceeded", async () => {
    cache.client.incr.mockResolvedValue(201);

    await rateLimiter({ req, res, next });

    expect(mockManagers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 429,
      errors: "Too many requests, please try again later.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 500 when Redis throws an error", async () => {
    cache.client.incr.mockRejectedValue(new Error("Redis error"));

    await rateLimiter({ req, res, next });
    expect(mockManagers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 500,
      errors: "Something went wrong",
    });

    expect(next).not.toHaveBeenCalled();
  });
});
