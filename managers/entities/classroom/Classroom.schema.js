const { model } = require("mongoose");
const { label } = require("../../_common/schema.models");

module.exports = {
  createClassroom: [
    {
      model: "name",
      required: true,
    },
    {
      model: "shortDesc",
      required: false,
    },
    {
      model: "capacity",
      required: true,
    },
    {
      model: "id",
      path: "schoolId",
      label: "School ID",
      required: true,
    },
  ],
  updateClassroom: [
    {
      model: "id",
      path: "classroomId",
      label: "Classroom ID",
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
      model: "capacity",
      required: false,
    },
    {
      model: "bool",
      path: "active",
      required: false,
    },
  ],
  addStudent: [
    {
      model: "id",
      path: "classId",
      label: "Class ID",
      required: true,
    },
    {
      model: "email",
      required: true,
    },
  ],
};
