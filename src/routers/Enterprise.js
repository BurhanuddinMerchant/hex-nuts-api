//import express
const express = require("express");

//set up the express router
const router = new express.Router();

//include the enterprise model
const Enterprise = require("../models/Enterprise");

//import auth middleware
const auth = require("../middleware/authentication");

//setting up a new enterprise
router.post("/enterprise", async (req, res) => {
  const enterprise = new Enterprise(req.body);
  try {
    const token = await enterprise.generateAuthToken();
    await enterprise.save();
    res.status(201).send({ enterprise, token });
  } catch (e) {
    res.status(400).send();
  }
});

//fetch an enterprise by id
router.get("/enterprise/login", async (req, res) => {
  const _id = req.params.id;
  //console.log(req.body);
  try {
    const enterprise = await Enterprise.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await enterprise.generateAuthToken();
    res.send({ enterprise, token });
  } catch (e) {
    res.status(404).send();
  }
});

//logout enterpise
router.post("/enterprise/logout", auth, async (req, res) => {
  try {
    req.enterprise.tokens = req.enterprise.tokens.filter((token) => {
      token !== req.token;
    });
    await req.enterprise.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});
//log out all enterprises
router.post("/enterprise/logoutAll", auth, async (req, res) => {
  try {
    req.enterprise.tokens = [];
    await req.enterprise.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});
//log in enterprises
router.get("/enterprise/me", auth, async (req, res) => {
  res.send(req.enterprise);
});

//update enterprise using id
router.patch("/enterprise/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "location"];
  const queryUpdates = Object.keys(req.body);
  const isValidUpdate = queryUpdates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(404).send("Invalid Update");
  }
  try {
    const enterprise = req.enterprise;
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
router.delete("/enterprise/me", auth, async (req, res) => {
  try {
    //remove enterprise from mongoose document
    await req.enterprise.remove();
    res.send(req.enterprise);
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
