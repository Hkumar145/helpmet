import React, { useState } from 'react';
import EquipmentDetail from './EquipmentDetail';

const EquipmentList = ({ equipments, onUpdate, onDelete }) => {
  const [expandedEquipmentID, setExpandedEquipmentID] = useState(null);

  const viewDetails = (id) => {
    if (expandedEquipmentID === id) {
      setExpandedEquipmentID(null);
    } else {
      setExpandedEquipmentID(id);
    }
  };

  return (
    <div className="equipment-list">
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
            <React.Fragment key={equipment._id}>
              <tr>
                <td className="py-2 px-4 border-b">{equipment.equipmentName}</td>
                <td className="py-2 px-4 border-b">{equipment.equipmentID}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => viewDetails(equipment._id)} className="mr-2 bg-blue-500 text-white px-4 py-1 rounded">View</button>
                  <button onClick={() => onDelete(equipment._id)} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
                </td>
              </tr>
              {expandedEquipmentID === equipment._id && (
                <tr>
                  <td colSpan="3">
                    <EquipmentDetail
                      equipment={equipment}
                      onSave={(updatedEquipment) => onUpdate(updatedEquipment)}
                      onCancel={() => setExpandedEquipmentID(null)}
                    />
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
