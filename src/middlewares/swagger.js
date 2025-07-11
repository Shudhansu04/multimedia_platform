import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Multimedia Platform API",
    version: "1.0.0",
    description: "API documentation for the multimedia platform backend",
  },
  servers: [
    {
      url: "http://localhost:8000/api/v1",  
      description: "Development Server",
    },
    {
    url: "https://multimedia-platform.onrender.com",
    description: "Production Server",
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
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],  
};

export const swaggerSpec = swaggerJSDoc(options);
