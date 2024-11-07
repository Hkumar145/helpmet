// import React, { useState } from 'react';

// const EquipmentList = ({ equipments, onUpdate, onDelete, onView }) => {
//   const [expandedEquipmentID, setExpandedEquipmentID] = useState(null);

//   const toggleDetails = (equipmentID) => {
//     if (expandedEquipmentID === equipmentID) {
//       setExpandedEquipmentID(null); // Collapse if clicked again
//     } else {
//       setExpandedEquipmentID(equipmentID); // Expand to show details
//     }
//   };

//   return (
//     <div>
//       <table className="min-w-full bg-white">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b-2">Equipment Name</th>
//             <th className="py-2 px-4 border-b-2">Equipment ID</th>
//             <th className="py-2 px-4 border-b-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {equipments.map((equipment) => (
//             <React.Fragment key={equipment.equipmentID}>
//               <tr>
//                 <td className="py-2 px-4 border-b">{equipment.equipmentName}</td>
//                 <td className="py-2 px-4 border-b">{equipment.equipmentID}</td>
//                 <td className="py-2 px-4 border-b">
//                   <button
//                     onClick={() => toggleDetails(equipment.equipmentID)}
//                     className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
//                   >
//                     {expandedEquipmentID === equipment.equipmentID ? 'Hide' : 'View'}
//                   </button>
//                   {/* <button
//                     onClick={() => onUpdate(equipment)}
//                     className="bg-green-500 text-white px-4 py-1 rounded mr-2"
//                   >
//                     Update
//                   </button> */}
//                   <button onClick={() => onUpdate(equipment)} className="bg-green-500 text-white px-4 py-1 rounded mr-2">
//                     Edit
//                 </button>
//                   <button
//                     onClick={() => onDelete(equipment.equipmentID)}
//                     className="bg-red-500 text-white px-4 py-1 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>

//               {/* Show details below if this equipment is expanded */}
//               {expandedEquipmentID === equipment.equipmentID && (
//                 <tr>
//                   <td colSpan="3" className="bg-gray-100 p-4">
//                     <p><strong>Name:</strong> {equipment.equipmentName}</p>
//                     <p><strong>ID:</strong> {equipment.equipmentID}</p>
//                     <p><strong>Location ID:</strong> {equipment.locationID || 'N/A'}</p>
//                     <p><strong>Status:</strong> {equipment.status}</p>
//                     <p><strong>Inspection Interval:</strong> {equipment.inspectionInterval} days</p>
//                     <p><strong>Description:</strong> {equipment.description}</p>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EquipmentList;



import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const EquipmentList = ({ equipments, onView, onUpdate, onDelete }) => {
  const [expandedEquipmentID, setExpandedEquipmentID] = useState(null);
  const [updatedEquipments, setUpdatedEquipments] = useState([]);

  // Calculate if inspection is due and add a warning flag
  useEffect(() => {
    const calculateInspectionWarnings = () => {
      const currentDate = new Date();
      const updatedList = equipments.map((equipment) => {
        const inspectionDate = new Date(equipment.inspectionDate);
        const inspectionInterval = equipment.inspectionInterval;
        const nextInspectionDate = new Date(inspectionDate);
        nextInspectionDate.setDate(inspectionDate.getDate() + inspectionInterval);

        if (currentDate > nextInspectionDate) {
          return { ...equipment, isInspectionDue: true };
        } else {
          return { ...equipment, isInspectionDue: false };
        }
      });
      setUpdatedEquipments(updatedList);
    };

    calculateInspectionWarnings();
  }, [equipments]);

  // Function to format date in dd/mm/yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleDetails = (equipmentID) => {
    if (expandedEquipmentID === equipmentID) {
      setExpandedEquipmentID(null); // Collapse if clicked again
    } else {
      setExpandedEquipmentID(equipmentID); // Expand to show details
    }
  };

  const handleUpdate = (equipment) => {
    setExpandedEquipmentID(null); // Clear the expanded details when navigating to update
    onUpdate(equipment);
  };

  const handleCloseUpdate = () => {
    setExpandedEquipmentID(null); // Ensure no details are shown when closing update
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', color: '#333' }}
        className="equipment-table"
      >
        <thead>
          <tr style={{ backgroundColor: '#f8f8f8', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Equipment Name</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Equipment ID</th>
            <th
              style={{ padding: '12px', borderBottom: '1px solid #ddd' }}
              className="hide-on-mobile"
            >
              Status
            </th>
            <th
              style={{ padding: '12px', borderBottom: '1px solid #ddd' }}
              className="hide-on-mobile"
            >
              Inspection Date
            </th>
            <th
              style={{ padding: '12px', borderBottom: '1px solid #ddd' }}
              className="hide-on-mobile"
            >
              Inspection Interval
            </th>
            <th
              style={{ padding: '12px', borderBottom: '1px solid #ddd' }}
              className="hide-on-mobile"
            >
              Inspected By
            </th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {updatedEquipments.map((equipment) => (
            <React.Fragment key={equipment.equipmentID}>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>
                  {equipment.isInspectionDue && (
                    <FaExclamationTriangle color="red" style={{ marginRight: '8px' }} />
                  )}
                  {equipment.equipmentName}
                </td>
                <td style={{ padding: '12px' }}>{equipment.equipmentID}</td>
                <td
                  style={{ padding: '12px', color: equipment.status === 'Out of Order' ? 'red' : 'green' }}
                  className="hide-on-mobile"
                >
                  {equipment.status}
                </td>
                <td style={{ padding: '12px' }} className="hide-on-mobile">
                  {formatDate(equipment.inspectionDate)}
                </td>
                <td style={{ padding: '12px' }} className="hide-on-mobile">
                  {equipment.inspectionInterval} days
                </td>
                <td style={{ padding: '12px' }} className="hide-on-mobile">
                  {equipment.inspectedBy}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => toggleDetails(equipment.equipmentID)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                    <FaEye color="#4CAF50" />
                  </button>
                  <button onClick={() => handleUpdate(equipment)} style={{ marginRight: '10px', cursor: 'pointer' }}>
                    <FaEdit color="#FFC107" />
                  </button>
                  <button onClick={() => onDelete(equipment.equipmentID)} style={{ cursor: 'pointer' }}>
                    <FaTrash color="#F44336" />
                  </button>
                </td>
              </tr>
              {expandedEquipmentID === equipment.equipmentID && (
                <tr>
                  <td colSpan="7" style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>
                    <p><strong>Name:</strong> {equipment.equipmentName}</p>
                    <p><strong>ID:</strong> {equipment.equipmentID}</p>
                    <p><strong>Status:</strong> {equipment.status}</p>
                    <p><strong>Inspection Date:</strong> {formatDate(equipment.inspectionDate)}</p>
                    <p><strong>Inspection Interval:</strong> {equipment.inspectionInterval} days</p>
                    <p><strong>Inspected By:</strong> {equipment.inspectedBy}</p>
                    <p><strong>Description:</strong> {equipment.description}</p>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        @media (max-width: 768px) {
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default EquipmentList;
