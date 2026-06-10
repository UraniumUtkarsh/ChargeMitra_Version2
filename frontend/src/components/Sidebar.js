import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();

  return (
    <div className="w-64 h-screen bg-slate-800 p-5 flex flex-col justify-between">
      {/* TOP */}
      <div>
        <h1
          className="text-xl font-bold text-green-400 mb-8 cursor-pointer"
          onClick={() => nav("/")}
        >
          ⚡ ChargeMitra
        </h1>

        <div className="flex flex-col gap-4 text-gray-300">
          <button
            onClick={() => nav("/mitra-host")}
            className="text-left hover:text-green-400"
          >
            Dashboard
          </button>
          <button onClick={() => nav("/my-bookings")}>My Bookings</button>

          <button
            onClick={() => nav("/chargers-near-me")}
            className="text-left hover:text-green-400"
          >
            Find Chargers
          </button>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-sm text-gray-500">EV P2P Network 🚀</div>
    </div>
  );
}
