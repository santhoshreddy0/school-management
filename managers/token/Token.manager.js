const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const md5 = require("md5");

module.exports = class TokenManager {
  constructor({ config }) {
    this.config = config;
    this.longTokenExpiresIn = "7d";
    this.shortTokenExpiresIn = "3d";

    this.httpExposed = ["v1_createShortToken"];
  }

  /**
   * short token are issue from long token
   * short tokens are issued for 72 hours
   * short tokens are connected to user-agent
   * short token are used on the soft logout
   * short tokens are used for account switch
   * short token represents a device.
   * long token represents a single user.
   *
   * long token contains immutable data and long lived
   * master key must exists on any device to create short tokens
   */
  genLongToken({ userId, userKey }) {
    return jwt.sign(
      {
        userKey,
        userId,
      },
      this.config.dotEnv.LONG_TOKEN_SECRET,
      { expiresIn: this.longTokenExpiresIn }
    );
  }

  genShortToken({ userId, userKey, sessionId, deviceId }) {
    return jwt.sign(
      { userKey, userId, sessionId, deviceId },
      this.config.dotEnv.SHORT_TOKEN_SECRET,
      { expiresIn: this.shortTokenExpiresIn }
    );
  }

  _verifyToken({ token, secret }) {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.log(err);
    }
    return decoded;
  }

  verifyLongToken({ token }) {
    return this._verifyToken({
      token,
      secret: this.config.dotEnv.LONG_TOKEN_SECRET,
    });
  }
  verifyShortToken({ token }) {
    return this._verifyToken({
      token,
      secret: this.config.dotEnv.SHORT_TOKEN_SECRET,
    });
  }

  /** generate shortId based on a longId */
  v1_createShortToken({ __longToken, __device }) {
    let decoded = __longToken;
    console.log(decoded);

    let shortToken = this.genShortToken({
      userId: decoded.userId,
      userKey: decoded.userKey,
      sessionId: nanoid(),
      deviceId: md5(__device),
    });

    return { shortToken };
  }
};
