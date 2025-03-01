const { label } = require("../../_common/schema.models");

module.exports = {
  createSchool: [
    {
      model: "name",
      required: true,
    },
    {
      model: "shortDesc",
      required: true,
    },
  ],
  updateSchool: [
    {
      model: "id",
      required: true,
    },
    {
      model: "name",
      required: false,
    },
    {
      model: "shortDesc",
      required: false,
    },
    {
      model: "bool",
      path: "active",
      required: false,
    },
  ],
  addAdmin: [
    {
      model: "id",
      path: "schoolId",
      label: "School ID",
      required: true,
    },
    {
      model: "name",
      required: true,
    },
    {
      model: "email",
      required: true,
    },
    {
      model: "password",
      required: true,
    },
  ],
};
