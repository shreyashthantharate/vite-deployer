import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
          {projects.map((project) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProjects;
