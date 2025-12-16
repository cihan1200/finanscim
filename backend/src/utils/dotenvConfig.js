import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function dotenvConfig() {
  dotenv.config({
    path: path.resolve(__dirname, "../../.env")
  });
}

