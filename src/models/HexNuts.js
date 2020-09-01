//import the mongoose module
const mongoose = require("mongoose");

//importing validator
const validator = require("validator");

//connecting mongoose to the database/creating db
mongoose.connect("mongodb://127.0.0.1:27017/hex-nut-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const hexNutSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  pricePerKgInRupees: {
    type: Number,
  },
  pricePerPieceInRupees: {
    type: Number,
  },
  materialGrade: {
    type: String,
  },
  usage: {
    type: String,
  },
  sizeInInches: {
    type: Number,
  },
  diameterInInches: {
    type: Number,
  },
  surfaceFinishing: {
    type: String,
  },
  material: {
    type: String,
  },
  threadPitchInMM: {
    type: Number,
  },
  headShape: {
    type: String,
  },
  hardnessInHRC: {
    type: Number,
  },
});
const HexNut = mongoose.model("HexNut", hexNutSchema);

module.exports = HexNut;
