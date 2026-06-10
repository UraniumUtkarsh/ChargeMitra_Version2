import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { useState } from "react";

function LocationMarker({ setCoords }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCoords(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ setCoords }) {
  return (
    <MapContainer
      center={[26.8467, 80.9462]} // Lucknow default
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setCoords={setCoords} />
    </MapContainer>
  );
}