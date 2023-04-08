require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./app/routes");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

app.use(express.json());

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));
app.use("/api/v1/", router);
const port  = process.env.port;

app.listen(port, () => {
    console.log(`Server Sudah Ready di port ${port}`);
})