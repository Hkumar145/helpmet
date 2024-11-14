import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import EquipmentList from "../components/EquipmentList";
import CreateEquipment from "../components/CreateEquipment";
import UpdateEquipment from "../components/UpdateEquipment";
import EquipmentDetail from "../components/EquipmentDetail";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const companyID = 100001;

const EquipmentCheck = () => {
  const [equipments, setEquipments] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  const fetchEquipments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/companies/${companyID}/equipments`
      );
      setEquipments(response.data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleUpdateEquipment = async (updatedEquipment) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/equipments/${updatedEquipment.equipmentID}`,
        updatedEquipment
      );

      if (response.status === 200) {
        setEquipments((prevEquipments) =>
          prevEquipments.map((equipment) =>
            equipment.equipmentID === updatedEquipment.equipmentID
              ? updatedEquipment
              : equipment
          )
        );
        setIsUpdateDialogOpen(false);
        setViewMode("list");
        toast.success("Equipment updated successfully.", {
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
        });
      } else {
        console.error("Failed to update equipment:", response.statusText);
        toast.error("Error updating equipment", {
          className: "custom-toast-error",
          bodyClassName: "custom-toast-body",
        });
      }
    } catch (error) {
      console.error("Error updating equipment:", error.message);
      toast.error(`Error updating equipment: ${error.message}`, {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    }
  };

  const handleAddNewEquipment = () => {
    setSelectedEquipment(null);
    setIsDialogOpen(true);
  };

  const handleSaveEquipment = () => {
    fetchEquipments();
    setIsDialogOpen(false);
    toast.success("Equipment created successfully.", {
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
    });
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setIsUpdateDialogOpen(false);
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteRequest = (equipmentID) => {
    setEquipmentToDelete(equipmentID);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/companies/${companyID}/equipments/${equipmentToDelete}`
      );
      if (response.status === 200) {
        fetchEquipments();
        toast.success("Equipment deleted successfully.", {
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
        });
      } else {
        console.error("Failed to delete equipment:", response.statusText);
        toast.error("Error deleting equipment", {
          className: "custom-toast-error",
          bodyClassName: "custom-toast-body",
        });
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Error deleting equipment", {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    } finally {
      setIsDeleteConfirmOpen(false);
      setEquipmentToDelete(null);
    }
  };

  const handleViewEquipment = async (equipmentID) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/equipments/${equipmentID}`
      );
      if (response.status === 200) {
        setSelectedEquipment(response.data);
      } else {
        console.error("Failed to fetch equipment details:", response.statusText);
        toast.error("Error fetching equipment details", {
          className: "custom-toast-error",
          bodyClassName: "custom-toast-body",
        });
      }
    } catch (error) {
      console.error("Error fetching equipment details:", error);
      toast.error("Error fetching equipment details", {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    }
  };

  const handleEditEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row items-center justify-between sm:gap-6">
        <h1 className="text-black text-[32px] font-bold">Equipment Check</h1>
        <button
          className="bg-brand40 text-white px-5 rounded text-[16px] font-semibold mt-0 hover-button"
          onClick={handleAddNewEquipment}
        >
          Add New Equipment
        </button>
      </div>
      {viewMode === "list" ? (
        <div className="max-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <EquipmentList
            equipments={equipments}
            onUpdate={handleEditEquipment}
            onDelete={handleDeleteRequest} // Open confirmation dialog before delete
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

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this equipment?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-xs rounded border hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded text-xs hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentCheck;
