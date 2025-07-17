import express from "express";
import Project from "../model/Project.model.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { name, html, css, js } = req.body;
  try {
    const project = new Project({
      user: req.user.id,
      name,
      html,
      css,
      js,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;
