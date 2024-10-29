import React, { useState } from 'react';

const EquipmentList = ({ equipments, onUpdate, onDelete, onView }) => {
  const [expandedEquipmentID, setExpandedEquipmentID] = useState(null);

  const toggleDetails = (equipmentID) => {
    if (expandedEquipmentID === equipmentID) {
      setExpandedEquipmentID(null); // Collapse if clicked again
    } else {
      setExpandedEquipmentID(equipmentID); // Expand to show details
    }
  };

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2">Equipment Name</th>
            <th className="py-2 px-4 border-b-2">Equipment ID</th>
            <th className="py-2 px-4 border-b-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map((equipment) => (
            <React.Fragment key={equipment.equipmentID}>
              <tr>
                <td className="py-2 px-4 border-b">{equipment.equipmentName}</td>
                <td className="py-2 px-4 border-b">{equipment.equipmentID}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => toggleDetails(equipment.equipmentID)}
                    className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                  >
                    {expandedEquipmentID === equipment.equipmentID ? 'Hide' : 'View'}
                  </button>
                  {/* <button
                    onClick={() => onUpdate(equipment)}
                    className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                  >
                    Update
                  </button> */}
                  <button onClick={() => onUpdate(equipment)} className="bg-green-500 text-white px-4 py-1 rounded mr-2">
                    Edit
                </button>
                  <button
                    onClick={() => onDelete(equipment.equipmentID)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>

              {/* Show details below if this equipment is expanded */}
              {expandedEquipmentID === equipment.equipmentID && (
                <tr>
                  <td colSpan="3" className="bg-gray-100 p-4">
                    <p><strong>Name:</strong> {equipment.equipmentName}</p>
                    <p><strong>ID:</strong> {equipment.equipmentID}</p>
                    <p><strong>Location ID:</strong> {equipment.locationID || 'N/A'}</p>
                    <p><strong>Status:</strong> {equipment.status}</p>
                    <p><strong>Inspection Interval:</strong> {equipment.inspectionInterval} days</p>
                    <p><strong>Description:</strong> {equipment.description}</p>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentList;
