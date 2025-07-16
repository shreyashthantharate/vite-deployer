import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        inputs
      );
      console.log(res.data);
      alert("Registered successfully! You can login now.");
      navigate("/login");
    } catch (error) {
      console.error(error.response.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text "
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="email "
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password "
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
