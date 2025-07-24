import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyProjects from "../components/MyProjects";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log(`No token found`);
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("User response: ", res.data);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("Error: ", err.response?.data);
        navigate("/login");
      });
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a project name.");
    try {
      setCreating(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/projects",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/edit-project/${res.data._id}`);
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      {user ? (
        <p className="mb-4">Welcome, {user.email}</p>
      ) : (
        <p className="mb-4">Loading user info...</p>
      )}

      {/* Project creation form */}
      <form onSubmit={handleCreateProject} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {creating ? "Creating..." : "Create Project"}
        </button>
      </form>

      {/* Project List */}
      <MyProjects />
    </div>
  );
}

export default Dashboard;
