import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import EquipmentList from "../components/EquipmentList";
import CreateEquipment from "../components/CreateEquipment";
import UpdateEquipment from "../components/UpdateEquipment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import BackToTopButton from "../components/BackToTopButton";

// const companyID = 100001;

const EquipmentCheck = () => {
  const [equipments, setEquipments] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  const fetchEquipments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/companies/${companyID}/equipments`
      );
      setEquipments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      setLoading(false);
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
        toast.error("Error updating equipment", {
          className: "custom-toast-error",
          bodyClassName: "custom-toast-body",
        });
      }
    } catch (error) {
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
    setDeleteDialogOpen(false);
  };

  const openDeleteConfirmation = (equipmentID) => {
    setEquipmentToDelete(equipmentID);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/companies/${companyID}/equipments/${equipmentToDelete}`
      );
      setEquipments((prevEquipments) =>
        prevEquipments.filter(
          (equipment) => equipment.equipmentID !== equipmentToDelete
        )
      );
      toast.success("Equipment deleted successfully.", {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
    } catch (error) {
      toast.error("Error deleting equipment", {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    } finally {
      setDeleteDialogOpen(false);
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
        toast.error("Error fetching equipment details", {
          className: "custom-toast-error",
          bodyClassName: "custom-toast-body",
        });
      }
    } catch (error) {
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
    <div className="w-full flex flex-col gap-4 px-4 lg:px-7 max-w-[2700px]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col sm:flex-row items-center justify-between sm:gap-6">
        <h1 className="text-black text-[32px] font-bold">Equipment Check</h1>
        <button
          className="bg-[#6938EF] text-white px-5 rounded text-[16px] font-semibold mt-0 hover-button"
          onClick={handleAddNewEquipment}
        >
          Add New Equipment
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : (
        viewMode === "list" && (
        <div className="max-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <EquipmentList
            equipments={equipments}
            onUpdate={handleEditEquipment}
            onDelete={openDeleteConfirmation} // Open confirmation dialog before delete
            onView={handleViewEquipment}
            striped
          />
        </div>
        )
      )}

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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this equipment?
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white font-bold hover:bg-red-800 text-xs px-4 py-2 rounded my-0"
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <BackToTopButton />
    </div>
  );
};

export default EquipmentCheck;
