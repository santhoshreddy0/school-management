const School = require("../../../managers/school/School.manager");
const mongoose = require("mongoose");
const { hashPassword } = require("../../../libs/utils");

jest.mock("../../../libs/utils", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
}));

describe("School class", () => {
  let school;
  let mockValidators, mockManagers, mockMongomodels;

  beforeEach(() => {
    mockValidators = {
      school: {
        createSchool: jest.fn().mockResolvedValue(null),
        updateSchool: jest.fn().mockResolvedValue(null),
        addAdmin: jest.fn().mockResolvedValue(null),
      },
    };
    mockManagers = { token: {} };
    mockMongomodels = {
      School: {
        findOne: jest.fn(),
        insertOne: jest.fn().mockResolvedValue({
          name: "Test School",
          description: "A test school",
          _id: "school123",
          active: true,
        }),
        countDocuments: jest.fn().mockResolvedValue(100),
        find: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue([{ name: "School A" }]),
        }),
      },
      User: {
        findOne: jest.fn(),
        insertOne: jest.fn().mockResolvedValue({
          _id: "user123",
          name: "Admin",
          email: "admin@example.com",
        }),
      },
      Role: {
        findOne: jest.fn().mockResolvedValue({ _id: "role123" }),
      },
      SchoolAdminMapping: {
        insertOne: jest
          .fn()
          .mockResolvedValue({ school_id: "school123", user_id: "user123" }),
      },
    };
    school = new School({
      config: { dotEnv: { DEFAULT_PAGE_LIMIT: 10 } },
      managers: mockManagers,
      validators: mockValidators,
      mongomodels: mockMongomodels,
    });
  });

  test("should return validation error for missing name in createSchool", async () => {
    mockValidators.school.createSchool.mockResolvedValue(["Name is required"]);
    const result = await school.createSchool({
      name: "",
      desc: "Test desc",
    });
    expect(result).toEqual({ errors: ["Name is required"], code: 422 });
  });

  test("should return 500 error for unexpected exception in createSchool", async () => {
    mockValidators.school.createSchool.mockRejectedValue(
      new Error("Unexpected error")
    );
    const result = await school.createSchool({
      name: "Test School",
      desc: "Test Description",
    });
    expect(result).toEqual({ error: "Something went wrong", code: 500 });
  });

  test("should return error if admin email already exists in addAdmin", async () => {
    mockValidators.school.addAdmin.mockResolvedValue(null);
    mockMongomodels.School.findOne.mockResolvedValue({ _id: "1" });
    mockMongomodels.User.findOne.mockResolvedValue({
      email: "admin@example.com",
    });
    const result = await school.addAdmin({
      schoolId: "1",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
    });
    expect(result).toEqual({
      error: "user already exists with this email use another email",
      code: 422,
    });
  });

  test("should return error if school does not exist in addAdmin", async () => {
    mockValidators.school.addAdmin.mockResolvedValue(null);
    mockMongomodels.School.findOne.mockResolvedValue(null);
    const result = await school.addAdmin({
      schoolId: "1",
      name: "Admin",
      email: "admin@example.com",
      password: "password",
    });
    expect(result).toEqual({ error: "School does not exist", code: 422 });
  });

  test("should return validation error for missing email in addAdmin", async () => {
    mockValidators.school.addAdmin.mockResolvedValue(["Email is required"]);
    const result = await school.addAdmin({
      schoolId: "1",
      name: "Admin",
      password: "password",
    });
    expect(result).toEqual({ errors: ["Email is required"], code: 422 });
  });

  test("createSchool - successful creation", async () => {
    const result = await school.createSchool({
      name: "Test School",
      desc: "A test school",
    });
    expect(result.school).toHaveProperty("name", "Test School");
    expect(result.school).toHaveProperty("id", "school123");
  });

  test("createSchool - duplicate school", async () => {
    mockMongomodels.School.findOne.mockResolvedValue(true);
    const result = await school.createSchool({
      name: "Duplicate",
      desc: "Desc",
    });
    expect(result).toEqual({ error: "School already exists", code: 422 });
  });

  test("updateSchool - school does not exist", async () => {
    mockMongomodels.School.findOne.mockResolvedValue(null);
    const result = await school.updateSchool({
      id: "invalidId",
      name: "Updated Name",
    });
    expect(result).toEqual({ error: "School does not exist", code: 422 });
  });

  test("addAdmin - successful admin addition", async () => {
    mockMongomodels.School.findOne.mockResolvedValue({
      _id: "school123",
      name: "Test School",
    });
    mockMongomodels.User.findOne.mockResolvedValue(null);
    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    jest.spyOn(mongoose, "startSession").mockResolvedValue(session);

    const result = await school.addAdmin({
      schoolId: "school123",
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
    });
    expect(result.admin).toHaveProperty("name", "Admin");
  });

  test("getSchools - paginated response", async () => {
    const result = await school.getSchools({
      query: { page: "1", limit: "5" },
    });
    expect(result.schools.length).toBeGreaterThan(0);
    expect(result.totalPages).toBe(20);
  });
});
