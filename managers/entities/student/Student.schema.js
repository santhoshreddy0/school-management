module.exports = {
  enroll: [
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
  transfer: [
    {
      model: "id",
      path: "presentClassId",
      label: "presentClassId",
      required: true,
    },
    {
      model: "id",
      path: "newClassId",
      label: "newClassId",
      required: true,
    },
    {
      model: "email",
      required: true,
    },
  ],
};
