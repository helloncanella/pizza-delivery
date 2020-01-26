module.exports = function validate(object = {}) {
  const errorMessage = Object.entries(object)
    .map(([key, value]) => {
      return typeof validator[key] === "function" && validators[key](value);
    })
    .filter(Boolean)
    .map(e => "* " + e)
    .join("\n");

  return errorMessage;
};

const validators = {
  email(value) {
    if (!isEmail(value)) return "invalid email";
  },
  password(value) {
    const min = 6;
    if (typeof value !== "string" && password.length > min)
      return "password should have at least" + min + " digits.";
  },
  name(value) {
    if (typeof value !== "string") return "name should be a string";
  },
  address(value) {
    if (typeof value !== "string") return "address should be a string";
  }
};
