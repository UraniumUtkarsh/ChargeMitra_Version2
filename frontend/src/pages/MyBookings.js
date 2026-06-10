import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
      return;
    }

    fetchBookings();
  }, []);

  const fetchBookings = () => {
    api.get("bookings/")
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  };

  const getStatusColor = (status) => {
    if (status === "confirmed") return "bg-green-500";
    if (status === "rejected") return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <div className="flex bg-slate-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

          {bookings.length === 0 ? (
            <p className="text-gray-400">No bookings yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">

              {bookings.map((b) => (
                <div key={b.id} className="bg-slate-800 p-5 rounded-xl">

                  {/* HEADER */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Charger ID: {b.charger}
                    </h3>

                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(b.status)}`}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  {/* TIME */}
                  <div className="mt-3 text-sm text-gray-300">
                    <p>
                      Start: {new Date(b.start_time).toLocaleString()}
                    </p>
                    <p>
                      End: {new Date(b.end_time).toLocaleString()}
                    </p>
                  </div>

                  {/* INFO */}
                  <p className="text-gray-400 mt-3 text-sm">
                    {b.status === "pending" && "Waiting for owner approval"}
                    {b.status === "confirmed" && "Booking confirmed"}
                    {b.status === "rejected" && "Booking rejected"}
                  </p>

                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}