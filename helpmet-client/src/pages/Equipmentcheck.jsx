import React, { useState, useEffect } from 'react';
import axios from '@/api/axios';

const EquipmentCheck = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // Toggle state for the form

  // State to manage new equipment input fields
  const [newEquipment, setNewEquipment] = useState({
    equipmentName: '',
    equipmentID: '',
    locationID: '',
    inspectionDate: '',
    status: '',
    description: '',
  });

  // State to track the checklist for each equipment
  const [checklist, setChecklist] = useState({});
  const [updateEnabled, setUpdateEnabled] = useState({}); // Track when to enable the update button for each equipment

  // Fetch data from backend API
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await axios.get('http://localhost:5001/equipments'); // Adjust your API URL
        setEquipments(response.data);
      } catch (error) {
        setError('Error fetching equipments: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  
  // Function to delete an equipment
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/equipments/${id}`); // Adjust your API URL
      setEquipments(equipments.filter((equipment) => equipment._id !== id));
    } catch (error) {
      setError('Error deleting equipment: ' + error.message);
    }
  };


  

  // Function to handle input changes for the "Add New Equipment" form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle the form submission for adding new equipment
  const handleAddEquipment = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      const response = await axios.post('http://localhost:5001/equipments', newEquipment); // Adjust API URL

      // Update the equipment list in the state by adding the newly created equipment
      setEquipments([...equipments, response.data]);

      // Clear the form after successful submission
      setNewEquipment({
        equipmentName: '',
        equipmentID: '',
        locationID: '',
        inspectionDate: '',
        status: '',
        description: '',
      });

      // Hide the form after adding new equipment
      setShowForm(false);
    } catch (error) {
      setError('Error adding equipment: ' + error.message);
    }
  };

  // Handle checklist changes
  const handleChecklistChange = (id, field) => {
    setChecklist((prevChecklist) => ({
      ...prevChecklist,
      [id]: {
        ...prevChecklist[id],
        [field]: !prevChecklist[id]?.[field] || false,
      },
    }));

    // Enable the "Update" button when any checkbox is ticked
    setUpdateEnabled((prevUpdate) => ({
      ...prevUpdate,
      [id]: true,
    }));
  };

  // Handle update function when the "Update" button is clicked
  const handleUpdate = async (id) => {
    try {
      const updatedEquipment = {
        ...equipments.find((equipment) => equipment._id === id),
        checklist: checklist[id], // Send the updated checklist data
      };

      // Send the updated equipment data to the server
      const response = await axios.put(`http://localhost:5001/equipments/${id}`, updatedEquipment);

      // Update the equipment list with the new data
      setEquipments(
        equipments.map((equipment) =>
          equipment._id === id ? { ...equipment, checklist: response.data.checklist } : equipment
        )
      );

      // Disable the update button after successful update
      setUpdateEnabled((prevUpdate) => ({
        ...prevUpdate,
        [id]: false,
      }));
    } catch (error) {
      setError('Error updating equipment: ' + error.message);
    }
  };

  if (loading) return <p className="text-white text-center">Loading equipment data...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      {/* Add Equipment Button */}
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded mb-6 hover:bg-blue-600 transition"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Close Form' : 'Add New Equipment'}
      </button>

      {/* Add New Equipment Form */}
      {showForm && (
        <form
          onSubmit={handleAddEquipment}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-6 transition"
        >
          <h2 className="text-center text-xl mb-4">Add New Equipment</h2>
          <input
            type="text"
            name="equipmentName"
            placeholder="Equipment Name"
            value={newEquipment.equipmentName}
            onChange={handleInputChange}
            className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
            required
          />
          <input
            type="text"
            name="equipmentID"
            placeholder="Equipment ID"
            value={newEquipment.equipmentID}
            onChange={handleInputChange}
            className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
            required
          />
          <input
            type="text"
            name="locationID"
            placeholder="Location ID"
            value={newEquipment.locationID}
            onChange={handleInputChange}
            className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
            required
          />
          <input
            type="date"
            name="inspectionDate"
            value={newEquipment.inspectionDate}
            onChange={handleInputChange}
            className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
            required
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={newEquipment.status}
            onChange={handleInputChange}
            className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newEquipment.description}
            onChange={handleInputChange}
            className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
            required
          />
          <button
            type="submit"
            className="w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Equipment
          </button>
        </form>
      )}

      {/* Equipment List */}
      <h1 className="text-center text-2xl mb-4">Equipment List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {equipments.length > 0 ? (
          equipments.map((equipment) => (
            <div
              key={equipment._id}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-md border border-gray-600"
            >
              <h3 className="text-lg mb-2">{equipment.equipmentName}</h3>
              <p><strong>ID:</strong> {equipment.equipmentID}</p>
              <p><strong>Location:</strong> {equipment.locationID}</p>
              <p><strong>Inspection Date:</strong> {equipment.inspectionDate}</p>
              <p><strong>Status:</strong> {equipment.status}</p>
              <p><strong>Description:</strong> {equipment.description}</p>

              {/* Checklist */}
              <div className="mt-4">
                <label className="block">
                  <input
                    type="checkbox"
                    checked={checklist[equipment._id]?.inspected || false}
                    onChange={() => handleChecklistChange(equipment._id, 'inspected')}
                  />
                  Inspected
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    checked={checklist[equipment._id]?.safe || false}
                    onChange={() => handleChecklistChange(equipment._id, 'safe')}
                  />
                  Safe
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    checked={checklist[equipment._id]?.needsMaintenance || false}
                    onChange={() => handleChecklistChange(equipment._id, 'needsMaintenance')}
                  />
                  Needs Maintenance
                </label>
              </div>

              {/* Update and Delete Buttons */}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleUpdate(equipment._id)}
                  className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                    updateEnabled[equipment._id] ? '' : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!updateEnabled[equipment._id]} // Disable if no changes
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(equipment._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-full">No equipment data available.</p>
        )}
      </div>
    </div>
  );
};

export default EquipmentCheck;
