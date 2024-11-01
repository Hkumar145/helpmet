import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';
import React, { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { useSelector } from 'react-redux';

const MapComponent = () => {
  const mapElement = useRef();
  const markerRef = useRef(null);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  const [ongoingReportsCount, setOngoingReportsCount] = useState(0);
  const [onHoldReportsCount, setOnHoldReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const [locationReportCounts, setLocationReportCounts] = useState({});
  const [locations, setLocations] = useState([]);

  const maxReportsLocation = Object.entries(locationReportCounts).reduce(
    (max, [locationID, count]) => {
      if (count > (max.count || 0)) {
        const location = locations.find(loc => loc.locationID === locationID);
        return { locationID, count, coordinates: location ? location.location.coordinates : null };
      }
      return max;
    },
    {}
  );

  useEffect(() => {
    if (!companyID) {
      console.log("No companyID provided.");
      return;
    }

    console.log("Fetching data for companyID:", companyID);

    // Fetch pending reports
    axios.get(`/companies/${companyID}/reports/pending`)
      .then(response => {
        console.log("Pending Reports Data:", response.data);
        const pendingReports = response.data;
        setOngoingReportsCount(pendingReports.filter(report => report.status === 'On going').length);
        setOnHoldReportsCount(pendingReports.filter(report => report.status === 'On hold').length);
      })
      .catch(error => {
        console.error("Error fetching pending reports:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      });

    // Fetch completed reports
    axios.get(`/companies/${companyID}/reports`)
      .then(response => {
        console.log("Completed Reports Data:", response.data);
        const completedReports = response.data;
        setCompletedReportsCount(completedReports.length);

        // Compute location report counts
        const locationCountMap = completedReports.reduce((acc, report) => {
          acc[report.locationID] = (acc[report.locationID] || 0) + 1;
          return acc;
        }, {});
        setLocationReportCounts(locationCountMap);
      })
      .catch(error => {
        console.error("Error fetching completed reports:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      });

    // Fetch locations
    axios.get(`/companies/${companyID}/locations`)
      .then(response => {
        console.log("Locations Data:", response.data);
        setLocations(response.data);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      });
  }, [companyID]);

  useEffect(() => {
    if (mapElement.current && maxReportsLocation?.coordinates) {
      const { coordinates, locationID, count } = maxReportsLocation;

      // Initialize the map centered on maxReportsLocation
      const map = tt.map({
        key: "S59U0GVlNmzVhBxdNDxbmvOBHMMaiMH3",
        container: mapElement.current,
        center: coordinates,
        zoom: 13,
      });

      // Create marker for the location with max reports and set popup with locationID and count
      markerRef.current = new tt.Marker()
        .setLngLat(coordinates)
        .setPopup(
          new tt.Popup({ offset: 35 }).setHTML(
            `<div style="font-size:14px; color:#333; line-height:1.5;">
              <strong>Location ID:</strong> <span style="color:#0055aa;">${locationID}</span><br>
              <strong>Reports:</strong> <span style="color:#d9534f;">${count}</span>
            </div>`
          )
        )
        .addTo(map);

      return () => map.remove(); // Cleanup map on unmount
    }
  }, [maxReportsLocation]);

  return (
    <div>
      {maxReportsLocation.count > 0 ? (
        <>
          <h2>Location with Maximum Reports:</h2>
          <p>{`Location ID: ${maxReportsLocation.locationID}, Reports: ${maxReportsLocation.count}`}</p>
          <div ref={mapElement} className="mapDiv" style={{ height: '500px', width: '100%' }}></div>
        </>
      ) : (
        <p>No location data available.</p>
      )}
    </div>
  );
};

export default MapComponent;
