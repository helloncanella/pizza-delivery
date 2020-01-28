const validate = require("../helpers/validate");
const hash = require("../helpers/hash");
const randomString = require("../helpers/randomString");
const verifyToken = require("../helpers/verifyToken");
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

  login({ payload, method }, callback) {
    if (method !== "post")
      return callback(500, {
        Error: `Method ${method.toUpperCase()} not available`
      });

    const { email, password } = payload;
    const error = validate({ email, password });
    if (error) return callback(500, { Error: error });

    crud.read("user", email, (err, userData) => {
      if (err) return callback(500, { Error: err });

      if (userData) {
        const passwordIsCorrect = userData.hashedPassword === hash(password);

        if (passwordIsCorrect) {
          const tokenData = {
            id: randomString(30),
            userID: userData.id,
            expires: Date.now() + 1000 * 60 * 60
          };

          return crud.create("token", tokenData.id, tokenData, err => {
            if (err) return callback(500, { Error: err });
            callback(200, { token: tokenData.id });
          });
        }

        return callback(401, { Error: "Email or password incorrect" });
      }

      return callback(401, { Error: "Email or password incorrect" });
    });
  },
  logout({ payload, method }, callback) {
    if (method !== "post")
      return callback(500, {
        Error: `Method ${method.toUpperCase()} not available`
      });

    const { email, token } = payload;

    const error = validate({ email });
    if (error) return callback(500, { Error: error });

    verifyToken(token, email, tokenIsValid => {
      if (!tokenIsValid)
        return callback(401, { Error: "Email or token invalid" });

      return crud.delete("token", token, err => {
        if (err) return callback(500, { Error: "Problem to logout" });
        callback(200);
      });
    });
    //  return crud.delete("token", pal)
  },
  "edit-user": function editUser({ payload, method }, callback) {
    if (["update", "post"].indexOf(method) === -1)
      return callback(500, {
        Error: `Method ${method.toUpperCase()} not available`
      });

    const { email, token, update } = payload;

    const error = validate(update);
    if (error) return callback(500, { Error: error });

    verifyToken(token, email, tokenIsValid => {
      if (!tokenIsValid)
        return callback(401, { Error: "Email or token invalid" });

      return crud.update("user", email, update, (err, newData) => {
        if (err) return callback(500, { Error: "Problem to logout" });
        callback(200, newData);
      });
    });
  },
  "delete-user": function deleteUser({ id }, callback) {}
};
