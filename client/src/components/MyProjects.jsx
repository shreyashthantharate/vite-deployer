import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [editedTech, setEditedTech] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const token = localStorage.getItem("token"); // or however you're storing it
  if (!token) {
    console.warn("No token found in localStorage");
    return;
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data);
        console.log("Fetched data:", res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  //   useEffect(() => {
  //     setProjects([
  //       { _id: "1", name: "Test Project", description: "Just testing UI" },
  //     ]);
  //     setLoading(false);
  //   }, []);

  const handleDelete = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted project from UI
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Try again.");
    }
  };

  // const handleUpdate = async (projectId) => {
  //   try {
  //     const res = await fetch(`/api/projects/${projectId}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         projectName: editedName,
  //         projectDescription: editedDesc,
  //         techStack: editedTech,
  //       }),
  //     });

  //     if (res.ok) {
  //       const updatedProject = await res.json();
  //       // Update state locally
  //       setProjects((prev) =>
  //         prev.map((proj) => (proj._id === projectId ? updatedProject : proj))
  //       );
  //       setEditingProjectId(null); // Close edit form
  //     } else {
  //       console.error("Update failed");
  //     }
  //   } catch (error) {
  //     console.error("Error updating project:", error);
  //   }
  // };

  const handleUpdate = async (projectId) => {
    const formData = new FormData();
    formData.append("projectName", editedName);
    formData.append("projectDescription", editedDesc);
    formData.append("techStack", editedTech);

    if (selectedImage) {
      formData.append("image", selectedImage); // this must match multer field name
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // do NOT set Content-Type manually
        },
        body: formData,
      });

      if (res.ok) {
        const updatedProject = await res.json();

        setProjects((prev) =>
          prev.map((proj) => (proj._id === projectId ? updatedProject : proj))
        );
        setEditingProjectId(null);
        setSelectedImage(null); // optional: clear image state
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  console.log("Rendering MyProjects component");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid gap-4">
          {/* {projects.map((project) => (
            <div
              key={project._id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="text-sm text-gray-600">{project.description}</p>

              <button
                onClick={() => handleDelete(project._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))} */}
          {projects.map((project) => (
            <div
              key={project._id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              {editingProjectId === project._id ? (
                //  Editing Mode
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Project Name"
                    className="w-full p-2 border"
                  />
                  <textarea
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                    placeholder="Project Description"
                    className="w-full p-2 border"
                  />
                  <input
                    type="text"
                    value={editedTech}
                    onChange={(e) => setEditedTech(e.target.value)}
                    placeholder="Tech Stack"
                    className="w-full p-2 border"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />

                  {selectedImage && (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="w-32 h-32 object-cover mt-2 rounded"
                    />
                  )}
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.projectName}
                      className="w-32 h-32 object-cover rounded mb-2"
                    />
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(project._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingProjectId(null);
                        setSelectedImage(null);
                      }}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Normal View Mode
                <>
                  <h3 className="text-xl font-semibold">
                    {project.projectName}
                  </h3>
                  <p className="text-gray-700">{project.projectDescription}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {project.techStack}
                  </p>

                  <div className="flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setEditingProjectId(project._id);
                        setEditedName(project.projectName);
                        setEditedDesc(project.projectDescription);
                        setEditedTech(project.techStack);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProjects;
