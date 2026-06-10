import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/register/", form);
      alert("Registered successfully!");
      nav("/login");
    } catch (err) {
      alert("Error registering");
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-slate-900 text-white">

      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-xl w-[380px]">

        <h2 className="text-xl mb-5 text-center">Become a Mitra</h2>

        {/* FORM */}
        <input name="username" placeholder="Username" onChange={handleChange} className="w-full p-3 mb-3 bg-slate-800 rounded"/>
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 mb-3 bg-slate-800 rounded"/>
        <input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-3 mb-3 bg-slate-800 rounded"/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 mb-4 bg-slate-800 rounded"/>

        <button onClick={register} className="w-full bg-green-500 py-2 rounded hover:bg-green-600">
          Register
        </button>

        {/* EXTRA INFO */}
        <p className="text-xs text-gray-400 mt-4">
          Transaction section (currently unavailable)
        </p>

        {/* GOOGLE SIGNUP */}
        <button
          disabled
          className="w-full mt-4 bg-gray-600 py-2 rounded cursor-not-allowed"
        >
          Continue with Google (not enabled)
        </button>

        {/* LOGIN REDIRECT */}
        <p
          className="mt-4 text-sm text-green-400 cursor-pointer text-center"
          onClick={() => nav("/login")}
        >
          Already a Mitra? Login
        </p>

      </div>
    </div>
  );
}