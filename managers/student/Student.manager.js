const { isNull } = require("lodash");
const { hashPassword } = require("../../libs/utils");
const mongoose = require("mongoose");

module.exports = class Student {
  constructor({ config, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "schools";
    this.httpExposed = ["post=enroll", "put=transfer"];
    this.managers = managers;
  }

  async enroll({ classId, email, __shortToken, __rolePermissions }) {
    try {
      // validate the admin
      const studentDetails = {
        classId,
        email,
      };

      const result = await this.validators.Student.enroll(studentDetails);
      if (result) {
        return {
          errors: result,
          code: 422,
        };
      }
      const existingUser = await this.mongomodels.User.findOne({
        email,
      });
      if (!existingUser) {
        return {
          error: "User does not exists",
          code: 404,
        };
      }
      let enrollmentDetails = {
        class_id: classId,
        user_id: existingUser._id,
      };
      const classroomDetails = await this.mongomodels.Classroom.findOne({
        _id: classId,
      });
      if (!classroomDetails) {
        return {
          error: "classroom not found",
          code: 404,
        };
      }
      let existingEnrollment = await this.mongomodels.ClassUserMapping.findOne({
        class_id: classId,
        user_id: existingUser._id,
      });
      if (existingEnrollment) {
        return {
          error: "Already enrolled to the class",
          code: 409,
        };
      }

      enrollmentDetails = await this.mongomodels.ClassUserMapping.insertOne(
        enrollmentDetails
      );
      return {
        enrollmentDetails: {
          classId: enrollmentDetails.class_id,
          email: studentDetails.email,
          user_id: enrollmentDetails.user_id,
        },
      };
      // create the admin
    } catch (error) {
      console.error("error", error);
      return {
        error: "Something went wrong",
        code: 500,
      };
    }
  }
  async transfer({
    presentClassId,
    newClassId,
    email,
    __shortToken,
    __rolePermissions,
  }) {
    // validate
    // check enrollment in new
    // check old enrollment
    // enroll
    //response

    try {
      const payload = {
        presentClassId,
        newClassId,
        email,
      };
      const result = await this.validators.Student.transfer(payload);
      if (result) {
        return {
          errors: result,
          code: 422,
        };
      }
      if (presentClassId == newClassId) {
        return {
          error: "presentClassId and newClassId are same",
          code: 422,
        };
      }

      const existingUser = await this.mongomodels.User.findOne({
        email,
      });
      if (!existingUser) {
        return {
          error: "User does not exists",
          code: 404,
        };
      }
      const presentClassroomDetails = await this.mongomodels.Classroom.findOne({
        _id: presentClassId,
      });
      if (!presentClassroomDetails) {
        return {
          error: "present class room not found",
          code: 404,
        };
      }

      const newClassroomDetails = await this.mongomodels.Classroom.findOne({
        _id: newClassId,
      });
      if (!newClassroomDetails) {
        return {
          error: "new class room not found",
          code: 404,
        };
      }

      let enrollmentDetails = {
        class_id: presentClassId,
        user_id: existingUser._id,
      };
      let existingEnrollment = await this.mongomodels.ClassUserMapping.findOne(
        enrollmentDetails
      );
      if (!existingEnrollment) {
        return {
          error: "Enrollment not found in presentClassId",
          code: 409,
        };
      }

      enrollmentDetails = {
        class_id: newClassId,
        user_id: existingUser._id,
      };
      enrollmentDetails = await this.mongomodels.ClassUserMapping.findOne(
        enrollmentDetails
      );
      if (enrollmentDetails) {
        return {
          error: "Enrollment already found in newClassId",
          code: 409,
        };
      }
      existingEnrollment.class_id = newClassId;
      enrollmentDetails = await existingEnrollment.save();

      return {
        id: existingEnrollment._id,
        classId: existingEnrollment.class_id,
      };
    } catch (error) {
      console.error(error);
      return {
        error: "Something went wrong",
        code: 500,
      };
    }
  }
};
