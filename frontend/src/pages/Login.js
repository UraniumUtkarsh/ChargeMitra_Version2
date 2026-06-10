import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("username", username);
      nav("/mitra-host");
    } catch (err) {
      alert("Login failed");
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-slate-900 text-white">
      <div className="bg-white/10 p-8 rounded-xl w-[350px] backdrop-blur">

        <h2 className="text-xl mb-5 text-center">Mitra Login Portal</h2>

        <input
          placeholder="Username"
          onChange={(e)=>setUsername(e.target.value)}
          className="w-full p-3 mb-3 bg-slate-800 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-slate-800 rounded"
        />

        <button
          onClick={login}
          className="w-full bg-green-500 py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}