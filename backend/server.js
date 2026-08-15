import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("API is runing");
});

connectDB();

app.listen(PORT, () => {
  console.log(`app is runing on http://localhost:${PORT}`);
});
