// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import axios from '../api/axios';
// import { useNavigate } from 'react-router-dom';
// import tt from '@tomtom-international/web-sdk-maps';
// import '@tomtom-international/web-sdk-maps/dist/maps.css';

// const PendingAndCompletedReports = () => {
//   const [locationReportCounts, setLocationReportCounts] = useState({});
//   const [locations, setLocations] = useState([]); // State to store location data
//   const companyID = useSelector((state) => state.user.currentUser?.companyID);
//   const navigate = useNavigate();
//   const mapRef = useRef(null); // Ref for the map div
//   const [highestReportLocation, setHighestReportLocation] = useState(null);

//   useEffect(() => {
//     if (companyID) {
//       // Fetch completed reports count
//       axios.get(`/companies/${companyID}/reports`)
//         .then(response => {
//           const completedReports = response.data;

//           // Count reports by location
//           const countsByLocation = completedReports.reduce((acc, report) => {
//             acc[report.locationID] = (acc[report.locationID] || 0) + 1;
//             return acc;
//           }, {});

//           setLocationReportCounts(countsByLocation);

//           // Determine location with the highest report count
//           const highestLocationID = Object.keys(countsByLocation).reduce((a, b) => 
//             countsByLocation[a] > countsByLocation[b] ? a : b
//           );
//           setHighestReportLocation(highestLocationID);
//         })
//         .catch(error => console.error("Error fetching completed reports:", error));

//       // Fetch locations
//       axios.get(`/companies/${companyID}/locations`) // Update this endpoint to match your API
//         .then(response => {
//           setLocations(response.data); // Assuming this returns an array of location objects
//         })
//         .catch(error => console.error("Error fetching locations:", error));
//     }
//   }, [companyID]);

//   useEffect(() => {
//     if (highestReportLocation && locations.length > 0) {
//       const location = locations.find(loc => loc.locationID === highestReportLocation);
      
//       if (location && location.coordinates) {
//         const { coordinates } = location; 
//         const map = tt.map({
//           key: 'oGTNNSBuTvoAlixWgPsrKxwc1vZyRitz', // Replace with your actual TomTom API key
//           container: mapRef.current, // Make sure this ref is defined
//           center: coordinates,
//           zoom: 14,
//         });
  
//         new tt.Marker().setLngLat(coordinates).addTo(map);
//       }
//     }
//   }, [highestReportLocation, locations]);
  
//   const handleViewCompletedReports = () => {
//     navigate(`/report`);
//   };

//   return (
//     <div className='flex flex-col gap-4'>
//       <div className='flex flex-row items-center justify-between'>
//         <p className='text-black'>Reports By Location Summary</p>
//       </div>

//       <div className='mt-4'>
//         <h3 className='text-black mb-2'>Location Reports Table</h3>
//         <table className='min-w-full bg-white border border-gray-200'>
//           <thead>
//             <tr>
//               <th className='border border-gray-300 px-4 py-2'>Location Name</th>
//               <th className='border border-gray-300 px-4 py-2'>Report Count</th>
//               <th className='border border-gray-300 px-4 py-2'>Coordinates</th>
//             </tr>
//           </thead>
//           <tbody>
//             {locations.map(location => (
//               <tr key={location.locationID}>
//                 <td className='border border-gray-300 px-4 py-2'>{location.locationName || location.locationID}</td>
//                 <td className='border border-gray-300 px-4 py-2'>{locationReportCounts[location.locationID] || 0}</td>
//                 <td className='border border-gray-300 px-4 py-2'>
//                   {location.coordinates ? `${location.coordinates[1]}, ${location.coordinates[0]}` : 'N/A'}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div ref={mapRef} className="w-full h-60 mt-4" /> {/* Map container */}
//     </div>
//   );
// };

// export default PendingAndCompletedReports;


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
  const [highestReportLocation, setHighestReportLocation] = useState(null);

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

          // Determine location with the highest report count
          const highestLocationID = Object.keys(countsByLocation).reduce((a, b) => 
            countsByLocation[a] > countsByLocation[b] ? a : b
          );
          setHighestReportLocation(highestLocationID);
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
    if (highestReportLocation && locations.length > 0) {
      const location = locations.find(loc => loc.locationID === highestReportLocation);
      
      if (location && location.coordinates) {
        const { coordinates } = location; 
        const map = tt.map({
          key: 'oGTNNSBuTvoAlixWgPsrKxwc1vZyRitz', // Replace with your actual TomTom API key
          container: mapRef.current, // Make sure this ref is defined
          center: coordinates,
          zoom: 14,
        });
  
        new tt.Marker().setLngLat(coordinates).addTo(map);
      }
    }
  }, [highestReportLocation, locations]);
  
  const handleViewCompletedReports = () => {
    navigate(`/report`);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-black'>Reports By Location Summary</p>
      </div>

      <div className='mt-4'>
        <h3 className='text-black mb-2'>Location Reports Table</h3>
        <table className='min-w-full bg-white border border-gray-200'>
          <thead>
            <tr>
              <th className='border border-gray-300 px-4 py-2'>Location Name</th>
              <th className='border border-gray-300 px-4 py-2'>Report Count</th>
              <th className='border border-gray-300 px-4 py-2'>Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(location => (
              <tr key={location.locationID}>
                <td className='border border-gray-300 px-4 py-2'>{location.locationName || location.locationID}</td>
                <td className='border border-gray-300 px-4 py-2'>{locationReportCounts[location.locationID] || 0}</td>
                <td className='border border-gray-300 px-4 py-2'>
                  {location.coordinates ? `${location.coordinates[1]}, ${location.coordinates[0]}` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={mapRef} className="w-full h-60 mt-4" /> {/* Map container */}
    </div>
  );
};

export default MapComponent;
