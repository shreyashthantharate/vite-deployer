import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
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

  //   const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <h2>Dashboard</h2>
      {user ? <p>Welcome, {user.email} </p> : <p>Loading user info...</p>}
    </div>
  );
}

export default Dashboard;
