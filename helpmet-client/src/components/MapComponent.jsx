import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';
import React, { useState, useEffect, useRef } from 'react';

const MapComponent = () => {
  const mapElement = useRef();

  const [mapLongitude, setMapLongitude] = useState(-123.116327); // Default to some location
  const [mapLatitude, setMapLatitude] = useState(49.2199047); // Default to some location
  const [mapZoom, setMapZoom] = useState(13);
  const [map, setMap] = useState(null);
  const markerRef = useRef(null); // Ref for the marker

  const MAX_ZOOM = 18;

  const increaseZoom = () => {
    if (mapZoom < MAX_ZOOM) {
      setMapZoom((prevZoom) => prevZoom + 1);
    }
  };

  const decreaseZoom = () => {
    if (mapZoom > 1) {
      setMapZoom((prevZoom) => prevZoom - 1);
    }
  };

  // Fetch current location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setMapLongitude(longitude);
          setMapLatitude(latitude);

          // Log position to make sure it's being fetched
          console.log("Current position:", latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []); // Empty dependency array means this runs once on mount

  // Initialize map and marker
  useEffect(() => {
    if (mapElement.current) {
      const ttMap = tt.map({
        key: "S59U0GVlNmzVhBxdNDxbmvOBHMMaiMH3 ",
        container: mapElement.current,
        center: [mapLongitude, mapLatitude],
        zoom: mapZoom,
      });

      setMap(ttMap);

      // Create a marker at the current location
      const marker = new tt.Marker()
        .setLngLat([mapLongitude, mapLatitude])
        .addTo(ttMap);

      markerRef.current = marker;

      return () => {
        ttMap.remove(); // Clean up the map instance on unmount
      };
    } else {
      console.error("Map container not found");
    }
  }, [mapLongitude, mapLatitude]); // Run this when longitude and latitude change

  // Update map center, zoom, and marker position on state changes
  useEffect(() => {
    if (map && markerRef.current) {
      map.setCenter([mapLongitude, mapLatitude]);
      map.setZoom(mapZoom);

      // Update marker position when location changes
      markerRef.current.setLngLat([mapLongitude, mapLatitude]);
    }
  }, [mapLongitude, mapLatitude, mapZoom, map]);

  return (
    <div>
      <input
        type="text"
        name="longitude"
        value={mapLongitude}
        onChange={(e) => setMapLongitude(e.target.value)}
        style={{ width: '150px', padding: '5px', fontSize: '14px' }} // Reduced size
      />
      <input
        type="text"
        name="latitude"
        value={mapLatitude}
        onChange={(e) => setMapLatitude(e.target.value)}
        style={{ width: '150px', padding: '5px', fontSize: '14px' }} // Reduced size
      />
  
      <button
        onClick={increaseZoom}
        style={{ padding: '8px 12px', fontSize: '14px', marginRight: '5px' }} // Smaller button
      >
        Zoom In
      </button>
      <button
        onClick={decreaseZoom}
        style={{ padding: '8px 12px', fontSize: '14px' }} // Smaller button
      >
        Zoom Out
      </button>
  
      <div
        ref={mapElement}
        className="mapDiv"
        style={{ height: '500px', width: '120%' }}
      ></div>
    </div>
  );
  
};

export default MapComponent;
