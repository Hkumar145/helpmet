import React, { useState, useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapLocation = ({ onCoordinatesChange }) => { // Accept callback as a prop
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState([-123.1083, 49.2237]);

  useEffect(() => {
    // Initialize map
    mapInstance.current = tt.map({
      key: 'oGTNNSBuTvoAlixWgPsrKxwc1vZyRitz',
      container: mapRef.current,
      center: [-123.1083, 49.2237],
      zoom: 15
    });

    // Create draggable marker
    markerRef.current = new tt.Marker({ draggable: true })
      .setLngLat(markerPosition)
      .addTo(mapInstance.current);

    // Update marker position state when dragged
    markerRef.current.on('dragend', () => {
      const position = markerRef.current.getLngLat();
      const newCoordinates = [position.lng, position.lat];
      setMarkerPosition(newCoordinates);
      
      // Trigger the callback with the new coordinates
      if (onCoordinatesChange) {
        onCoordinatesChange(newCoordinates);
      }
    });

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  const zoomIn = () => {
    mapInstance.current.setZoom(mapInstance.current.getZoom() + 1);
  };

  const zoomOut = () => {
    mapInstance.current.setZoom(mapInstance.current.getZoom() - 1);
  };

  return (
    <div>
      <p>Map</p>
      <div className="mb-2">
        <strong>Marker Position:</strong> {`Longitude: ${markerPosition[0].toFixed(4)}, Latitude: ${markerPosition[1].toFixed(4)}`}
      </div>
      <div className="relative">
        <div ref={mapRef} className="w-full h-60 mt-4" />
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <button 
            onClick={zoomIn} 
            className="p-1 bg-white rounded-md shadow-md hover:bg-gray-100"
            title="Zoom In"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
          <button 
            onClick={zoomOut}
            className="p-1 bg-white rounded-md shadow-md hover:bg-gray-100"
            title="Zoom Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;
