const validate = require("../helpers/validate");
const hash = require("../helpers/hash");
const randomString = require("../helpers/randomString");

module.exports = {
  notFound(__, callback) {
    callback(404);
  },
  signup({ method, payload = {} } = {}, callback) {
    if (method !== "POST") callback(500, { Error: "method not available" });

    const { name, email, address, password } = payload;
    const error = validate({ name, email, address, password });

    if (error) {
      return callback(500, { Error: error });
    }

    const user = {
      id: randomString(20),
      name,
      email,
      address,
      hashedPassword: hash(password)
    };

    const createUser = new Promise((resolve, reject) => {
      crud.create("user", user, err => {
        if (err) return reject(err);
        resolve({ user });
      });
    });

    const createToken = new Promise((resolve, reject) => {
      const data = {
        id: randomString(20),
        userID: user.id,
        expires: Date.now() + 1000 * 60 * 60
      };

      crud.create("token", data, err => {
        if (err) return reject(err);
        resolve({ token: tokenID });
      });
    });

    return Promise.all([createUser, createToken])
      .then(([userPayload, tokenPayload]) => {
        const payload = Object.assign({}, userPayload, tokenPayload);
        callback(200, payload);
      })
      .catch(e => callback(500, { Error: e }));
  },

  login() {},
  logout() {},
  "edit-user": function editUser({ id }, callback) {},
  "delete-user": function deleteUser({ id }, callback) {}
};
