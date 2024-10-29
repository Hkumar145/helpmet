import React from 'react';

const EquipmentDetail = ({ equipment, onClose }) => {
  if (!equipment) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Equipment Details</h2>
      <p><strong>Name:</strong> {equipment.equipmentName}</p>
      <p><strong>ID:</strong> {equipment.equipmentID}</p>
      <p><strong>Location ID:</strong> {equipment.locationID}</p>
      <p><strong>Status:</strong> {equipment.status}</p>
      <p><strong>Inspection Interval:</strong> {equipment.inspectionInterval} days</p>
      <p><strong>Description:</strong> {equipment.description}</p>
      <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Close</button>
    </div>
  );
};

export default EquipmentDetail;


// import React from 'react';

// const EquipmentDetail = ({ equipment, onClose }) => {
//   return (
//     <div className="equipment-detail">
//       <h2>Equipment Details</h2>
//       <p><strong>Equipment Name:</strong> {equipment.equipmentName}</p>
//       <p><strong>Equipment ID:</strong> {equipment.equipmentID}</p>
//       <p><strong>Status:</strong> {equipment.status}</p>
//       <p><strong>Description:</strong> {equipment.description}</p>
//       <p><strong>Last Inspection Date:</strong> {equipment.inspectionDate}</p>
//       <p><strong>Inspection Interval (Days):</strong> {equipment.inspectionInterval}</p>
//       <p><strong>Inspected By (Employee ID):</strong> {equipment.inspectedBy}</p>

//       {equipment.image && (
//         <div>
//           <p><strong>Image:</strong></p>
//           <img src={equipment.image} alt={equipment.equipmentName} style={{ maxWidth: '300px' }} />
//         </div>
//       )}

//       <button onClick={onClose}>Close</button>
//     </div>
//   );
// };

// export default EquipmentDetail;
