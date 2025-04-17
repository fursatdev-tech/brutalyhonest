"use client";

import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useMemo, useState } from "react";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  location: [number, number] | string[] | number[] | null;
  setLocation?: (location: { lat: number; lng: number }) => void;
  draggable?: boolean;
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Map = ({ location, setLocation, draggable = false }: MapProps) => {
  const [zoom, setZoom] = useState(2);
  useEffect(() => {
    if (location) setZoom(16);
  }, [location]);

  const eventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        setLocation?.(e.target._latlng);
      },
    }),
    [setLocation]
  );

  return (
    <MapContainer
      key={`zoom-${zoom}-${location?.join(",")}`}
      center={(location as LatLngExpression) ?? [51, -0.09]}
      zoom={zoom}
      scrollWheelZoom={true}
      className="rounded-lg"
      style={{ height: "35vh", zIndex: 0 }}
    >
      <TileLayer url={url} attribution={attribution} />
      {!!location && (
        <Marker
          position={location as LatLngExpression}
          draggable={draggable}
          eventHandlers={eventHandlers}
        />
      )}

      {location}
    </MapContainer>
  );
};

export default Map;
