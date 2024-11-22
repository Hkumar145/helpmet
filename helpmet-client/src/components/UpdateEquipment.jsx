// // import React, { useState, useEffect } from 'react';
// // import axios from '../api/axios';
// // import * as DialogPrimitive from '@radix-ui/react-dialog';
// // import { useSelector } from 'react-redux'

// // const UpdateEquipment = ({ isOpen, equipment, onSave, onCancel }) => {
// //   const [equipmentName, setEquipmentName] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [locationID, setLocationID] = useState('');
// //   const [inspectionDate, setInspectionDate] = useState('');
// //   const [inspectionInterval, setInspectionInterval] = useState('');
// //   const [inspectedBy, setInspectedBy] = useState('');
// //   const [status, setStatus] = useState('Good');
// //   const [isChecked, setIsChecked] = useState(false);
// //   const [employees, setEmployees] = useState([]);
// //   const [locations, setLocations] = useState([]);
// //   const companyID = useSelector((state) => state.user.currentUser?.companyID);
  

// //   useEffect(() => {
// //     if (equipment) {
// //       setEquipmentName(equipment.equipmentName);
// //       setDescription(equipment.description);
// //       setLocationID(equipment.locationID);
// //       setInspectionDate(equipment.inspectionDate);
// //       setInspectionInterval(equipment.inspectionInterval);
// //       setInspectedBy(equipment.inspectedBy);
// //       setStatus(equipment.status);
// //       setIsChecked(equipment.isChecked);
// //     }

// //     fetchEmployees();
// //     fetchLocations();
// //   }, [equipment]);

// //   const fetchEmployees = async () => {
// //     try {
// //       const response = await axios.get(`http://localhost:5001/companies/${companyID}/employees`);
// //       setEmployees(response.data);
// //     } catch (error) {
// //       console.error('Error fetching employees:', error);
// //     }
// //   };

// //   const fetchLocations = async () => {
// //     try {
// //       const response = await axios.get(`http://localhost:5001/companies/${companyID}/locations`);
// //       setLocations(response.data);
// //     } catch (error) {
// //       console.error('Error fetching locations:', error);
// //     }
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     const updatedEquipment = {
// //       ...equipment,
// //       equipmentName,
// //       description,
// //       locationID,
// //       inspectionDate,
// //       inspectionInterval,
// //       inspectedBy,
// //       status,
// //       isChecked,
// //     };
// //     onSave(updatedEquipment);
// //   };

// //   return (
// //     <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
// //       {/* Overlay with a dark background */}
// //       <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      
// //       {/* Dialog Content */}
// //       <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
// //         <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
// //           <h2 className="text-2xl font-semibold mb-4 text-center">Update Equipment</h2>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             {/* Equipment Name */}
// //             <div className="flex flex-col">
// //               <label className="text-gray-600">Equipment Name</label>
// //               <input
// //                 type="text"
// //                 value={equipmentName}
// //                 onChange={(e) => setEquipmentName(e.target.value)}
// //                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
// //                 placeholder="Enter equipment name"
// //                 required
// //               />
// //             </div>

// //             {/* Description */}
// //             <div className="flex flex-col">
// //               <label className="text-gray-600">Description</label>
// //               <textarea
// //                 value={description}
// //                 onChange={(e) => setDescription(e.target.value)}
// //                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
// //                 placeholder="Enter equipment description"
// //                 rows="2"
// //                 required
// //               ></textarea>
// //             </div>

// //             {/* Location and Status in one row, stacks vertically in mobile view */}
// //             <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
// //               <div className="flex flex-col md:w-1/2">
// //                 <label className="text-gray-600">Location</label>
// //                 <select
// //                   value={locationID}
// //                   onChange={(e) => setLocationID(e.target.value)}
// //                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
// //                   required
// //                 >
// //                   <option value="">Select Location</option>
// //                   {locations.map((location) => (
// //                     <option key={location.locationID} value={location.locationID}>
// //                       {location.locationName}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div className="flex flex-col md:w-1/2">
// //                 <label className="text-gray-600">Status</label>
// //                 <select
// //                   value={status}
// //                   onChange={(e) => setStatus(e.target.value)}
// //                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
// //                 >
// //                   <option value="Good">Good</option>
// //                   <option value="Needs Maintenance">Needs Maintenance</option>
// //                   <option value="Out of Service">Out of Service</option>
// //                 </select>
// //               </div>
// //             </div>

// //             {/* Inspection Date and Interval, stacks vertically in mobile view */}
// //             <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
// //               <div className="flex flex-col md:w-1/2">
// //                 <label className="text-gray-600">Inspection Date</label>
// //                 <input
// //                   type="date"
// //                   value={inspectionDate}
// //                   onChange={(e) => setInspectionDate(e.target.value)}
// //                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
// //                   required
// //                 />
// //               </div>
// //               <div className="flex flex-col md:w-1/2">
// //                 <label className="text-gray-600">Inspection Interval (Days)</label>
// //                 <input
// //                   type="number"
// //                   value={inspectionInterval}
// //                   onChange={(e) => setInspectionInterval(e.target.value)}
// //                   placeholder="Enter interval"
// //                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
// //                   required
// //                 />
// //               </div>
// //             </div>

// //             {/* Inspected By */}
// //             <div className="flex flex-col">
// //               <label className="text-gray-600">Inspected By</label>
// //               <select
// //                 value={inspectedBy}
// //                 onChange={(e) => setInspectedBy(e.target.value)}
// //                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
// //                 required
// //               >
// //                 <option value="">Select Employee</option>
// //                 {employees.map((employee) => (
// //                   <option key={employee.employeeID} value={employee.employeeID}>
// //                     {employee.firstName} {employee.lastName} ({employee.role})
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Checked */}
// //             <div className="flex items-center mt-4">
// //               <input
// //                 type="checkbox"
// //                 checked={isChecked}
// //                 onChange={(e) => setIsChecked(e.target.checked)}
// //                 className="mr-2 mt-1"
// //               />
// //               <label className="text-gray-600 text-xs">
// //                 By checking this box, I confirm that the information entered is accurate. I understand that any inaccuracies could impact safety and have serious consequences.
// //               </label>
// //             </div>

