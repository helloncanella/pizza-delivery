const fs = require("fs");
const path = require("path");
const parseJSON = require("../helpers/parseJSON");

const base = path.join(__dirname, "../.data");

const crud = {
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
  },

  delete(dir, file, callback) {
    const pathname = path.join(base, dir, file + ".json");
    fs.unlink(pathname, callback);
  },

  update(dir, file, dataUpdate, newFileName, callback) {
    const pathname = getPathname({ dir, file });
    const newPathName = newFileName
      ? getPathname({ dir, file: newFileName })
      : false;

    crud.read(dir, file, (err, data) => {
      if (err) return callback("Problems to update");

      const newData = Object.assign(data, dataUpdate);

      fs.writeFile(pathname, JSON.stringify(newData), err => {
        if (err) return callback("Problems to update");

        const callCallback = err => callback(err, newData);

        if (newPathName) {
          return fs.rename(pathname, newPathName, callCallback);
        }

        return callCallback();
      });
    });
  }
};

function getPathname({ dir, file }) {
  return path.join(base, dir, file + ".json");
}

module.exports = crud;
