const mongoose = require("mongoose");

module.exports = ({ meta, config, mongomodels, managers }) => {
  return async ({ req, res, next }) => {
    if (!req.decodedToken || !req.decodedToken.userId) {
      console.log("user id required but not found");
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }
    const userId = req.decodedToken.userId;

    let permissionDetails = await mongomodels.User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "rolepermissionmappings",
          localField: "role",
          foreignField: "role_id",
          as: "role_permissions",
        },
      },
      {
        $unwind: "$role_permissions",
      },
      {
        $lookup: {
          from: "permissions",
          localField: "role_permissions.permission_id",
          foreignField: "_id",
          as: "permission_details",
        },
      },
      {
        $unwind: "$permission_details",
      },
      {
        $group: {
          _id: "$_id",
          permissions: { $push: "$permission_details.name" },
        },
      },
    ]);

    const permissions = permissionDetails[0].permissions.map((permission) =>
      permission.toLowerCase()
    );

    const routeIdentifier =
      req.params?.moduleName?.toLowerCase() +
      ":" +
      req.params?.fnName?.toLowerCase();

    if (!permissions.includes(routeIdentifier)) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }

    next();
  };
};
