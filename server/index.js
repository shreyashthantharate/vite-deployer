import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// connecting to Mongo DB
db();

app.get("/api", (req, res) => {
  res.send("API is running with ES Modules 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
