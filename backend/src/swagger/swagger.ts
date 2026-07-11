import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "../config/config";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Audit Management System API",
    version: "1.0.0",
    description:
      "RESTful API for managing audits, non-conformities, and compliance",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.server.port}/api`,
      description: "Development server",
    },
    {
      url: "https://api.example.com/api",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    "./src/modules/**/*.routes.ts",
    "./src/modules/**/*.controller.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Audit Management API Docs",
    })
  );
};
