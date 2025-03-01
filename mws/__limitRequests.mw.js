const useragent = require("useragent");
const requestIp = require("request-ip");

module.exports = ({ meta, config, managers, cache }) => {
  return async ({ req, res, next }) => {
    let ip = "N/A";
    let agent = "N/A";
    ip = requestIp.getClientIp(req) || ip;
    agent = useragent.lookup(req.headers["user-agent"]) || agent;
    const uniqueDevice = ip + agent;
    const windowMs = 10 * 60 * 1000; // 10 minutes window
    const maxRequests = 200; // Max 100 requests per window
    const key = `rate_limit:${uniqueDevice}`;

    try {
      const redisClient = cache.client;

      const currentRequests = await redisClient.incr(key); // Increment request count

      if (currentRequests === 1) {
        await redisClient.pexpire(key, windowMs); // Set expiration if first request
      }
      console.log(managers);

      if (currentRequests > maxRequests) {
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 429,
          errors: "Too many requests, please try again later.",
        });
      }

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 500,
        errors: "Something went wrong",
      });
    }
  };
};
