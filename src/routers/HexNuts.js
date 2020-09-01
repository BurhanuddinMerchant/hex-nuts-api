const express = require("express");

const router = new express.Router();

//import the HexNuts model
const HexNut = require("../models/HexNuts");

//setting up the post request
router.post("/hexnut", async (req, res) => {
  console.log(req.body);
  const hexnut = new HexNut(req.body);
  console.log(hexnut);
  try {
    await hexnut.save();
    res.status(201).send(hexnut);
  } catch (e) {
    res.status(400).send();
  }
});

//setting up the retreival endpoint
router.get("/hexnut/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  try {
    const hexnut = await HexNut.findOne({ _id });
    if (!hexnut) {
      return res.status(404).send("Invalid ID");
    }
    res.status(200).send(hexnut);
  } catch (e) {
    res.status(404).send();
  }
});

//get all the possible products from the database
router.get("/hexnuts", async (req, res) => {
  try {
    const hexnuts = await HexNut.find({});
    if (!hexnuts) {
      res.status(404).send("Not found");
    }
    res.send(hexnuts);
  } catch (e) {
    res.status(404).send();
  }
});

//update endpoint
router.patch("/hexnut/:id", async (req, res) => {
  const updateableFields = [
    "pricePerKgInRupees",
    "sizeInInches",
    "diameterInInches",
    "threadPitchInMM",
  ];
  const requiredUpdates = Object.keys(req.body);
  const isValidUpdate = requiredUpdates.every((update) =>
    updateableFields.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    const hexnut = await HexNut.findOne({
      _id: req.params.id,
    });
    if (!hexnut) {
      return res.status(404).send("Invalid Product");
    }
    requiredUpdates.forEach((update) => (hexnut[update] = req.body[update]));
    await hexnut.save();
    res.status(200).send(hexnut);
  } catch (e) {
    res.status(400).send();
  }
});

//delete endpoint
//deletes all products
router.delete("/hexnuts", async (req, res) => {
  try {
    const hexnuts = await HexNut.deleteMany({});
    console.log(hexnuts);
    res.send(hexnuts);
  } catch (e) {
    res.status(400).send();
  }
});

//delete endpoint
//delete one product
router.delete("/hexnut/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const hexnut = await HexNut.deleteOne({ _id });
    res.send(hexnut);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
