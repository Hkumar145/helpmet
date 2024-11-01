import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapComponent = () => {
  const [locationReportCounts, setLocationReportCounts] = useState({});
  const [locations, setLocations] = useState([]); // State to store location data
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();
  const mapRef = useRef(null); // Ref for the map div
  const [topLocations, setTopLocations] = useState([]); // State to store top locations

  useEffect(() => {
    if (companyID) {
      // Fetch completed reports count
      axios.get(`/companies/${companyID}/reports`)
        .then(response => {
          const completedReports = response.data;

          // Count reports by location
          const countsByLocation = completedReports.reduce((acc, report) => {
            acc[report.locationID] = (acc[report.locationID] || 0) + 1;
            return acc;
          }, {});

          setLocationReportCounts(countsByLocation);

          // Determine the top 3 locations with the highest report counts
          const sortedLocations = Object.entries(countsByLocation)
            .sort(([, countA], [, countB]) => countB - countA) // Sort by count descending
            .slice(0, 3) // Get top 3
            .map(([locationID]) => locationID); // Extract location IDs
          
          setTopLocations(sortedLocations);
        })
        .catch(error => console.error("Error fetching completed reports:", error));

      // Fetch locations
      axios.get(`/companies/${companyID}/locations`) // Update this endpoint to match your API
        .then(response => {
          setLocations(response.data); // Assuming this returns an array of location objects
        })
        .catch(error => console.error("Error fetching locations:", error));
    }
  }, [companyID]);

  useEffect(() => {
    if (topLocations.length > 0 && locations.length > 0) {
      const map = tt.map({
        key: 'oGTNNSBuTvoAlixWgPsrKxwc1vZyRitz', // Replace with your actual TomTom API key
        container: mapRef.current, // Make sure this ref is defined
        center: locations[0]?.coordinates || [0, 0], // Default center
        zoom: 14,
      });

      topLocations.forEach(locationID => {
        const location = locations.find(loc => loc.locationID === locationID);
        
        if (location && location.coordinates) {
          const { coordinates } = location; 
          const marker = new tt.Marker()
            .setLngLat(coordinates)
            .addTo(map);

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

  return (
    <div>
      <p>Heat Map</p>
      <div ref={mapRef} className="w-full h-60 mt-4" /> {/* Map container */}
    </div>
  );
};

export default MapComponent;