// //             {/* Buttons */}
// //             <div className="flex flex-row justify-end gap-2 mt-6">
// //               <button
// //                 type="button"
// //                 onClick={onCancel}
// //                 className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="submit"
// //                 className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0 disabled:cursor-not-allowed"
// //               >
// //                 Save Changes
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </DialogPrimitive.Content>
// //     </DialogPrimitive.Root>
// //   );
// // };

// // export default UpdateEquipment;




// import React, { useState, useEffect } from "react";
// import axios from "../api/axios";
// import * as DialogPrimitive from "@radix-ui/react-dialog";
// import { useSelector } from "react-redux";
// import Select from "react-select";
// import DateTimePicker from "react-datetime-picker";
// import "react-datetime-picker/dist/DateTimePicker.css";

// const UpdateEquipment = ({ isOpen, equipment, onSave, onCancel }) => {
//   const [inspectionDate, setInspectionDate] = useState("");
//   const [isChecked, setIsChecked] = useState(false);
//   const [locationID, setLocationID] = useState(null);
//   const [inspectedBy, setInspectedBy] = useState(null);
//   const [locationOptions, setLocationOptions] = useState([]);
//   const [employeeOptions, setEmployeeOptions] = useState([]);
//   const companyID = useSelector((state) => state.user.currentUser?.companyID);

//   useEffect(() => {
//     if (equipment) {
//       // Set default values from the passed equipment object
//       setLocationID({
//         value: equipment.locationID,
//         label: equipment.locationName,
//       });
//       setInspectedBy({
//         value: equipment.inspectedBy,
//         label: `${equipment.inspectedByName} (${equipment.inspectedByRole})`,
//       });
//       setInspectionDate(new Date(equipment.inspectionDate));
//       setIsChecked(equipment.isChecked);
//     }
//     fetchEmployees();
//     fetchLocations();
//   }, [equipment]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5001/companies/${companyID}/employees`
//       );
//       setEmployeeOptions(
//         response.data.map((employee) => ({
//           value: employee.employeeID,
//           label: `${employee.firstName} ${employee.lastName} (${employee.role})`,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5001/companies/${companyID}/locations`
//       );
//       setLocationOptions(
//         response.data.map((location) => ({
//           value: location.locationID,
//           label: location.locationName,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedEquipment = {
//       ...equipment,
//       inspectionDate,
//       isChecked,
//     };
//     onSave(updatedEquipment); // Pass updated object to parent
//   };

