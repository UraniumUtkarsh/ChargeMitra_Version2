import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../api";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [chargers, setChargers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [maxDistance, setMaxDistance] = useState(50);
  const [selectedPower, setSelectedPower] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => alert("Location denied"),
    );

    fetchChargers();
  }, []);

  const fetchChargers = () => {
    api
      .get("chargers/public/")
      .then((res) => setChargers(res.data))
      .catch((err) => console.log(err));
  };

  // 🔥 BOOK FUNCTION (ENHANCED)
  const bookCharger = () => {
    if (!startTime || !endTime) {
      alert("Select time");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert("End time must be after start time");
      return;
    }

    if (new Date(startTime) < new Date()) {
      alert("Cannot book past time");
      return;
    }

    api
      .post("bookings/", {
        charger: selectedCharger.id,
        start_time: startTime,
        end_time: endTime,
      })
      .then(() => {
        alert("Booking request sent!");
        setShowBookingModal(false);
        setStartTime("");
        setEndTime("");
      })
      .catch((err) => {
        console.log(err);
        alert("Booking failed");
      });
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const filteredChargers = chargers
    .map((c) => {
      if (!userLocation) return c;

      const distance = getDistance(
        userLocation[0],
        userLocation[1],
        c.latitude,
        c.longitude,
      );

      return { ...c, distance };
    })
    .filter((c) => {
      if (showActiveOnly && !c.is_active) return false;
      if (selectedPower && c.power !== parseFloat(selectedPower)) return false;
      if (c.price > maxPrice) return false;
      if (c.distance && c.distance > maxDistance) return false;
      return true;
    })
    .sort((a, b) => (a.distance || 999) - (b.distance || 999));

  const openNavigation = (lat, lng) => {
    if (userLocation) {
      window.open(
        `https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${lat},${lng}`,
        "_blank",
      );
    } else {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    }
  };

  return (
    <div className="h-screen w-full relative">
      {/* FILTER */}
      <div className="absolute top-4 left-4 bg-slate-800 p-4 rounded-xl z-[1000] w-[260px] text-white">
        <h2 className="mb-3">Filters</h2>

        <label className="flex gap-2 mb-3">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={() => setShowActiveOnly(!showActiveOnly)}
          />
          Active Only
        </label>

        <select
          value={selectedPower}
          onChange={(e) => setSelectedPower(e.target.value)}
          className="w-full mb-3 bg-slate-700 p-2 rounded"
        >
          <option value="">All Power</option>
          <option value="3.3">3.3 kW</option>
          <option value="7.4">7.4 kW</option>
          <option value="22">22 kW</option>
        </select>

        <label>Max Price ₹{maxPrice}</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full mb-3"
        />

        <label>Distance {maxDistance} km</label>
        <input
          type="range"
          min="1"
          max="100"
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          className="w-full"
        />
      </div>
      {/* MAP */}
      <MapContainer
        center={userLocation || [26.8467, 80.9462]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {filteredChargers.map((c) => (
          <Marker key={c.id} position={[c.latitude, c.longitude]}>
            <Popup>
              <b>{c.name}</b>
              <br />
              {c.location}
              <br />⚡ {c.power} kW
              <br />
              💰 ₹{c.price}/hr
              <br />
              📏 {c.distance ? c.distance.toFixed(2) + " km" : ""}
              <br />
              <br />
              <button
                onClick={() => openNavigation(c.latitude, c.longitude)}
                className="bg-blue-500 px-3 py-1 rounded text-white text-sm"
              >
                Navigate
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setSelectedCharger(c);

                  // 🔥 delay ensures popup closes first, then modal opens
                  setTimeout(() => {
                    setShowBookingModal(true);
                  }, 200);
                }}
                className="bg-green-500 px-3 py-1 rounded mt-2 text-white cursor-pointer"
              >
                Book
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* 🔥 BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div className="bg-slate-900 p-6 rounded-xl w-[350px] shadow-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Book Charger
            </h2>

            <p className="text-gray-400 mb-4 text-sm">
              {selectedCharger?.name}
            </p>

            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-slate-800 text-white border border-slate-700"
            />

            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-slate-800 text-white border border-slate-700"
            />

            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={bookCharger}
                disabled={!startTime || !endTime}
                className="bg-green-500 px-4 py-2 rounded text-white disabled:opacity-50 hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
