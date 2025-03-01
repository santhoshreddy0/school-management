const { isNull } = require("lodash");
const { hashPassword } = require("../../libs/utils");
const mongoose = require("mongoose");

module.exports = class School {
  constructor({ config, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "schools";
    this.httpExposed = [
      "post=createSchool",
      "put=updateSchool",
      "post=addAdmin",
      "get=getSchools",
    ];
    this.managers = managers;
  }
  async createSchool({ name, desc, __shortToken, __rolePermissions }) {
    try {
      // validate the school
      const schoolDetails = {
        name,
        desc,
      };
      const result = await this.validators.school.createSchool(schoolDetails);
      if (result) {
        return {
          errors: result,
          code: 422,
        };
      }
      // check for existing school
      const existingSchool = await this.mongomodels.School.findOne({ name });
      if (existingSchool) {
        return {
          error: "School already exists",
          code: 422,
        };
      }
      // create the school
      const school = {
        name,
        description: desc,
      };
      const createdSchool = await this.mongomodels.School.insertOne(school);

      // return response
      return {
        school: {
          name: createdSchool.name,
          description: createdSchool.description,
          id: createdSchool._id,
          active: createdSchool.active,
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
  async updateSchool({
    id,
    name,
    desc,
    active,
    __shortToken,
    __rolePermissions,
  }) {
    try {
      // validate the school
      const schoolDetails = {
        id,
        name,
        desc,
        active,
      };
      console.log("schoolDetails", schoolDetails);

      const result = await this.validators.school.updateSchool(schoolDetails);
      if (result) {
        return {
          errors: result,
          code: 422,
        };
      }
      // check for existing school
      const existingSchool = await this.mongomodels.School.findOne({ _id: id });
      if (!existingSchool) {
        return {
          error: "School does not exist",
          code: 422,
        };
      }
      existingSchool.name = name || existingSchool.name;
      existingSchool.description = desc || existingSchool.description;
      existingSchool.active = isNull(active) ? existingSchool.active : active;
      const updatedSchool = await existingSchool.save();
      // return response
      return {
        school: {
          name: existingSchool.name,
          description: existingSchool.description,
          id: existingSchool._id,
          active: existingSchool.active,
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
  async addAdmin({
    schoolId,
    name,
    email,
    password,
    __shortToken,
    __rolePermissions,
  }) {
    try {
      // validate the admin
      const adminDetails = {
        schoolId,
        name,
        email,
        password,
      };
      const result = await this.validators.school.addAdmin(adminDetails);
      if (result) {
        return {
          errors: result,
          code: 422,
        };
      }
      //   check form existing school
      const existingSchool = await this.mongomodels.School.findOne({
        _id: schoolId,
      });
      if (!existingSchool) {
        return {
          error: "School does not exist",
          code: 422,
        };
      }

      // check for existing admin
      const existingAdmin = await this.mongomodels.User.findOne({ email });
      if (existingAdmin) {
        return {
          error: "user already exists with this email use another email",
          code: 422,
        };
      }

      let adminRole = await this.mongomodels.Role.findOne({
        name: "admin",
      });

      if (!adminRole) {
        console.error("Unable to find the admin role");
        throw new Error();
      }
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const admin = {
          name,
          email,
          password: await hashPassword(password),
          role: adminRole._id,
        };
        const createdAdmin = await this.mongomodels.User.insertOne(admin, {
          session,
        });
        const adminSchoolMapping =
          await this.mongomodels.SchoolAdminMapping.insertOne(
            {
              school_id: schoolId,
              user_id: createdAdmin._id,
            },
            { session }
          );

        await session.commitTransaction();

        // return response
        return {
          admin: {
            school: {
              id: adminSchoolMapping.school_id,
              name: existingSchool.name,
            },
            name: createdAdmin.name,
            email: createdAdmin.email,
          },
        };
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
      // create the admin
    } catch (error) {
      return {
        error: "Something went wrong",
        code: 500,
      };
    }
  }

  async getSchools({ query, __shortToken, __rolePermissions }) {
    try {
      let { page, limit } = query;

      page = parseInt(page) || 1;
      limit = parseInt(limit) || this.config.dotEnv.DEFAULT_PAGE_LIMIT;
      const skip = (page - 1) * limit;

      const schools = await this.mongomodels.School.find()
        .skip(skip)
        .limit(limit);
      const total = await this.mongomodels.School.countDocuments();

      return {
        schools,
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