//   return (
//     <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
//       <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
//       <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
//         <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
//           <h2 className="text-2xl font-semibold mb-6 text-center">
//             Update Equipment
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Location (Read-Only) */}
//             <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-700 font-medium mb-1">Location</label>
//                 <Select
//                   value={locationID}
//                   isDisabled={true} // Make read-only
//                   options={locationOptions}
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       backgroundColor: "#f3f4f6",
//                       border: "1px solid #E5E7EB",
//                       boxShadow: "none",
//                       padding: "4px",
//                       borderRadius: "8px",
//                     }),
//                   }}
//                 />
//               </div>

//               {/* Status */}
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-700 font-medium mb-1">Status</label>
//                 <p className="border border-gray-300 p-2 rounded-lg bg-gray-100">
//                   {equipment?.status || "N/A"}
//                 </p>
//               </div>
//             </div>

//             {/* Inspection Date */}
//             <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-700 font-medium mb-1">
//                   Inspection Date
//                 </label>
//                 <DateTimePicker
//                   onChange={setInspectionDate}
//                   value={inspectionDate}
//                   required
//                   className="border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
//                   format="y-MM-dd"
//                   disableClock={true}
//                   maxDate={new Date()}
//                 />
//               </div>
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-700 font-medium mb-1">
//                   Inspection Interval (Days)
//                 </label>
//                 <p className="border border-gray-300 p-2 rounded-lg bg-gray-100">
//                   {equipment?.inspectionInterval || "N/A"}
//                 </p>
//               </div>
//             </div>

//             {/* Inspected By (Read-Only) */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-medium mb-1">Inspected By</label>
//               <Select
//                 value={inspectedBy}
//                 isDisabled={true} // Make read-only
//                 options={employeeOptions}
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     backgroundColor: "#f3f4f6",
//                     border: "1px solid #E5E7EB",
//                     boxShadow: "none",
//                     padding: "4px",
//                     borderRadius: "8px",
//                   }),
//                 }}
//               />
//             </div>

//             {/* Checkbox */}
//             <div className="flex items-center mt-4">
//               <input
//                 type="checkbox"
//                 checked={isChecked}
//                 onChange={(e) => setIsChecked(e.target.checked)}
//                 className="mr-2 mt-1 accent-[#4A1FB8]"
//                 style={{ width: "2rem", height: "2rem" }}
//               />
//               <label className="text-gray-500 text-xs">
//                 By checking this box, I confirm that the information entered is
//                 accurate.
//               </label>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-row justify-end gap-2 mt-6">
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0 disabled:cursor-not-allowed"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         </div>
//       </DialogPrimitive.Content>
//     </DialogPrimitive.Root>
//   );
// };

// export default UpdateEquipment;



// import React, { useState, useEffect } from "react";
// import axios from "../api/axios";
// import * as DialogPrimitive from "@radix-ui/react-dialog";
// import { useSelector } from "react-redux";
// import Select from "react-select";
// import DateTimePicker from "react-datetime-picker";
// import "react-datetime-picker/dist/DateTimePicker.css";

// const EditEquipment = ({ isOpen, onSave, onCancel, equipmentData }) => {
//   const [equipmentName, setEquipmentName] = useState("");
//   const [description, setDescription] = useState("");
//   const [locationID, setLocationID] = useState(null);
//   const [inspectionDate, setInspectionDate] = useState("");
//   const [inspectionInterval, setInspectionInterval] = useState("");
//   const [inspectedBy, setInspectedBy] = useState(null);
//   const [status, setStatus] = useState(null);
//   const [isChecked, setIsChecked] = useState(false);
//   const [employeeOptions, setEmployeeOptions] = useState([]);
//   const [locationOptions, setLocationOptions] = useState([]);
//   const companyID = useSelector((state) => state.user.currentUser?.companyID);

