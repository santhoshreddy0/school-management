const bcrypt = require("bcrypt");
const { is } = require("useragent");

module.exports = class User {
  constructor({ config, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "users";
    this.httpExposed = ["post=createUser", "loginUser", "updateProfile"];
    this.managers = managers;
  }

  async createUser({ name, email, password }) {
    try {
      // validate the user
      let user = { name, email, password };
      let result = await this.validators.user.createUser(user);
      if (result)
        return {
          errors: result,
          code: 422,
        };

      // create the user

      // check for existing email
      const existingUser = await this.mongomodels.User.findOne({ email });
      if (existingUser) {
        return {
          error: "User already exists",
          code: 422,
        };
      }
      let defaultRole = await this.mongomodels.Role.findOne({
        name: "student",
      });
      console.log("default role ", defaultRole);

      if (!defaultRole) {
        console.error("Unable to find the default role");
        throw new Error();
      }
      const hashedPassword = await this.hashPassword(user.password);

      user = { ...user, password: hashedPassword, role: defaultRole._id };

      let createdUser = await this.mongomodels.User.insertOne(user);

      let longToken = this.tokenManager.genLongToken({
        userId: createdUser._id,
        userKey: createdUser.key,
      });

      // Response
      return {
        user: {
          name: createdUser.User,
          email: createdUser.email,
        },
        longToken,
      };
    } catch (error) {
      console.error("error creating user", error);

      return {
        error: "Something went wrong!",
        code: 500,
      };
    }
  }

  async loginUser({ email, password }) {
    try {
      // validate the user
      let user = { email, password };
      let result = await this.validators.user.loginUser(user);
      if (result)
        return {
          errors: result,
          code: 422,
        };

      // check for existing email
      const existingUser = await this.mongomodels.User.findOne({
        email,
        isActive: true,
      });
      if (!existingUser) {
        return {
          error: "User does not exist",
          code: 422,
        };
      }

      // check for password
      const isPasswordCorrect = await bcrypt.compare(
        user.password,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        return {
          error: "Invalid password",
          code: 422,
        };
      }

      let longToken = this.tokenManager.genLongToken({
        userId: existingUser._id,
        userKey: existingUser.key,
      });

      // Response
      return {
        user: {
          name: existingUser.name,
          email: existingUser.email,
        },
        longToken,
      };
    } catch (error) {
      console.error("error logging in user", error);

      return {
        error: "Something went wrong!",
        code: 500,
      };
    }
  }

  async updateProfile({ name, password, __shortToken, __rolePermissions }) {
    try {
      // validate the user
      let user = { name, password };
      let result = await this.validators.user.updateProfile(user);
      if (result)
        return {
          errors: result,
          code: 422,
        };
      const decoded = __shortToken;

      const existingUser = await this.mongomodels.User.findOne({
        _id: decoded.userId,
      });
      if (!existingUser) {
        return {
          error: "User does not exist",
          code: 422,
        };
      }
      existingUser.name = name || existingUser.name;
      let hashedPassword = password
        ? await this.hashPassword(password)
        : existingUser.password;
      existingUser.password = hashedPassword;
      const updatedUser = await existingUser.save();
      return {
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
    } catch (error) {
      console.error("error updating user", error);

      return {
        error: "Something went wrong!",
        code: 500,
      };
    }
  }

  async hashPassword(password) {
    const saltRounds = 5; // The cost factor (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
};
