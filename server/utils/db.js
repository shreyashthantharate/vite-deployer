import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((err) => {
      console.log("Error connecting to mongodb", err.message);
    });
};

export default db;
