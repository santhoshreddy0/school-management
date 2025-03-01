const Classroom = require("../../../managers/classroom/Classroom.manager");
const mockManagers = {
  token: jest.fn(),
};
const mockValidators = {
  Classroom: {
    createClassroom: jest.fn(),
    updateClassroom: jest.fn(),
  },
};
const mockMongomodels = {
  Classroom: {
    findOne: jest.fn(),
    insertOne: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(() => ({
      skip: jest.fn(() => ({ limit: jest.fn(() => []) })),
    })),
  },
};

describe("Classroom Manager", () => {
  let classroom;

  beforeEach(() => {
    classroom = new Classroom({
      managers: mockManagers,
      validators: mockValidators,
      mongomodels: mockMongomodels,
      config: { dotEnv: { DEFAULT_PAGE_LIMIT: 10 } },
    });
  });

  test("should create a new classroom successfully", async () => {
    mockValidators.Classroom.createClassroom.mockResolvedValue(null);
    mockMongomodels.Classroom.findOne.mockResolvedValue(null);
    mockMongomodels.Classroom.insertOne.mockResolvedValue({
      name: "Math 101",
      description: "Algebra class",
      _id: "123",
      school_id: "school123",
      capacity: 30,
      active: true,
    });

    const result = await classroom.createClassroom({
      schoolId: "school123",
      name: "Math 101",
      desc: "Algebra class",
      capacity: 30,
    });

    expect(result.class).toHaveProperty("id", "123");
  });

  test("should return an error if classroom already exists", async () => {
    mockValidators.Classroom.createClassroom.mockResolvedValue(null);
    mockMongomodels.Classroom.findOne.mockResolvedValue({ name: "Math 101" });

    const result = await classroom.createClassroom({
      schoolId: "school123",
      name: "Math 101",
      desc: "Algebra class",
      capacity: 30,
    });

    expect(result).toEqual({ error: "Classroom already exists", code: 422 });
  });

  test("should return an error on database failure", async () => {
    mockValidators.Classroom.createClassroom.mockResolvedValue(null);
    mockMongomodels.Classroom.findOne.mockImplementation(() => {
      throw new Error("DB failure");
    });

    const result = await classroom.createClassroom({
      schoolId: "school123",
      name: "Math 101",
      desc: "Algebra class",
      capacity: 30,
    });

    expect(result).toEqual({ error: "Something went wrong", code: 500 });
  });

  test("should update classroom successfully", async () => {
    mockValidators.Classroom.updateClassroom.mockResolvedValue(null);
    mockMongomodels.Classroom.findOne.mockResolvedValue({
      _id: "class123",
      name: "Math 101",
      description: "Algebra class",
      active: true,
      capacity: 30,
      save: jest.fn().mockResolvedValue({
        _id: "class123",
        name: "Math 102",
        description: "Updated class",
        active: false,
        capacity: 35,
      }),
    });

    const result = await classroom.updateClassroom({
      classroomId: "class123",
      name: "Math 102",
      desc: "Updated class",
      active: false,
      capacity: 35,
    });

    expect(result.classroom).toHaveProperty("name", "Math 102");
  });

  test("should return an error if trying to decrease capacity", async () => {
    mockValidators.Classroom.updateClassroom.mockResolvedValue(null);
    mockMongomodels.Classroom.findOne.mockResolvedValue({
      _id: "class123",
      capacity: 30,
    });

    const result = await classroom.updateClassroom({
      classroomId: "class123",
      capacity: 25,
    });

    expect(result).toEqual({
      error: "Capacity cannot be decreased",
      code: 422,
    });
  });

  test("should return an error when fetching classrooms fails", async () => {
    mockMongomodels.Classroom.find.mockImplementation(() => {
      throw new Error("DB failure");
    });

    const result = await classroom.getClassrooms({
      query: { page: 1, limit: 10 },
    });

    expect(result).toEqual({ error: "Something went wrong", code: 500 });
  });
});
