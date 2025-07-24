import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Add this
  const [project, setProject] = useState({
    projectName: "",
    description: "",
    liveLink: "",
    githubLink: "",
    imageUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await res.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("projectName", project.projectName);
    formData.append("description", project.description);
    formData.append("liveLink", project.liveLink);
    formData.append("githubLink", project.githubLink);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        alert("Project updated successfully");
        navigate("/my-projects");
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Edit Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Project Name"
          value={project.projectName}
          onChange={(e) =>
            setProject({ ...project, projectName: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          className="w-full border p-2 rounded"
          required
        ></textarea>

        <input
          type="url"
          placeholder="Live Link"
          value={project.liveLink}
          onChange={(e) => setProject({ ...project, liveLink: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="url"
          placeholder="GitHub Link"
          value={project.githubLink}
          onChange={(e) =>
            setProject({ ...project, githubLink: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
          className="block"
        />

        {/* Preview new image if selected */}
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="w-32 h-32 object-cover mt-2 rounded"
          />
        )}

        {/* Existing image preview */}
        {!selectedImage && project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.projectName}
            className="w-32 h-32 object-cover mt-2 rounded"
          />
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Project
        </button>
      </form>
    </div>
  );
}

export default EditProject;
