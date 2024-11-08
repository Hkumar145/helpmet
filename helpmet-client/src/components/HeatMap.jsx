import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const HeatMap = () => {
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

export default HeatMap;
