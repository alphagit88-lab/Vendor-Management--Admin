"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import { Search, MapPin, Loader2 } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "20px",
};

interface MapPickerProps {
  lat?: number;
  lng?: number;
  onChange?: (lat: number, lng: number, address?: string) => void;
  readOnly?: boolean;
}

const libraries: ("places")[] = ["places"];

const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, onChange, readOnly = false }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null
  );
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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
      
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
        let address = undefined;
        if (status === "OK" && results && results[0]) {
          address = results[0].formatted_address;
        }
        onChange(newLat, newLng, address);
      });
    }
  }, [onChange, readOnly]);

  const handleManualSearch = () => {
    if (!searchValue || !isLoaded) return;
    setIsSearching(true);
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchValue }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        const newLat = lat();
        const newLng = lng();
        const address = results[0].formatted_address;

        setMarkerPos({ lat: newLat, lng: newLng });
        if (onChange) {
          onChange(newLat, newLng, address);
        }
        if (map) {
          map.panTo({ lat: newLat, lng: newLng });
          map.setZoom(17);
        }
      } else {
        alert("Location not found. Please try a more specific address.");
      }
      setIsSearching(false);
    });
  };

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const onAutocompleteLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        const address = place.formatted_address;
        
        setMarkerPos({ lat: newLat, lng: newLng });
        setSearchValue(address || "");
        if (onChange) {
          onChange(newLat, newLng, address);
        }
        if (map) {
          map.panTo({ lat: newLat, lng: newLng });
          map.setZoom(17);
        }
      }
    }
  };

  if (!isLoaded) return <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 font-black uppercase tracking-widest text-[10px]">Initializing Mapping Engine...</div>;

  return (
    <div className="relative w-full space-y-4">
      {!readOnly && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter location or business address..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleManualSearch();
                    }
                  }}
                />
              </div>
            </Autocomplete>
          </div>
          <button
            type="button"
            onClick={handleManualSearch}
            disabled={isSearching || !searchValue}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 border border-emerald-500 rounded-xl shadow-xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all text-white font-black text-xs uppercase tracking-widest disabled:opacity-50 whitespace-nowrap"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isSearching ? 'Finding...' : 'Search Location'}
          </button>
        </div>
      )}
      <div className="relative group overflow-hidden rounded-[20px] border border-slate-100 shadow-2xl shadow-slate-200/50">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPos || { lat: 40.7128, lng: -74.0060 }}
          zoom={markerPos ? 17 : 10}
          onClick={onMapClick}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: readOnly,
            zoomControl: !readOnly,
            gestureHandling: readOnly ? 'cooperative' : 'auto',
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          {markerPos && <Marker 
            position={markerPos} 
            animation={google.maps.Animation.DROP}
          />}
        </GoogleMap>
        {!readOnly && (
          <div className="absolute bottom-6 left-6 p-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg pointer-events-none transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                   <MapPin className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Precision Pinning</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Click anywhere on map to select</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPicker;