//   // Status options
//   const statusOptions = [
//     { value: "Good", label: "Good" },
//     { value: "Needs Maintenance", label: "Needs Maintenance" },
//     { value: "Out of Service", label: "Out of Service" },
//   ];

//   useEffect(() => {
//     fetchEmployees();
//     fetchLocations();
//   }, []);

//   useEffect(() => {
//     if (isOpen && equipmentData) {
//       // Populate fields with existing equipment data
//       setEquipmentName(equipmentData.equipmentName || "");
//       setDescription(equipmentData.description || "");
//       setLocationID(
//         equipmentData.locationID
//           ? {
//               value: equipmentData.locationID,
//               label: equipmentData.locationName,
//             }
//           : null
//       );
//       setInspectionDate(equipmentData.inspectionDate || "");
//       setInspectionInterval(equipmentData.inspectionInterval || "");
//       setInspectedBy(
//         equipmentData.inspectedBy
//           ? {
//               value: equipmentData.inspectedBy,
//               label: `${equipmentData.inspectedByName} (${equipmentData.inspectedByRole})`,
//             }
//           : null
//       );
//       setStatus(
//         equipmentData.status
//           ? { value: equipmentData.status, label: equipmentData.status }
//           : null
//       );
//       setIsChecked(equipmentData.isChecked || false);
//     }
//   }, [isOpen, equipmentData]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5001/companies/${companyID}/employees`
//       );
//       setEmployeeOptions(
//         response.data.map((employee) => ({
//           value: employee.employeeID,
//           label: `${employee.firstName} ${employee.lastName} (${employee.role})`,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5001/companies/${companyID}/locations`
//       );
//       setLocationOptions(
//         response.data.map((location) => ({
//           value: location.locationID,
//           label: location.locationName,
//         }))
//       );
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!equipmentName || equipmentName.trim() === "") {
//       console.error("Equipment Name is required");
//       return;
//     }

//     const updatedEquipment = {
//       equipmentName: equipmentName.trim(),
//       description,
//       locationID: locationID ? locationID.value : "",
//       inspectionDate,
//       inspectionInterval,
//       inspectedBy: inspectedBy ? inspectedBy.value : "",
//       status: status ? status.value : "",
//       isChecked,
//     };

//     try {
//       await axios.put(
//         `http://localhost:5001/companies/${companyID}/equipments/${equipmentData.equipmentID}`,
//         updatedEquipment
//       );
//       onSave();
//     } catch (error) {
//       console.error(
//         "Error updating equipment:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   return (
//     <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
//       <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
//       <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
//         <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
//           <h2 className="text-2xl font-semibold mb-6 text-center">
//             Edit Equipment
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Equipment Name */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-medium mb-1">
//                 Equipment Name
//               </label>
//               <input
//                 type="text"
//                 value={equipmentName}
//                 onChange={(e) => setEquipmentName(e.target.value)}
//                 className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
//                 placeholder="Enter equipment name"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-medium mb-1">Description</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
//                 placeholder="Enter equipment description"
//                 rows="3"
//                 required
//               ></textarea>
//             </div>

//             {/* Location and Status */}
//             <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-700 font-medium mb-1">Location</label>
//                 <Select
//                   options={locationOptions}
//                   value={locationID}
//                   onChange={(selectedOption) => setLocationID(selectedOption)}
//                   placeholder="Select Location"
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       border: "1px solid #E5E7EB",
//                       boxShadow: "none",
//                       "&:hover": { borderColor: "#A855F7" },
//                       padding: "4px",
//                       borderRadius: "8px",
//                     }),
//                     option: (base, { isFocused }) => ({
//                       ...base,
//                       backgroundColor: isFocused ? "#EDE9FE" : "white",
//                       color: "black",
//                     }),
//                   }}
//                 />
//               </div>
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-700 font-medium mb-1">Status</label>
//                 <Select
//                   options={statusOptions}
//                   value={status}
//                   onChange={(selectedOption) => setStatus(selectedOption)}
//                   placeholder="Select Status"
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       border: "1px solid #E5E7EB",
//                       boxShadow: "none",
//                       "&:hover": { borderColor: "#A855F7" },
//                       padding: "4px",
//                       borderRadius: "8px",
//                     }),
//                     option: (base, { isFocused }) => ({
//                       ...base,
//                       backgroundColor: isFocused ? "#EDE9FE" : "white",
//                       color: "black",
//                     }),
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Inspection Date and Interval */}
//             <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-700 font-medium mb-1">
//                   Inspection Date
//                 </label>
//                 <DateTimePicker
//                   onChange={setInspectionDate}
//                   value={inspectionDate}
//                   required
//                   className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
//                   format="y-MM-dd"
//                   disableClock={true}
//                   maxDate={new Date()}
//                 />
//               </div>
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-700 font-medium mb-1">
//                   Inspection Interval (Days)
//                 </label>
//                 <input
//                   type="number"
//                   value={inspectionInterval}
//                   onChange={(e) => setInspectionInterval(e.target.value)}
//                   placeholder="Enter interval"
//                   className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
//                   required
//                   onWheel={(e) => e.target.blur()}
//                 />
//               </div>
//             </div>

