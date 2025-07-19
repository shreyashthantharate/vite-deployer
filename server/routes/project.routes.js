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

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
