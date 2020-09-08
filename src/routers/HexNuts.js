const express = require("express");

const router = new express.Router();

//import the HexNuts model
const HexNut = require("../models/HexNuts");

//include the enterprise model
const Enterprise = require("../models/Enterprise");

//loading in the auth middleware
const auth = require("../middleware/authentication");

//add the multer library for file upload
const multer = require("multer");

//setting up rules to upload an image using multer
const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});
//sending hexnut image
router.post(
  "/hexnut/image/:id",
  auth,
  //middleware to upload image
  upload.single("image"),
  async (req, res) => {
    _id = req.params.id;
    owner = req.enterprise._id;
    try {
      const hexnut = await HexNut.findOne({ _id, owner });
      if (!hexnut) {
        return res.status(404).send();
      }
      hexnut.image = req.file.buffer;
      await hexnut.save();
    } catch (e) {
      res.status(404).send();
    }
    res.send();
  },
  //handling any errors
  (e, req, res, next) => {
    res.status(400).send({ error: e.message });
  }
);
//setting up the post request
router.post(
  "/hexnut",
  //middleware to authenticate
  auth,
  async (req, res) => {
    const hexnut = new HexNut({
      ...req.body,
      owner: req.enterprise._id,
    });
    try {
      await hexnut.save();
      res.status(201).send(hexnut);
    } catch (e) {
      res.status(400).send();
    }
  }
);

//setting up the retreival endpoint
router.get("/hexnut/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const hexnut = await HexNut.findOne({ _id, owner: req.enterprise._id });
    if (!hexnut) {
      return res.status(404).send("Invalid ID");
    }
    res.status(200).send(hexnut);
  } catch (e) {
    res.status(404).send();
  }
});

//get all the possible products from the database
router.get("/hexnuts", auth, async (req, res) => {
  //set up the match object and matches the searches to the query values
  const match = {};
  const sort = {};
  if (req.query.category) {
    match.category = req.query.category;
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    //const hexnuts = await HexNut.find({ owner: req.enterprise._id });
    await req.enterprise
      .populate({
        path: "hexnuts",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.enterprise.hexnuts);
  } catch (e) {
    res.status(404).send();
  }
});

//get all the hexnuts of a particular industry by name
router.get("/hexnuts/:industry", auth, async (req, res) => {
  name = req.params.industry;
  //console.log(req.body);
  try {
    const enterprise = await Enterprise.findOne({ name: name });
    console.log(enterprise);
    await enterprise.populate("hexnuts").execPopulate();
    res.send(enterprise.hexnuts);
  } catch (e) {
    res.status(404).send();
  }
});

//update endpoint
router.patch("/hexnut/:id", auth, async (req, res) => {
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
      owner: req.enterprise._id,
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
    res.send(hexnuts);
  } catch (e) {
    res.status(400).send();
  }
});

//delete endpoint
//delete one product
router.delete("/hexnut/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const hexnut = await HexNut.findOneAndDelete({
      _id,
      owner: req.enterprise._id,
    });
    if (!hexnut) {
      res.status(404).send();
    }
    res.send(hexnut);
  } catch (e) {
    res.status(400).send(e);
  }
});

//route to delete hexnut image
router.delete("/hexnut/image/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const hexnut = await HexNut.findOne({ _id, owner: req.enterprise._id });
    hexnut.image = undefined;
    await hexnut.save();
    res.send();
  } catch (e) {
    res.status(400).send();
  }
});
module.exports = router;
