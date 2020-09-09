//import the mongoose module
const mongoose = require("mongoose");

//importing validator
const validator = require("validator");
const Enterprise = require("./Enterprise");

//connecting mongoose to the database/creating db
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const hexNutSchema = new mongoose.Schema(
  {
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
    category: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      //establish relationship between the hexnut model and the enterprise model
      ref: "Enterprise",
    },
    image: {
      type: Buffer,
    },
    // ownerName: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);
const HexNut = mongoose.model("HexNut", hexNutSchema);

module.exports = HexNut;
