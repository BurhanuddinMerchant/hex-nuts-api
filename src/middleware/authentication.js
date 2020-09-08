const jwt = require("jsonwebtoken");
const Enterprise = require("../models/Enterprise");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismyproductbase");
    const enterprise = await Enterprise.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!enterprise) {
      throw new Error();
    }
    req.token = token;
    req.enterprise = enterprise;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate! " });
  }
};

module.exports = auth;
