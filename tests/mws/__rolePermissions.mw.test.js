const request = require("supertest");
const mongoose = require("mongoose");
const { mockRequest, mockResponse } = require("../utils/testUtils");
const rolePermissionsMiddleware = require("../../mws/__rolePermissions.mw");

describe("Role Permissions Middleware", () => {
  let req, res, next, mongomodels, managers;

  beforeEach(() => {
    req = mockRequest({
      decodedToken: { userId: "652a1234abcdef567890abcd" }, // Mock user ID
      params: { moduleName: "users", fnName: "create" },
    });
    res = mockResponse();
    next = jest.fn();

    mongomodels = {
      User: {
        aggregate: jest
          .fn()
          .mockResolvedValue([
            { permissions: ["users:create", "users:delete"] },
          ]),
      },
    };

    managers = {
      responseDispatcher: {
        dispatch: jest.fn(),
      },
    };
  });

  test("should call next() if user has permission", async () => {
    const middleware = rolePermissionsMiddleware({ mongomodels, managers });
    await middleware({ req, res, next });

    expect(next).toHaveBeenCalled();
    expect(managers.responseDispatcher.dispatch).not.toHaveBeenCalled();
  });

  test("should return 401 if user lacks permission", async () => {
    mongomodels.User.aggregate.mockResolvedValue([
      { permissions: ["users:delete"] },
    ]);
    const middleware = rolePermissionsMiddleware({ mongomodels, managers });

    await middleware({ req, res, next });

    expect(managers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 401,
      errors: "unauthorized",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if user is not found", async () => {
    mongomodels.User.aggregate.mockResolvedValue([]);
    const middleware = rolePermissionsMiddleware({ mongomodels, managers });

    await middleware({ req, res, next });

    expect(managers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 401,
      errors: "unauthorized",
    });
  });

  test("should return 401 if no token is provided", async () => {
    req.decodedToken = null;
    const middleware = rolePermissionsMiddleware({ mongomodels, managers });

    await middleware({ req, res, next });

    expect(managers.responseDispatcher.dispatch).toHaveBeenCalledWith(res, {
      ok: false,
      code: 401,
      errors: "unauthorized",
    });
  });
});
