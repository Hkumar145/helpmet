import React, { useState } from 'react';

const CreateEquipment = ({ onSave, onCancel }) => {
  const [newEquipment, setNewEquipment] = useState({
    equipmentName: '',
    equipmentID: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment({ ...newEquipment, [name]: value });
  };

  const saveNewEquipment = (e) => {
    e.preventDefault();
    onSave(newEquipment);
  };

  return (
    <form onSubmit={saveNewEquipment} className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Equipment</h2>
      <input
        type="text"
        name="equipmentName"
        value={newEquipment.equipmentName}
        onChange={handleChange}
        placeholder="Equipment Name"
        className="mb-2 px-4 py-2 border rounded w-full"
        required
      />
      <input
        type="text"
        name="equipmentID"
        value={newEquipment.equipmentID}
        onChange={handleChange}
        placeholder="Equipment ID"
        className="mb-4 px-4 py-2 border rounded w-full"
        required
      />
      <div className="mt-4 flex space-x-2">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </form>
  );
};

export default CreateEquipment;
