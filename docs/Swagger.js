const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("../config/index.config");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "School Management",
      version: "1.0.0",
      description: "API documentation for School Management",
    },
    servers: [
      {
        url: `http://localhost:${config.dotEnv.USER_PORT}`,
        description: "School Management",
      },
    ],
  },
  apis: ["./docs/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
