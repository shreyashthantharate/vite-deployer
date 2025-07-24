// components/Navbar.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../utils/Logout";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(setUser);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        DevServer
      </Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
