"use client";
import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

interface MapPickerProps {
  lat?: number;
  lng?: number;
  onChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, onChange, readOnly = false }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null
  );

  useEffect(() => {
    if (lat && lng) {
      setMarkerPos({ lat, lng });
    }
  }, [lat, lng]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (readOnly) return;
    if (e.latLng && onChange) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setMarkerPos({ lat: newLat, lng: newLng });
      onChange(newLat, newLng);
    }
  }, [onChange, readOnly]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400 font-medium">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPos || { lat: 40.7128, lng: -74.0060 }} // Default to NYC if no pos
      zoom={markerPos ? 15 : 10}
      onClick={onMapClick}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: readOnly,
        zoomControl: !readOnly,
        gestureHandling: readOnly ? 'cooperative' : 'auto'
      }}
    >
      {markerPos && <Marker position={markerPos} />}
    </GoogleMap>
  );
};

export default MapPicker;
