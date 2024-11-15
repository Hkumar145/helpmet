import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const MapComponent = () => {
  const [locationReportCounts, setLocationReportCounts] = useState({});
  const [locations, setLocations] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // // Mock data
  // useEffect(() => {
  //   // Mock locations data
  //   const mockLocations = [
  //     {
  //       locationID: "loc1",
  //       locationName: "Downtown Office",
  //       coordinates: [-73.9857, 40.7484], // New York Area
  //     },
  //     {
  //       locationID: "loc2",
  //       locationName: "East Side Factory",
  //       coordinates: [-73.9737, 40.7505],
  //     },
  //     {
  //       locationID: "loc3",
  //       locationName: "West Side Warehouse",
  //       coordinates: [-73.9927, 40.7497],
  //     },
  //     {
  //       locationID: "loc4",
  //       locationName: "South Plaza",
  //       coordinates: [-73.9857, 40.7434],
  //     },
  //     {
  //       locationID: "loc5",
  //       locationName: "North Station",
  //       coordinates: [-73.9857, 40.7534],
  //     },
  //   ];

  //   // Mock report counts
  //   const mockReportCounts = {
  //     loc1: 45, // High number of reports
  //     loc2: 28, // Medium-high
  //     loc3: 35, // Medium
  //     loc4: 22, // Medium-low
  //     loc5: 25, // Low
  //   };

  //   // Set the mock data to state
  //   setLocations(mockLocations);
  //   setLocationReportCounts(mockReportCounts);

  //   // Set top locations (those with more than 20 reports)
  //   const sortedLocations = Object.entries(mockReportCounts)
  //     .filter(([, count]) => count > 20)
  //     .sort(([, countA], [, countB]) => countB - countA)
  //     .map(([locationID]) => locationID);
  //   setTopLocations(sortedLocations);
  // }, []); // Empty dependency array since we're just setting mock data

  useEffect(() => {
    if (companyID) {
      // Fetch completed reports count
      axios
        .get(`/companies/${companyID}/reports`)
        .then((response) => {
          const completedReports = response.data;
          const countsByLocation = completedReports.reduce((acc, report) => {
            acc[report.locationID] = (acc[report.locationID] || 0) + 1;
            return acc;
          }, {});
          setLocationReportCounts(countsByLocation);
          const sortedLocations = Object.entries(countsByLocation)
            .filter(([, count]) => count > 20)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 3)
            .map(([locationID]) => locationID);
          setTopLocations(sortedLocations);
        })
        .catch((error) =>
          console.error("Error fetching completed reports:", error)
        );

      // Fetch locations
      axios
        .get(`/companies/${companyID}/locations`)
        .then((response) => {
          setLocations(response.data);
        })
        .catch((error) => console.error("Error fetching locations:", error));
    }
  }, [companyID]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .custom-popup {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        padding: 0 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      }
      .custom-popup .mapboxgl-popup-content {
        background: none !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      .custom-popup .mapboxgl-popup-tip {
        display: none !important;
      }
      .popup-content {
        padding: 16px;
      }
      .popup-header {
        font-size: 16px;
        font-weight: 600;
        color: #1F2937;
        margin-bottom: 8px;
      }
      .popup-details {
        font-size: 14px;
        color: #6B7280;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .report-count {
        color: #DC2626;
        font-weight: 500;
      }
      .close-button {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.2s;
      }
      .close-button:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const calculateNormalizedValue = (count, allCounts, min, max) => {
    const maxCount = Math.max(...Object.values(allCounts));
    const minCount = Math.min(...Object.values(allCounts));

    // Normalize the count between 0 and 1
    const normalized =
      maxCount === minCount ? 0.5 : (count - minCount) / (maxCount - minCount);

    // Calculate value between min and max
    return min + normalized * (max - min);
  };

  const calculateRadiusInMeters = (count, allCounts, zoom) => {
    const minRadiusMeters = 50; // Base minimum radius in meters
    const maxRadiusMeters = 200; // Base maximum radius in meters
    const maxCount = Math.max(...Object.values(allCounts));
    const minCount = Math.min(...Object.values(allCounts));

    // Zoom factor calculation (smaller circles at lower zoom levels)
    const zoomFactor = Math.max(0.1, (zoom - 10) / 10); //

    if (maxCount === minCount) {
      return ((minRadiusMeters + maxRadiusMeters) / 2) * zoomFactor;
    }

    const normalizedCount = (count - minCount) / (maxCount - minCount);
    return (
      (minRadiusMeters +
        normalizedCount * (maxRadiusMeters - minRadiusMeters)) *
      zoomFactor
    );
  };

  useEffect(() => {
    if (topLocations.length > 0 && locations.length > 0) {
      mapInstance.current = tt.map({
        key: "S59U0GVlNmzVhBxdNDxbmvOBHMMaiMH3",
        container: mapRef.current,
        center: locations[0]?.coordinates || [0, 0],
        zoom: 14,
      });

      // Update circles on zoom
      mapInstance.current.on("zoom", () => {
        topLocations.forEach((locationID) => {
          const currentZoom = mapInstance.current.getZoom();
          const location = locations.find(
            (loc) => loc.locationID === locationID
          );
          const reportCount = locationReportCounts[locationID] || 0;

          if (
            location &&
            mapInstance.current.getLayer(`circle-${locationID}`)
          ) {
            const newRadius = calculateRadiusInMeters(
              reportCount,
              locationReportCounts,
              currentZoom
            );

            mapInstance.current.setPaintProperty(
              `circle-${locationID}`,
              "circle-radius",
              newRadius
            );
          }
        });
      });

      topLocations.forEach((locationID) => {
        const location = locations.find((loc) => loc.locationID === locationID);

        if (location && location.coordinates) {
          const { coordinates } = location;
          const reportCount = locationReportCounts[locationID] || 0;
          const initialZoom = mapInstance.current.getZoom();

          // Initial radius calculation using current zoom level
          const radiusInMeters = calculateRadiusInMeters(
            reportCount,
            locationReportCounts,
            initialZoom
          );

          const dynamicOpacity = calculateNormalizedValue(
            reportCount,
            locationReportCounts,
            0.1,
            0.6
          );

          mapInstance.current.on("load", () => {
            mapInstance.current.addLayer({
              id: `circle-${locationID}`,
              type: "circle",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: coordinates,
                  },
                },
              },
              paint: {
                "circle-radius": radiusInMeters,
                "circle-color": "#FEE2E2",
                "circle-opacity": dynamicOpacity,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#FCA5A5",
                "circle-stroke-opacity": 0.5,
              },
            });
          });

          // Create a custom marker element
          const el = document.createElement("div");
          el.className = "marker-container";
          el.innerHTML = `
            <div style="
              position: relative;
              width: 30px;
              height: 30px;
            ">
              <img src="/images/severe.svg" style="
                width: 30px;
                height: 30px;
                position: absolute;
                z-index: 1;
              "/>
              <div style="
                position: absolute;
                top: -8px;
                right: -8px;
                background-color: #DC2626;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                z-index: 2;
              ">${reportCount}</div>
            </div>
          `;

          // Create marker with custom element
          const marker = new tt.Marker({
            element: el,
          })
            .setLngLat(coordinates)
            .addTo(mapInstance.current)
            .on("click", () => {
              setSelectedCoordinates(coordinates);
            });

          const popupContent = `
            <div class="popup-content">
              <div class="popup-header">Location Details</div>
              <div class="popup-details">
                <span class="report-count">${reportCount} Reports</span>
                <span>${location.locationName}</span>
                <span style="color: #9CA3AF; font-size: 13px;">ID: ${location.locationID}</span>
              </div>
              <button class="close-button" onclick="this.closest('.mapboxgl-popup').remove()">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1L11 11M1 11L11 1" stroke="#4B5563" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          `;

          const popup = new tt.Popup({
            offset: 25,
            closeButton: false,
            className: "custom-popup",
          }).setHTML(popupContent);

          marker.setPopup(popup);
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
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
    <div className="w-full">
      {selectedCoordinates && (
        <div className="mb-2">
          <strong>Selected Coordinates:</strong>{" "}
          {`Longitude: ${selectedCoordinates[0]}, Latitude: ${selectedCoordinates[1]}`}
        </div>
      )}
      <div className="relative">
        <div ref={mapRef} className="w-[95%] h-[200px] mx-auto mt-2" />
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <button
            onClick={zoomIn}
            className="p-1 bg-white rounded-md shadow-md hover:bg-gray-100"
            title="Zoom In"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
          <button
            onClick={zoomOut}
            className="p-1 bg-white rounded-md shadow-md hover:bg-gray-100"
            title="Zoom Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
