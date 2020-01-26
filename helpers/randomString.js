module.exports = function randomString(length) {
  length = typeof length == "number" && length > 0 ? length : false;

  if (length) {
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    var str = "";

    for (i = 1; i <= strLength; i++) {
      var randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      str += randomChar;
    }

    return str;
  } else {
    return false;
  }
};
