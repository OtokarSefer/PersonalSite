import { useEffect, useState } from "react";
import axios from "axios";

export default function ProtectedPage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/protected`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Access denied"));
  }, []);

  return <h2>{message}</h2>;
}
