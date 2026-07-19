import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { Facility } from "@/types";

// Fix default marker icons with Leaflet under bundlers
const pinIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);box-shadow:0 4px 10px rgba(0,0,0,0.25);border:2px solid white;"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

const pinColors: Record<Facility["type"], string> = {
  hospital: "#ef4444",
  police: "#3b82f6",
  fire: "#f97316",
  shelter: "#22c55e",
};

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export function MapCard({
  center,
  facilities,
  selected,
  onSelect,
}: {
  center: [number, number];
  facilities: Facility[];
  selected?: Facility | null;
  onSelect?: (f: Facility) => void;
}) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom
      className="h-full w-full min-h-[400px] rounded-2xl overflow-hidden z-0"
    >
      <Recenter center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker
        position={center}
        icon={L.divIcon({
          className: "",
          html: `<div style="width:18px;height:18px;border-radius:50%;background:#0f172a;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,0.3);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })}
      >
        <Popup>You are here</Popup>
      </Marker>
      {facilities.map((f) => (
        <Marker
          key={f.id}
          position={[f.lat, f.lng]}
          icon={pinIcon(pinColors[f.type])}
          eventHandlers={{ click: () => onSelect?.(f) }}
        >
          <Popup>
            <div className="space-y-1">
              <strong>{f.name}</strong>
              <div className="text-xs text-gray-500">{f.address}</div>
              <div className="text-xs">{f.phone}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
