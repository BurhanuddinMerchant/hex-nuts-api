//setting up express
const express = require("express");

//start up instance of express
const app = new express();

//set up the port
const port = process.env.PORT || 3000;

//used to pares the json object in req.body
app.use(express.json());

//import Enterprise router
const EnterpriseRouter = require("./routers/Enterprise");

//import Hexnut router
const HexNutRouter = require("./routers/HexNuts");

//use the enterprise router with express
app.use(EnterpriseRouter);

//use the Hexnut router
app.use(HexNutRouter);

//lisetn to the port wherever the server is set
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
