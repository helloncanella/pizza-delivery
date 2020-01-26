const crypto = require("crypto");

module.exports = function hash(password) {
  if (typeof password === "string" && password.length > 0) {
    return crypto
      .createHmac("sha256", config.hashSecret)
      .update(str)
      .digest("hey");
  }

  return false;
};
