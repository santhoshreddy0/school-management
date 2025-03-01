module.exports = {
  createUser: [
    {
      model: "email",
      required: true,
    },
    {
      model: "password",
      required: true,
    },
    {
      model: "name",
      required: true,
    },
  ],
  loginUser: [
    {
      model: "email",
      required: true,
    },
    {
      model: "password",
      required: true,
    },
  ],
  updateProfile: [
    {
      model: "name",
      required: false,
    },
    {
      model: "password",
      required: false,
    },
  ],
};
