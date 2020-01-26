const validate = require("../helpers/validate");
const hash = require("../helpers/hash");
const randomString = require("../helpers/randomString");
const crud = require("../lib/crud");

module.exports = {
  notFound(__, callback) {
    callback(404);
  },
  signup({ method, payload = {} } = {}, callback) {
    if (method !== "post") callback(500, { Error: "method not available" });

    const { name, email, address, password } = payload;
    const error = validate({ name, email, address, password });

    if (error) {
      return callback(500, { Error: error });
    }

    crud.read("user", email, (err, data) => {
      if (data && !err) {
        const error = "The email " + email + " is already used";
        return callback(500, { Error: error });
      }

      const user = {
        id: randomString(20),
        name,
        email,
        address,
        hashedPassword: hash(password)
      };

      crud.create("user", user.email, user, err => {
        if (err) return callback(500, { Error: err });
        callback(200, user);
      });
    });
  },

  login({ payload }, callback) {},
  logout() {},
  "edit-user": function editUser({ id }, callback) {},
  "delete-user": function deleteUser({ id }, callback) {}
};
