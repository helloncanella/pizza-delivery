const crypto = require("crypto");
const config = require("../config");

module.exports = function hash(password) {
  if (typeof password === "string" && password.length > 0) {
    return crypto
      .createHmac("sha256", config.hashSecret)
      .update(password)
      .digest("hex");
  }

  return false;
};
