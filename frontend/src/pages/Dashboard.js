import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EnergyChart from "../components/EnergyChart";
import MapPicker from "../components/MapPicker";

export default function Dashboard() {
  const [chargers, setChargers] = useState([]);
  const [incoming, setIncoming] = useState([]); // 🔥 bookings
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    power: "",
    price: "",
  });

  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
      return;
    }
    fetchChargers();
    fetchIncoming();
  }, []);

  // 🔥 BOOKINGS
  const fetchIncoming = () => {
    api.get("bookings/incoming/")
      .then((res) => setIncoming(res.data))
      .catch((err) => console.log(err));
  };

  const acceptBooking = (id) => {
    api.post(`bookings/${id}/accept/`)
      .then(() => fetchIncoming());
  };

  const rejectBooking = (id) => {
    api.post(`bookings/${id}/reject/`)
      .then(() => fetchIncoming());
  };

  // 📍 MAP PICK
  const handleMapSelect = (coords) => {
    setForm({
      ...form,
      latitude: coords.lat,
      longitude: coords.lng,
    });
  };

  // 🔌 CHARGERS
  const fetchChargers = () => {
    api.get("chargers/")
      .then((res) => setChargers(res.data))
      .catch(() => nav("/login"));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const deleteCharger = (id) => {
    api.delete(`chargers/${id}/`)
      .then(() => fetchChargers());
  };

  const toggleActive = (charger) => {
    const newStatus = !charger.is_active;

    api.patch(`chargers/${charger.id}/`, {
      is_active: newStatus,
    }).then(() => {
      setChargers((prev) =>
        prev.map((c) =>
          c.id === charger.id ? { ...c, is_active: newStatus } : c
        )
      );
    });
  };

  const editCharger = (charger) => {
    setForm(charger);
    setShowModal(true);
  };

  const addCharger = () => {
    const data = {
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      power: parseFloat(form.power),
      price: parseInt(form.price),
    };

    if (form.id) {
      api.put(`chargers/${form.id}/`, data)
        .then(() => {
          fetchChargers();
          setShowModal(false);
        });
    } else {
      api.post("chargers/", data)
        .then(() => {
          fetchChargers();
          setShowModal(false);
        });
    }
  };

  return (
    <div className="flex bg-slate-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />

        <div className="p-6">

          <h1 className="text-3xl font-bold mb-6">Mitra Dashboard</h1>

          {/* 🔥 BOOKING REQUESTS */}
          <div className="mb-10">
            <h2 className="text-xl mb-4">Booking Requests</h2>

            {incoming.length === 0 ? (
              <p className="text-gray-400">No pending requests</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {incoming.map((b) => (
                  <div key={b.id} className="bg-slate-800 p-4 rounded-xl">

                    <p className="text-sm text-gray-400">
                      Charger ID: {b.charger}
                    </p>

                    <p className="mt-2 text-sm">
                      {new Date(b.start_time).toLocaleString()}
                      <br />
                      → {new Date(b.end_time).toLocaleString()}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => acceptBooking(b.id)}
                        className="bg-green-500 px-3 py-1 rounded"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => rejectBooking(b.id)}
                        className="bg-red-500 px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 📊 STATS */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-xl">
              <p className="text-gray-400">Active Power</p>
              <h2 className="text-2xl text-green-400 font-bold">7.4 kW</h2>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
              <p className="text-gray-400">Total Earnings</p>
              <h2 className="text-2xl text-green-400 font-bold">₹12,400</h2>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
              <p className="text-gray-400">Carbon Saved</p>
              <h2 className="text-2xl text-green-400 font-bold">850 kg</h2>
            </div>
          </div>

          <div className="mb-8">
            <EnergyChart />
          </div>

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">Your Chargers</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 px-4 py-2 rounded"
            >
              + Add Charger
            </button>
          </div>

          {/* 🔌 CHARGER LIST */}
          <div className="grid md:grid-cols-2 gap-6">
            {chargers.map((c) => (
              <div key={c.id} className="bg-slate-800 p-5 rounded-xl">

                <div className="flex justify-between">
                  <h3 className="text-lg">{c.name}</h3>

                  <span className={`text-xs px-2 py-1 rounded ${
                    c.is_active ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {c.is_active ? "Active" : "Disabled"}
                  </span>
                </div>

                <p className="text-gray-400">{c.location}</p>

                <div className="flex justify-between mt-2 text-sm">
                  <span>{c.power} kW</span>
                  <span>₹{c.price}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => editCharger(c)} className="bg-blue-500 px-3 py-1 rounded text-sm">Edit</button>
                  <button onClick={() => deleteCharger(c.id)} className="bg-red-500 px-3 py-1 rounded text-sm">Delete</button>
                  <button onClick={() => toggleActive(c)} className="bg-yellow-500 px-3 py-1 rounded text-sm">
                    {c.is_active ? "Disable" : "Enable"}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl w-96">

            <h2 className="text-xl mb-4">Add / Edit Charger</h2>

            <input name="name" placeholder="Name" onChange={handleChange} className="w-full mb-2 p-2 bg-slate-800 rounded"/>
            <input name="location" placeholder="Location" onChange={handleChange} className="w-full mb-2 p-2 bg-slate-800 rounded"/>

            <div className="flex gap-2">
              <input name="latitude" value={form.latitude} placeholder="Lat" onChange={handleChange} className="w-1/2 p-2 bg-slate-800"/>
              <input name="longitude" value={form.longitude} placeholder="Lng" onChange={handleChange} className="w-1/2 p-2 bg-slate-800"/>
            </div>

            <button onClick={() => setShowMap(!showMap)} className="text-green-400 text-sm mt-2">
              Pick from Map
            </button>

            {showMap && <MapPicker setCoords={handleMapSelect} />}

            <input name="power" placeholder="Power" onChange={handleChange} className="w-full mt-2 p-2 bg-slate-800"/>
            <input name="price" placeholder="Price" onChange={handleChange} className="w-full mt-2 p-2 bg-slate-800"/>

            <div className="flex justify-between mt-4">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={addCharger} className="bg-green-500 px-4 py-2 rounded">Save</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}