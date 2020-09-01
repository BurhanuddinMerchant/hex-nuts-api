//import express
const express = require("express");

//set up the express router
const router = new express.Router();

//include the enterprise model
const Enterprise = require("../models/Enterprise");

//setting up a new enterprise
router.post("/enterprise", async (req, res) => {
  const enterprise = new Enterprise(req.body);
  try {
    await enterprise.save();
    res.status(201).send(enterprise);
  } catch (e) {
    res.status(400).send();
  }
});

//fetch an enterprise by id
router.get("/enterprise/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(req.body);
  try {
    const enterprise = await Enterprise.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(enterprise);
    res.send(enterprise);
  } catch (e) {
    res.status(404).send();
  }
});
//fetch all enterprises
router.get("/enterprise", async (req, res) => {
  try {
    const enterprise = await Enterprise.find();
    res.send(enterprise);
  } catch (e) {
    res.status(404).send();
  }
});

//update enterprise using id
router.patch("/enterprise/:id", async (req, res) => {
  const _id = req.params.id;
  const allowedUpdates = ["name", "location"];
  const queryUpdates = Object.keys(req.body);
  const isValidUpdate = queryUpdates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(404).send("Invalid Update");
  }
  try {
    const enterprise = await Enterprise.findById(_id);
    if (!enterprise) {
      res.status(404).send("Invalid Enterprise");
    }
    queryUpdates.forEach((update) => (enterprise[update] = req.body[update]));
    await enterprise.save();
    res.send(enterprise);
  } catch (e) {
    res.status(404).send();
  }
});

//delete enterprise by id
router.delete("/enterprise/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const enterprise = await Enterprise.findByIdAndDelete(_id);
    res.send(enterprise);
  } catch (e) {
    res.status(404).send();
  }
});

//delete all enterprises
router.delete("/enterprise", async (req, res) => {
  try {
    const enterprises = await Enterprise.deleteMany();
    res.send(enterprises);
  } catch (e) {
    res.status(404).send();
  }
});
module.exports = router;
