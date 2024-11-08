import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import EquipmentList from '../components/EquipmentList';
import CreateEquipment from '../components/CreateEquipment';
import UpdateEquipment from '../components/UpdateEquipment';
import EquipmentDetail from '../components/EquipmentDetail';

const companyID = 100001;

const EquipmentCheck = () => {
  const [equipments, setEquipments] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  const fetchEquipments = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/equipments`);
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setError('Error fetching equipment');
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleUpdateEquipment = async (updatedEquipment) => {
    try {
      const response = await axios.put(`http://localhost:5001/equipments/${updatedEquipment.equipmentID}`, updatedEquipment);

      if (response.status === 200) {
        setEquipments((prevEquipments) =>
          prevEquipments.map((equipment) =>
            equipment.equipmentID === updatedEquipment.equipmentID ? updatedEquipment : equipment
          )
        );
        setIsUpdateDialogOpen(false);
        setViewMode('list');
      } else {
        console.error('Failed to update equipment:', response.statusText);
        setError('Error updating equipment');
      }
    } catch (error) {
      console.error('Error updating equipment:', error.message);
      setError('Error updating equipment: ' + error.message);
    }
  };

  const handleAddNewEquipment = () => {
    setSelectedEquipment(null);
    setIsDialogOpen(true);
  };

  const handleSaveEquipment = () => {
    fetchEquipments();
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setIsUpdateDialogOpen(false);
  };

  const handleDeleteEquipment = async (equipmentID) => {
    try {
      const response = await axios.delete(`http://localhost:5001/companies/${companyID}/equipments/${equipmentID}`);
      if (response.status === 200) {
        fetchEquipments();
      } else {
        console.error('Failed to delete equipment:', response.statusText);
        setError('Error deleting equipment');
      }
    } catch (error) {
      console.error('Error deleting equipment:', error);
      setError('Error deleting equipment');
    }
  };

  const handleViewEquipment = async (equipmentID) => {
    try {
      const response = await axios.get(`http://localhost:5001/equipments/${equipmentID}`);
      if (response.status === 200) {
        setSelectedEquipment(response.data);
      } else {
        console.error('Failed to fetch equipment details:', response.statusText);
        setError('Error fetching equipment details');
      }
    } catch (error) {
      console.error('Error fetching equipment details:', error);
      setError('Error fetching equipment details');
    }
  };

  const handleEditEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full lg:w-3/4">
      <div className="flex flex-col sm:flex-row items-center justify-between sm:gap-6">
        <h1 className="text-black text-[32px] font-bold">Equipment Check</h1>
        <button
          className="bg-brand40 text-white px-5 rounded text-[16px] font-semibold mt-0 hover-button"
          onClick={handleAddNewEquipment}
        >
          Add New Equipment
        </button>
      </div>
      {viewMode === 'list' ? (
        <div className="max-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <EquipmentList
            equipments={equipments}
            onUpdate={handleEditEquipment}
            onDelete={handleDeleteEquipment}
            onView={handleViewEquipment}
            striped
          />
          {selectedEquipment && (
            <EquipmentDetail
              equipment={selectedEquipment}
              onClose={() => setSelectedEquipment(null)}
              onSave={fetchEquipments}
            />
          )}
        </div>
      ) : null}

      {/* Create Equipment Dialog */}
      <CreateEquipment
        isOpen={isDialogOpen}
        onSave={handleSaveEquipment}
        onCancel={handleCancel}
      />

      {/* Update Equipment Dialog */}
      <UpdateEquipment
        isOpen={isUpdateDialogOpen}
        equipment={selectedEquipment}
        onSave={handleUpdateEquipment}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EquipmentCheck; 