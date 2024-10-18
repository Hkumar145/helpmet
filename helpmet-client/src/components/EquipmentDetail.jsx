import React, { useState } from 'react';

const EquipmentDetail = ({ equipment, onSave, onCancel }) => {
  const [equipmentDetail, setEquipmentDetail] = useState(equipment);

  const handleCheckboxChange = (field) => {
    setEquipmentDetail({
      ...equipmentDetail,
      [field]: !equipmentDetail[field],
    });
  };

  const saveChanges = (e) => {
    e.preventDefault();
    onSave(equipmentDetail);
  };

  return (
    <form onSubmit={saveChanges} className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Equipment</h2>
      <div className="mb-4">
        <p><strong>Equipment Name:</strong> {equipmentDetail.equipmentName}</p>
        <p><strong>ID:</strong> {equipmentDetail.equipmentID}</p>
      </div>
      <label className="block mb-2">
        <input
          type="checkbox"
          checked={equipmentDetail.inspected || false}
          onChange={() => handleCheckboxChange('inspected')}
        />
        Inspected
      </label>
      <label className="block mb-2">
        <input
          type="checkbox"
          checked={equipmentDetail.safe || false}
          onChange={() => handleCheckboxChange('safe')}
        />
        Safe
      </label>
      <label className="block mb-2">
        <input
          type="checkbox"
          checked={equipmentDetail.needsMaintenance || false}
          onChange={() => handleCheckboxChange('needsMaintenance')}
        />
        Needs Maintenance
      </label>
      <div className="mt-4 flex space-x-2">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </form>
  );
};

export default EquipmentDetail;
