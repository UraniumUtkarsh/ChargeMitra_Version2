import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  const username = localStorage.getItem("username");

  const logout = () => {
  localStorage.clear();   // remove token + username
  nav("/");               // go to landing page
};

  return (
    <div className="h-16 bg-slate-800 flex justify-end items-center px-6 border-b border-slate-700">

      <div className="flex items-center gap-4">
        <span className="text-gray-300">👤 {username}</span>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}