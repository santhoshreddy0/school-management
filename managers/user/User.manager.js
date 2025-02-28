const bcrypt = require("bcrypt");

module.exports = class User {
  constructor({ config, managers, validators, mongomodels } = {}) {
    this.config = config;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "users";
    this.httpExposed = ["post=createUser"];
    this.managers = managers;
  }

  async createUser({ name, email, password, res }) {
    try {
      // validate the user
      let user = { name, email, password };
      let result = await this.validators.user.createUser(user);
      if (result) return result;

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
        name: "sk",
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

  async hashPassword(password) {
    const saltRounds = 5; // The cost factor (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
};