//             {/* Inspected By */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-medium mb-1">Inspected By</label>
//               <Select
//                 options={employeeOptions}
//                 value={inspectedBy}
//                 onChange={(selectedOption) => setInspectedBy(selectedOption)}
//                 placeholder="Select Employee"
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     border: "1px solid #E5E7EB",
//                     boxShadow: "none",
//                     "&:hover": { borderColor: "#A855F7" },
//                     padding: "4px",
//                     borderRadius: "8px",
//                   }),
//                   option: (base, { isFocused }) => ({
//                     ...base,
//                     backgroundColor: isFocused ? "#EDE9FE" : "white",
//                     color: "black",
//                   }),
//                 }}
//               />
//             </div>

//             {/* Checked */}
//             <div className="flex mt-4 items-center">
//               <input
//                 type="checkbox"
//                 checked={isChecked}
//                 onChange={(e) => setIsChecked(e.target.checked)}
//                 className="mr-2 mt-1 accent-[#4A1FB8]"
//                 style={{ width: "2rem", height: "2rem" }}
//               />
//               <label className="text-gray-500 text-xs">
//                 By checking this box, I confirm that the information entered is
//                 accurate. I understand that any inaccuracies could impact safety
//                 and have serious consequences.
//               </label>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-row justify-end gap-2 mt-6">
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0 disabled:cursor-not-allowed"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         </div>
//       </DialogPrimitive.Content>
//     </DialogPrimitive.Root>
//   );
// };

// export default EditEquipment;


import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from "react-redux";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

