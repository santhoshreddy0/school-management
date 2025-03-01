const Student = require("../../../managers/student/Student.manager"); // Update with correct path

describe("Student class", () => {
  let student;
  let mockValidators, mockMongoModels, mockManagers;

  beforeEach(() => {
    mockValidators = {
      Student: {
        enroll: jest.fn(),
        transfer: jest.fn(),
      },
    };
    mockMongoModels = {
      User: { findOne: jest.fn() },
      Classroom: { findOne: jest.fn() },
      ClassUserMapping: {
        findOne: jest.fn(),
        insertOne: jest.fn(),
      },
    };
    mockManagers = { token: {} };
    student = new Student({
      validators: mockValidators,
      mongomodels: mockMongoModels,
      managers: mockManagers,
    });
  });

  describe("enroll", () => {
    it("should return validation errors if enrollment fails validation", async () => {
      mockValidators.Student.enroll.mockResolvedValue("Invalid data");
      const result = await student.enroll({
        classId: "123",
        email: "test@example.com",
      });
      expect(result).toEqual({ errors: "Invalid data", code: 422 });
    });

    it("should return error if user does not exist", async () => {
      mockValidators.Student.enroll.mockResolvedValue(null);
      mockMongoModels.User.findOne.mockResolvedValue(null);
      const result = await student.enroll({
        classId: "123",
        email: "test@example.com",
      });
      expect(result).toEqual({ error: "User does not exists", code: 404 });
    });

    it("should return error if classroom does not exist", async () => {
      mockValidators.Student.enroll.mockResolvedValue(null);
      mockMongoModels.User.findOne.mockResolvedValue({ _id: "user123" });
      mockMongoModels.Classroom.findOne.mockResolvedValue(null);
      const result = await student.enroll({
        classId: "123",
        email: "test@example.com",
      });
      expect(result).toEqual({ error: "classroom not found", code: 404 });
    });

    it("should return error if user is already enrolled", async () => {
      mockValidators.Student.enroll.mockResolvedValue(null);
      mockMongoModels.User.findOne.mockResolvedValue({ _id: "user123" });
      mockMongoModels.Classroom.findOne.mockResolvedValue({});
      mockMongoModels.ClassUserMapping.findOne.mockResolvedValue({});
      const result = await student.enroll({
        classId: "123",
        email: "test@example.com",
      });
      expect(result).toEqual({
        error: "Already enrolled to the class",
        code: 409,
      });
    });

    it("should successfully enroll a user", async () => {
      mockValidators.Student.enroll.mockResolvedValue(null);
      mockMongoModels.User.findOne.mockResolvedValue({ _id: "user123" });
      mockMongoModels.Classroom.findOne.mockResolvedValue({});
      mockMongoModels.ClassUserMapping.findOne.mockResolvedValue(null);
      mockMongoModels.ClassUserMapping.insertOne.mockResolvedValue({
        class_id: "123",
        user_id: "user123",
      });

      const result = await student.enroll({
        classId: "123",
        email: "test@example.com",
      });
      expect(result).toEqual({
        enrollmentDetails: {
          classId: "123",
          email: "test@example.com",
          user_id: "user123",
        },
      });
    });
  });

  describe("transfer", () => {
    it("should return validation errors if transfer fails validation", async () => {
      mockValidators.Student.transfer.mockResolvedValue("Invalid data");
      const result = await student.transfer({
        presentClassId: "123",
        newClassId: "456",
        email: "test@example.com",
      });
      expect(result).toEqual({ errors: "Invalid data", code: 422 });
    });

    it("should return error if presentClassId and newClassId are the same", async () => {
      const result = await student.transfer({
        presentClassId: "123",
        newClassId: "123",
        email: "test@example.com",
      });
      expect(result).toEqual({
        error: "presentClassId and newClassId are same",
        code: 422,
      });
    });

    it("should return error if user does not exist", async () => {
      mockValidators.Student.transfer.mockResolvedValue(null);
      mockMongoModels.User.findOne.mockResolvedValue(null);
      const result = await student.transfer({
        presentClassId: "123",
        newClassId: "456",
        email: "test@example.com",
      });
      expect(result).toEqual({ error: "User does not exists", code: 404 });
    });

    it("should return error if present class is not found", async () => {
      mockValidators.Student.transfer.mockResolvedValue(null);
      mockMongoModels.User.findOne.mockResolvedValue({ _id: "user123" });
      mockMongoModels.Classroom.findOne.mockResolvedValueOnce(null);
      const result = await student.transfer({
        presentClassId: "123",
        newClassId: "456",
        email: "test@example.com",
      });
      expect(result).toEqual({
        error: "present class room not found",
        code: 404,
      });
    });

    it("should return error if new class is not found", async () => {
      mockValidators.Student.transfer.mockResolvedValue(null);
      mockMongoModels.User.findOne.mockResolvedValue({ _id: "user123" });
      mockMongoModels.Classroom.findOne
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce(null);
      const result = await student.transfer({
        presentClassId: "123",
        newClassId: "456",
        email: "test@example.com",
      });
      expect(result).toEqual({ error: "new class room not found", code: 404 });
    });

    it("should return error if user is not enrolled in presentClassId", async () => {
      mockValidators.Student.transfer.mockResolvedValue(null);
      mockMongoModels.User.findOne.mockResolvedValue({ _id: "user123" });
      mockMongoModels.Classroom.findOne.mockResolvedValue({});
      mockMongoModels.ClassUserMapping.findOne.mockResolvedValueOnce(null);
      const result = await student.transfer({
        presentClassId: "123",
        newClassId: "456",
        email: "test@example.com",
      });
      expect(result).toEqual({
        error: "Enrollment not found in presentClassId",
        code: 409,
      });
    });
  });
});
