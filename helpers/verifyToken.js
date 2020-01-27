const crud = require("../lib/crud");

module.exports = function verifyToken(token, email, callback) {
  return crud.read("token", token, (err, tokenData) => {
    if (err || !tokenData) return callback(false);

    return crud.read("user", email, (err, userData) => {
      if (err || !userData) return callback(false);

      const sameUserID = tokenData.userID === userData.id;
      const tokenExpired = Date.now() > tokenData.expires;

      const tokenIsValid = !tokenExpired && sameUserID;

      return callback(tokenIsValid);
    });
  });
};
