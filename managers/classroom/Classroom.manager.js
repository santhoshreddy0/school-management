const e = require("express");
const { isNull } = require("lodash");
const mongoose = require("mongoose");

module.exports = class Classroom {
  constructor({ config, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.httpExposed = [
      "post=createClassroom",
      "put=updateClassroom",
      "get=getClassrooms",
    ];
    this.managers = managers;
  }
  async createClassroom({
    schoolId,
    name,
    desc,
    capacity,
    __shortToken,
    __rolePermissions,
  }) {
    try {
      // validate the school
      const classroomDetails = {
        capacity,
        schoolId,
        name,
        desc,
      };
      const result = await this.validators.Classroom.createClassroom(
        classroomDetails
      );
      if (result) {
        return {
          errors: result,
          code: 422,
        };
      }
      // check for existing school
      const existingClassroom = await this.mongomodels.Classroom.findOne({
        name,
        school_id: schoolId,
      });
      if (existingClassroom) {
        return {
          error: "Classroom already exists",
          code: 422,
        };
      }
      // create the class
      const classroom = {
        school_id: schoolId,
        name: classroomDetails.name,
        description: classroomDetails.desc,
        capacity: classroomDetails.capacity,
      };
      const createdClassroom = await this.mongomodels.Classroom.insertOne(
        classroom
      );

      // return response
      return {
        class: {
          name: createdClassroom.name,
          description: createdClassroom.description,
          id: createdClassroom._id,
          schoolId: createdClassroom.school_id,
          capacity: createdClassroom.capacity,
          active: createdClassroom.active,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        error: "Something went wrong",
        code: 500,
      };
    }
  }
  async updateClassroom({
    classroomId,
    name,
    desc,
    active,
    capacity,
    __shortToken,
    __rolePermissions,
  }) {
    try {
      // validate the school
      const classroomDetails = {
        classroomId,
        capacity,
        name,
        desc,
        active,
      };

      const result = await this.validators.Classroom.updateClassroom(
        classroomDetails
      );
      if (result) {
        return {
          errors: result,
          code: 422,
        };
      }
      // check for existing school
      const existingClassroom = await this.mongomodels.Classroom.findOne({
        _id: classroomId,
      });
      if (!existingClassroom) {
        return {
          error: "Classroom does not exist",
          code: 422,
        };
      }
      if (capacity < existingClassroom.capacity) {
        return {
          error: "Capacity cannot be decreased",
          code: 422,
        };
      }
      existingClassroom.name = name || existingClassroom.name;
      existingClassroom.description = desc || existingClassroom.description;
      existingClassroom.active = isNull(active)
        ? existingClassroom.active
        : active;
      existingClassroom.capacity = capacity || existingClassroom.capacity;

      const updatedClassroom = await existingClassroom.save();
      // return response
      return {
        classroom: {
          name: updatedClassroom.name,
          description: updatedClassroom.description || "",
          id: updatedClassroom._id,
          schoolId: updatedClassroom.school_id,
          active: updatedClassroom.active,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        error: "Something went wrong",
        code: 500,
      };
    }
  }

  async getClassrooms({ query, __shortToken, __rolePermissions }) {
    try {
      let { page, limit } = query;

      page = parseInt(page) || 1;
      limit = parseInt(limit) || this.config.dotEnv.DEFAULT_PAGE_LIMIT;

      const skip = (page - 1) * limit;

      const classrooms = await this.mongomodels.Classroom.find()
        .skip(skip)
        .limit(limit);
      const total = await this.mongomodels.Classroom.countDocuments();

      return {
        classrooms,
        totalPages: Math.ceil(total / limit),
        page,
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
