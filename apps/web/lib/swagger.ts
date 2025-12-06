import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hirvn API',
      version: '1.0.0',
      description: 'API documentation for the Hirvn freelance marketplace.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./app/api/**/*.ts'], // files containing annotations as above
};

export const swaggerSpec = swaggerJSDoc(options);
