import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);

// connecting to Mongo DB
db();

app.get("/api", (req, res) => {
  res.send("API is running with ES Modules 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
