const middleware = require("../../mws/__shortToken.mw");

describe("Token Authentication Middleware", () => {
  let req, res, next, mockManagers;

  beforeEach(() => {
    req = { headers: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();

    mockManagers = {
      responseDispatcher: {
        dispatch: jest.fn(),
      },
      token: {
        verifyShortToken: jest.fn(),
      },
    };
  });

  it("should return 401 if token is missing", () => {
    const handler = middleware({
      meta: {},
      config: {},
      managers: mockManagers,
    });
    handler({ req, res, next });

    expect(mockManagers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 401,
      errors: "unauthorized",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token verification fails", () => {
    req.headers.token = "invalid-token";
    mockManagers.token.verifyShortToken.mockReturnValue(null);

    const handler = middleware({
      meta: {},
      config: {},
      managers: mockManagers,
    });
    handler({ req, res, next });

    expect(mockManagers.token.verifyShortToken).toHaveBeenCalledWith({
      token: "invalid-token",
    });
    expect(mockManagers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 401,
      errors: "unauthorized",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token verification throws an error", () => {
    req.headers.token = "error-token";
    mockManagers.token.verifyShortToken.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const handler = middleware({
      meta: {},
      config: {},
      managers: mockManagers,
    });
    handler({ req, res, next });

    expect(mockManagers.token.verifyShortToken).toHaveBeenCalledWith({
      token: "error-token",
    });
    expect(mockManagers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 401,
      errors: "unauthorized",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with decoded token if verification is successful", () => {
    req.headers.token = "valid-token";
    const decodedToken = { userId: 123 };
    mockManagers.token.verifyShortToken.mockReturnValue(decodedToken);

    const handler = middleware({
      meta: {},
      config: {},
      managers: mockManagers,
    });
    handler({ req, res, next });

    expect(mockManagers.token.verifyShortToken).toHaveBeenCalledWith({
      token: "valid-token",
    });
    expect(req.decodedToken).toEqual(decodedToken);
    expect(next).toHaveBeenCalledWith(decodedToken);
  });
});
