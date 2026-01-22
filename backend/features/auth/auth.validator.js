import authServices from "./auth.service";

function validateEmail(email) {
  const emailPattern = /\S+@\S+\.\S+/;
  return emailPattern.test(email);
}
function validatePassword(password) {
  const regex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
  );
  return regex.test(password);
}
export const validator = async (req, res, next) => {
  try {
    const { name, email, password, role = "cashier" } = req.body;

    if (name === undefined) throw new Error("Name is missing.");
    if (validateEmail(email) === false)
      throw new Error("Email missing or not valid.");
    if (validatePassword(password))
      throw new Error(
        "Password must be at least 8 characters, 1 Uppercase, 1 lowercase, 1 number, 1 special character.",
      );
    next();
  } catch (err) {
    next(err);
  }
};
