import express from "express";
import Project from "../model/Project.model.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
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

router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, projectDescription, techStack } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { projectName, projectDescription, techStack },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
});

// router.get("/projects", authMiddleware, async (req, res) => {});
export default router;
