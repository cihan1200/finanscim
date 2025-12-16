import jwt from "jsonwebtoken";
import dotenvConfig from "./dotenvConfig.js";

dotenvConfig();

export default function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};