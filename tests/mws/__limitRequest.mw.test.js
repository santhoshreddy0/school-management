const rateLimiterMiddleware = require("../../mws/__limitRequests.mw");
const useragent = require("useragent");
const requestIp = require("request-ip");

jest.mock("useragent");
jest.mock("request-ip");

describe("Rate Limiter Middleware", () => {
  let req, res, next, cache, managers;

  beforeEach(() => {
    req = { headers: { "user-agent": "Mozilla/5.0" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    cache = {
      client: {
        incr: jest.fn(),
        pexpire: jest.fn(),
      },
    };

    managers = {
      responseDispatcher: {
        dispatch: jest.fn(),
      },
    };
  });

  test("should allow request when within rate limit", async () => {
    requestIp.getClientIp.mockReturnValue("192.168.1.1");
    useragent.lookup.mockReturnValue("TestAgent");
    cache.client.incr.mockResolvedValue(10);

    const middleware = rateLimiterMiddleware({
      meta: {},
      config: {},
      managers,
      cache,
    });
    await middleware({ req, res, next });

    expect(cache.client.incr).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test("should block request when exceeding rate limit", async () => {
    requestIp.getClientIp.mockReturnValue("192.168.1.1");
    useragent.lookup.mockReturnValue("TestAgent");
    cache.client.incr.mockResolvedValue(101);

    const middleware = rateLimiterMiddleware({
      meta: {},
      config: {},
      managers,
      cache,
    });
    await middleware({ req, res, next });

    expect(managers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 429,
      errors: "Too many requests, please try again later.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should handle Redis errors gracefully", async () => {
    requestIp.getClientIp.mockReturnValue("192.168.1.1");
    useragent.lookup.mockReturnValue("TestAgent");
    cache.client.incr.mockRejectedValue(new Error("Redis error"));

    const middleware = rateLimiterMiddleware({
      meta: {},
      config: {},
      managers,
      cache,
    });
    await middleware({ req, res, next });

    expect(managers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 500,
      errors: "Something went wrong",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should set expiration for new request key", async () => {
    requestIp.getClientIp.mockReturnValue("192.168.1.1");
    useragent.lookup.mockReturnValue("TestAgent");
    cache.client.incr.mockResolvedValue(1);

    const middleware = rateLimiterMiddleware({
      meta: {},
      config: {},
      managers,
      cache,
    });
    await middleware({ req, res, next });

    expect(cache.client.pexpire).toHaveBeenCalledWith(
      expect.any(String),
      10 * 60 * 1000
    );
  });
});
