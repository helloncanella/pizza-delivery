const isEmail = require("./isEmail");

module.exports = function validate(object = {}) {
  const errorMessage = Object.entries(object)
    .map(([key, value]) => {
      return typeof validators[key] === "function" && validators[key](value);
    })
    .filter(Boolean)
    .map((e, index) => ((index > 0 && "; ") || "") + e)
    .join("");

  return errorMessage;
};

const validators = {
  order(value) {
    if (
      !Array.isArray(value) ||
      value.some(i => !i.id || !i.quantity || typeof i.quantity !== "number")
    ) {
      return `Your order should be an array with the "id" and "quantity" (a number) of each product`;
    }
  },
  email(value) {
    if (!isEmail(value)) return "invalid email";
  },
  password(value = "") {
    const min = 6;

    if (typeof value !== "string" || (value || "").length < min)
      return "password should have at least " + min + " digits.";
  },
  name(value) {
    if (typeof value !== "string") return "name should be a string";
  },
  address(value) {
    if (typeof value !== "string") return "address should be a string";
  }
};
