const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
mongoose.connect("mongodb://127.0.0.1:27017/hex-nut-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const EnterpriseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "N/A",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length <= 5) {
        throw new Error("Password should be atleast 6 characters");
      }
    },
  },
});

EnterpriseSchema.pre("save", async function (next) {
  const enterprise = this;
  if (enterprise.isModified("name")) {
    enterprise.password = await bcrypt.hash(enterprise.password, 8);
  }
  next();
});
EnterpriseSchema.statics.findByCredentials = async (email, password) => {
  const enterprise = await Enterprise.findOne({ email });

  if (!enterprise) {
    throw new Error("Unable to login1");
  }

  const isMatch = await bcrypt.compare(password, enterprise.password);

  if (!isMatch) {
    throw new Error("Unable to login2");
  }
  return enterprise;
};
const Enterprise = mongoose.model("Enterprise", EnterpriseSchema);
module.exports = Enterprise;