const EditEquipment = ({ isOpen, equipmentData, onSave, onCancel }) => {
  const [equipmentName, setEquipmentName] = useState("");
  const [description, setDescription] = useState("");
  const [locationID, setLocationID] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionInterval, setInspectionInterval] = useState("");
  const [inspectedBy, setInspectedBy] = useState("");
  const [status, setStatus] = useState("Good");
  const [isChecked, setIsChecked] = useState(false); // Always starts unchecked
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  // Status options
  const statusOptions = [
    { value: "Good", label: "Good" },
    { value: "Needs Maintenance", label: "Needs Maintenance" },
    { value: "Out of Service", label: "Out of Service" },
  ];

  // Fetch employees and locations once on component mount
  useEffect(() => {
    fetchEmployees();
    fetchLocations();
  }, []);

  // Set equipment data to form fields when `equipmentData` changes
  useEffect(() => {
    if (equipmentData) {
      setEquipmentName(equipmentData.equipmentName || "");
      setDescription(equipmentData.description || "");
      setLocationID(equipmentData.locationID || "");
      setInspectionDate(equipmentData.inspectionDate || "");
      setInspectionInterval(equipmentData.inspectionInterval || "");
      setInspectedBy(equipmentData.inspectedBy || "");
      setStatus(equipmentData.status || "Good");
      setIsChecked(false); // Checkbox always starts unchecked
    }
  }, [equipmentData]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/companies/${companyID}/employees`
      );
      setEmployeeOptions(
        response.data.map((employee) => ({
          value: employee.employeeID,
          label: `${employee.firstName} ${employee.lastName} (${employee.role})`,
        }))
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/companies/${companyID}/locations`
      );
      setLocationOptions(
        response.data.map((location) => ({
          value: location.locationID,
          label: location.locationName,
        }))
      );
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!equipmentName || equipmentName.trim() === "") {
      console.error("Equipment Name is required");
      return;
    }

    const updatedEquipment = {
      ...equipmentData, // Merge the updated fields with existing data
      equipmentName: equipmentName.trim(),
      description,
      locationID: locationID.value || locationID,
      inspectionDate: inspectionDate ? inspectionDate.toISOString() : "",
      inspectionInterval,
      inspectedBy: inspectedBy.value || inspectedBy,
      status: status.value || status,
      isChecked,
    };

    try {
      await axios.put(
        `http://localhost:5001/companies/${companyID}/equipments/${equipmentData.equipmentID}`,
        updatedEquipment
      );
      onSave();
    } catch (error) {
      console.error(
        "Error updating equipment:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Edit Equipment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Equipment Name */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Equipment Name
              </label>
              <input
                type="text"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                placeholder="Enter equipment name"
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                placeholder="Enter equipment description"
                rows="3"
                required
              ></textarea>
            </div>

            {/* Location and Status */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-gray-700 font-medium mb-1">Location</label>
                <Select
                  options={locationOptions}
                  value={locationOptions.find(
                    (option) => option.value === locationID
                  )}
                  onChange={(selectedOption) => setLocationID(selectedOption)}
                  placeholder="Select Location"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid #E5E7EB",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#A855F7" },
                      padding: "4px",
                      borderRadius: "8px",
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused ? "#EDE9FE" : "white",
                      color: "black",
                    }),
                  }}
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-gray-700 font-medium mb-1">Status</label>
                <Select
                  options={statusOptions}
                  value={statusOptions.find((option) => option.value === status)}
                  onChange={(selectedOption) => setStatus(selectedOption)}
                  placeholder="Select Status"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid #E5E7EB",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#A855F7" },
                      padding: "4px",
                      borderRadius: "8px",
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused ? "#EDE9FE" : "white",
                      color: "black",
                    }),
                  }}
                />
              </div>
            </div>

            {/* Inspection Date and Interval */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-gray-700 font-medium mb-1">
                  Inspection Date
                </label>
                <DateTimePicker
                  onChange={setInspectionDate}
                  value={inspectionDate ? new Date(inspectionDate) : null}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  format="y-MM-dd"
                  disableClock={true}
                  maxDate={new Date()}
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-gray-700 font-medium mb-1">
                  Inspection Interval (Days)
                </label>
                <input
                  type="number"
                  value={inspectionInterval}
                  onChange={(e) => setInspectionInterval(e.target.value)}
                  placeholder="Enter interval"
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                  required
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>

            {/* Inspected By */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Inspected By</label>
              <Select
                options={employeeOptions}
                value={employeeOptions.find((option) => option.value === inspectedBy)}
                onChange={(selectedOption) => setInspectedBy(selectedOption)}
                placeholder="Select Employee"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #E5E7EB",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#A855F7" },
                    padding: "4px",
                    borderRadius: "8px",
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? "#EDE9FE" : "white",
                    color: "black",
                  }),
                }}
              />
            </div>

            {/* Checked */}
            <div className="flex mt-4 items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mr-2 mt-1 accent-[#4A1FB8]"
                style={{ width: "2rem", height: "2rem" }}
              />
              <label className="text-gray-500 text-xs">
                By checking this box, I confirm that the information entered is
                accurate. I understand that any inaccuracies could impact safety
                and have serious consequences.
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-row justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  );
};

export default EditEquipment;
