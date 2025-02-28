module.exports = ({ meta, config, mongomodels, managers }) => {
  return ({ req, res, next }) => {
    if (!req.decoded || !req.decoded._id) {
      console.log("user id required but not found");
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }
    // let permissios = mongoModels.User.aggregate()
    next();
  };
};
