import React, { useState, useEffect } from 'react';

const UpdateEquipment = ({ equipment, onSave, onCancel }) => {
  const [updatedEquipment, setUpdatedEquipment] = useState(equipment);

  useEffect(() => {
    if (equipment) {
      setUpdatedEquipment(equipment);
    }
  }, [equipment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEquipment({ ...updatedEquipment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(updatedEquipment);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Update Equipment</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Equipment Name</label>
        <input
          type="text"
          name="equipmentName"
          value={updatedEquipment.equipmentName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Equipment ID</label>
        <input
          type="text"
          name="equipmentID"
          value={updatedEquipment.equipmentID}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Location ID</label>
        <input
          type="text"
          name="locationID"
          value={updatedEquipment.locationID}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Inspection Interval (days)</label>
        <input
          type="number"
          name="inspectionInterval"
          value={updatedEquipment.inspectionInterval}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
        <select
          name="status"
          value={updatedEquipment.status}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="Good">Good</option>
          <option value="Needs Maintenance">Needs Maintenance</option>
          <option value="Out of Service">Out of Service</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <textarea
          name="description"
          value={updatedEquipment.description}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={onCancel} className="mr-4 bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default UpdateEquipment;
