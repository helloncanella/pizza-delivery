const fs = require("fs");
const path = require("path");
const parseJSON = require("../helpers/parseJSON");

const base = path.join(__dirname, "../.data");

module.exports = {
  create(dir, file, data, callback) {
    const stringData = JSON.stringify(data);
    const pathname = path.join(base, dir, file + ".json");

    fs.writeFile(pathname, stringData, err => {
      if (err) return callback(err);
      callback(false);
    });
  },

  read(dir, file, callback) {
    const pathname = path.join(base, dir, file + ".json");

    fs.readFile(pathname, { encoding: "utf-8" }, (err, data) => {
      if (err || !data) return callback(err, data);
      callback(false, parseJSON(data));
    });
  }
};
