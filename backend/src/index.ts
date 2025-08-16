import express from "express";
import cors from "cors";
import { convertToRoman } from "./utils/romanConverter.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/convert", (req, res) => {
  try {
    const { number } = req.body;

    if (
      typeof number !== "number" ||
      number < 0 ||
      number > 100 ||
      !Number.isInteger(number)
    ) {
      return res
        .status(400)
        .json({ error: "Number must be an integer between 0 and 100" });
    }

    const roman = convertToRoman(number);
    return res.json({ number, roman });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
