import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

// Default center (e.g., somewhere global or a specific city)
const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York

const MapComponent = ({ activeUsers, myLocation, myUser }) => {
  // Use user's location as center if available, else default
  const center = myLocation || defaultCenter;

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'}>
      <Map
        defaultCenter={center}
        defaultZoom={12}
        mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID"}
        disableDefaultUI={true}
        gestureHandling={'greedy'}
      >
        {/* Render My Location */}
        {myLocation && (
          <Marker 
            position={myLocation} 
            title={`You (${myUser?.username})`}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 8
            }}
          />
        )}

        {/* Render Other Users */}
        {Object.values(activeUsers).map(u => (
          <Marker 
            key={u.userId}
            position={{ lat: u.lat, lng: u.lng }}
            title={u.username}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              fillColor: '#10b981',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 8
            }}
          />
        ))}
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
