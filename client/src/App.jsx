import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api")
      .then((res) => setMessage(res.data))
      .catch((err) => setMessage("Failed to fetch API"));
  }, []);
  return (
    <div className="p-10 text-xl">
      Backend says: <strong>{message}</strong>
    </div>
  );
}

export default App;
