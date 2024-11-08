// import React, { useState, useEffect } from 'react';
// import { Pie } from 'react-chartjs-2';
// import axios from '../api/axios';

// const EquipmentStatusPieChart = ({ companyID }) => {
//   const [equipmentData, setEquipmentData] = useState([]);
//   const [statusData, setStatusData] = useState({ labels: [], datasets: [] });
//   const [selectedStatus, setSelectedStatus] = useState(null);
//   const [filteredEquipment, setFilteredEquipment] = useState([]);

//   useEffect(() => {
//     fetchEquipmentData();
//   }, []);

//   const fetchEquipmentData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/equipments`);
//       setEquipmentData(response.data);
//       processStatusData(response.data);
//     } catch (error) {
//       console.error('Error fetching equipment data:', error);
//     }
//   };

//   const processStatusData = (data) => {
//     const statusCounts = data.reduce((acc, equipment) => {
//       acc[equipment.status] = (acc[equipment.status] || 0) + 1;
//       return acc;
//     }, {});

//     const labels = Object.keys(statusCounts);
//     const counts = Object.values(statusCounts);

//     setStatusData({
//       labels,
//       datasets: [
//         {
//           data: counts,
//           backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
//           hoverBackgroundColor: ['#66BB6A', '#FFD54F', '#E57373'],
//         },
//       ],
//     });
//   };

//   const handlePieClick = (elements) => {
//     if (elements.length > 0) {
//       const index = elements[0].index;
//       const status = statusData.labels[index];
//       setSelectedStatus(status);
//       filterEquipmentByStatus(status);
//     }
//   };

//   const filterEquipmentByStatus = (status) => {
//     const filtered = equipmentData.filter((equipment) => equipment.status === status);
//     setFilteredEquipment(filtered);
//   };

//   return (
//     <div className="w-full max-w-lg mx-auto">
//       <h3 className="text-center text-xl font-semibold mb-4">Equipment Status</h3>
//       <div className="relative h-64 w-64 mx-auto">
//         <Pie
//           data={statusData}
//           options={{
//             responsive: true,
//             maintainAspectRatio: false,
//             onClick: (e, elements) => handlePieClick(elements),
//             plugins: {
//               legend: {
//                 position: 'bottom',
//               },
//             },
//           }}
//         />
//       </div>

//       {selectedStatus && (
//         <div className="mt-8 overflow-x-auto">
//           <h4 className="text-lg font-semibold mb-2">Equipment with Status: {selectedStatus}</h4>
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 border">Equipment ID</th>
//                 <th className="px-4 py-2 border">Equipment Name</th>
//                 <th className="px-4 py-2 border">Location ID</th>
//                 <th className="px-4 py-2 border">Inspection Date</th>
//                 <th className="px-4 py-2 border">Inspected By</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredEquipment.map((equipment) => (
//                 <tr key={equipment.equipmentID} className="border-t">
//                   <td className="px-4 py-2 border">{equipment.equipmentID}</td>
//                   <td className="px-4 py-2 border">{equipment.equipmentName}</td>
//                   <td className="px-4 py-2 border">{equipment.locationID}</td>
//                   <td className="px-4 py-2 border">{new Date(equipment.inspectionDate).toLocaleDateString()}</td>
//                   <td className="px-4 py-2 border">{equipment.inspectedBy}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EquipmentStatusPieChart;



import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from '../api/axios';

const EquipmentStatusPieChart = ({ companyID }) => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [statusData, setStatusData] = useState({ labels: [], datasets: [] });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filteredEquipment, setFilteredEquipment] = useState([]);

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/equipments`);
      setEquipmentData(response.data);
      processStatusData(response.data);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };

  const processStatusData = (data) => {
    const statusCounts = data.reduce((acc, equipment) => {
      acc[equipment.status] = (acc[equipment.status] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCounts);
    const counts = Object.values(statusCounts);

    setStatusData({
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: ['#B0B0B0', '#A0A0A0', '#909090'], // Shades of grey for different statuses
          hoverBackgroundColor: ['#C0C0C0', '#B0B0B0', '#A0A0A0'], // Hover colors for shades of grey
        },
      ],
    });
  };

  const handlePieClick = (elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const status = statusData.labels[index];
      setSelectedStatus(status);
      filterEquipmentByStatus(status);
    }
  };

  const filterEquipmentByStatus = (status) => {
    const filtered = equipmentData.filter((equipment) => equipment.status === status);
    setFilteredEquipment(filtered);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-center text-2xl font-semibold mb-4">Equipment Status</h3>
      <div className="relative h-64 w-64 mx-auto">
        <Pie
          data={statusData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            onClick: (e, elements) => handlePieClick(elements),
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          }}
        />
      </div>

      {selectedStatus && (
        <div className="mt-8 overflow-x-auto">
          <h4 className="text-lg font-semibold mb-2">Equipment with Status: {selectedStatus}</h4>
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Equipment ID</th>
                <th className="px-4 py-2 border">Equipment Name</th>
                <th className="px-4 py-2 border">Location ID</th>
                <th className="px-4 py-2 border">Inspection Date</th>
                <th className="px-4 py-2 border">Inspected By</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((equipment, index) => (
                <tr key={equipment.equipmentID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td className="px-4 py-2 border">{equipment.equipmentID}</td>
                  <td className="px-4 py-2 border">{equipment.equipmentName}</td>
                  <td className="px-4 py-2 border">{equipment.locationID}</td>
                  <td className="px-4 py-2 border">{new Date(equipment.inspectionDate).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-2 border">{equipment.inspectedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EquipmentStatusPieChart;
