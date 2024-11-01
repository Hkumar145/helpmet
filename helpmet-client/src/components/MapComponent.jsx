import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapComponent = () => {
  const [locationReportCounts, setLocationReportCounts] = useState({});
  const [locations, setLocations] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null); // State to hold selected marker coordinates
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // Ref for the map instance

  useEffect(() => {
    if (companyID) {
      // Fetch completed reports count
      axios.get(`/companies/${companyID}/reports`)
        .then(response => {
          const completedReports = response.data;
          const countsByLocation = completedReports.reduce((acc, report) => {
            acc[report.locationID] = (acc[report.locationID] || 0) + 1;
            return acc;
          }, {});
          setLocationReportCounts(countsByLocation);
          const sortedLocations = Object.entries(countsByLocation)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 3)
            .map(([locationID]) => locationID);
          setTopLocations(sortedLocations);
        })
        .catch(error => console.error("Error fetching completed reports:", error));

      // Fetch locations
      axios.get(`/companies/${companyID}/locations`)
        .then(response => {
          setLocations(response.data);
        })
        .catch(error => console.error("Error fetching locations:", error));
    }
  }, [companyID]);

  useEffect(() => {
    if (topLocations.length > 0 && locations.length > 0) {
      mapInstance.current = tt.map({
        key: 'oGTNNSBuTvoAlixWgPsrKxwc1vZyRitz',
        container: mapRef.current,
        center: locations[0]?.coordinates || [0, 0],
        zoom: 14,
      });

      topLocations.forEach(locationID => {
        const location = locations.find(loc => loc.locationID === locationID);
        
        if (location && location.coordinates) {
          const { coordinates } = location; 
          const marker = new tt.Marker()
            .setLngLat(coordinates)
            .addTo(mapInstance.current)
            .on('click', () => {
              setSelectedCoordinates(coordinates); // Set selected coordinates on marker click
            });

          const reportCount = locationReportCounts[locationID] || 0;
          const popupContent = `
            <div>
              <h4>Location ID: ${locationID}</h4>
              <p>Report Count: ${reportCount}</p>
            </div>
          `;
          
          const popup = new tt.Popup({ offset: 10 }).setHTML(popupContent);
          marker.setPopup(popup); // Attach popup to marker
        }
      });
    }
  }, [topLocations, locations, locationReportCounts]);

  const handleViewCompletedReports = () => {
    navigate(`/report`);
  };

  const zoomIn = () => {
    mapInstance.current.setZoom(mapInstance.current.getZoom() + 1);
  };

  const zoomOut = () => {
    mapInstance.current.setZoom(mapInstance.current.getZoom() - 1);
  };

  return (
    <div>
      <p>Heat Map</p>
      {selectedCoordinates && (
        <div className="mb-2">
          <strong>Selected Coordinates:</strong> {`Longitude: ${selectedCoordinates[0]}, Latitude: ${selectedCoordinates[1]}`}
        </div>
      )}
      <div ref={mapRef} className="w-full h-60 mt-4" />
      <div className="flex justify-between mt-2">
        <button onClick={zoomIn} className="p-2 bg-blue-500 text-white rounded">Zoom In</button>
        <button onClick={zoomOut} className="p-2 bg-red-500 text-white rounded">Zoom Out</button>
      </div>
    </div>
  );
};

export default MapComponent;
