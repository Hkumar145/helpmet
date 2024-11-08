// import React, { useState, useEffect } from 'react';
// import axios from '../api/axios';
// import * as DialogPrimitive from '@radix-ui/react-dialog';

// const CreateEquipment = ({ isOpen, onSave, onCancel }) => {
//   const [equipmentName, setEquipmentName] = useState('');
//   const [description, setDescription] = useState('');
//   const [locationID, setLocationID] = useState('');
//   const [inspectionDate, setInspectionDate] = useState('');
//   const [inspectionInterval, setInspectionInterval] = useState('');
//   const [inspectedBy, setInspectedBy] = useState('');
//   const [status, setStatus] = useState('Good');
//   const [isChecked, setIsChecked] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const companyID = 100001;

//   useEffect(() => {
//     fetchEmployees();
//     fetchLocations();
//   }, []);

//   // Reset form fields when dialog opens
//   useEffect(() => {
//     if (isOpen) {
//       setEquipmentName('');
//       setDescription('');
//       setLocationID('');
//       setInspectionDate('');
//       setInspectionInterval('');
//       setInspectedBy('');
//       setStatus('Good');
//       setIsChecked(false);
//     }
//   }, [isOpen]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/employees`);
//       setEmployees(response.data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/locations`);
//       setLocations(response.data);
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newEquipment = {
//       equipmentName,
//       description,
//       locationID,
//       inspectionDate,
//       inspectionInterval,
//       inspectedBy,
//       status,
//       isChecked,
//     };
//     handleCreateEquipment(newEquipment);
//   };

//   const handleCreateEquipment = async (equipment) => {
//     try {
//       await axios.post(`http://localhost:5001/companies/${companyID}/equipments`, equipment);
//       onSave();
//     } catch (error) {
//       console.error("Error creating equipment:", error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
//       {/* Overlay with a dark background */}
//       <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      
//       {/* Dialog Content */}
//       <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
//         <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
//           <h2 className="text-2xl font-semibold mb-4 text-center">Add New Equipment</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Equipment Name */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Equipment Name</label>
//               <input
//                 type="text"
//                 value={equipmentName}
//                 onChange={(e) => setEquipmentName(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter equipment name"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Description</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter equipment description"
//                 rows="2"
//                 required
//               ></textarea>
//             </div>

//             {/* Location and Status in one row */}
//             <div className="flex space-x-4">
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Location</label>
//                 <select
//                   value={locationID}
//                   onChange={(e) => setLocationID(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 >
//                   <option value="">Select Location</option>
//                   {locations.map((location) => (
//                     <option key={location.locationID} value={location.locationID}>
//                       {location.locationName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Status</label>
//                 <select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="Good">Good</option>
//                   <option value="Needs Maintenance">Needs Maintenance</option>
//                   <option value="Out of Service">Out of Service</option>
//                 </select>
//               </div>
//             </div>

//             {/* Inspection Date and Interval */}
//             <div className="flex space-x-4">
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Inspection Date</label>
//                 <input
//                   type="date"
//                   value={inspectionDate}
//                   onChange={(e) => setInspectionDate(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Inspection Interval (Days)</label>
//                 <input
//                   type="number"
//                   value={inspectionInterval}
//                   onChange={(e) => setInspectionInterval(e.target.value)}
//                   placeholder="Enter interval"
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Inspected By */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Inspected By</label>
//               <select
//                 value={inspectedBy}
//                 onChange={(e) => setInspectedBy(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 required
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((employee) => (
//                   <option key={employee.employeeID} value={employee.employeeID}>
//                     {employee.firstName} {employee.lastName} ({employee.role})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Checked */}
//             <div className="flex items-center mt-4">
//               <input
//                 type="checkbox"
//                 checked={isChecked}
//                 onChange={(e) => setIsChecked(e.target.checked)}
//                 className="mr-2"
//               />
//               <label className="text-gray-600">Checked</label>
//             </div>

//             {/* Buttons */}
//             <div className="flex space-x-4 mt-6 justify-center">
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               >
//                 Close
//               </button>
//               <button
//                 type="submit"
//                 className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
//               >
//                 Add Equipment
//               </button>
//             </div>
//           </form>
//         </div>
//       </DialogPrimitive.Content>
//     </DialogPrimitive.Root>
//   );
// };

// export default CreateEquipment;



// import React, { useState, useEffect } from 'react';
// import axios from '../api/axios';
// import * as DialogPrimitive from '@radix-ui/react-dialog';
// import { Combobox } from '@/components/ui/combobox';
// import Avatar from 'react-avatar';

// const CreateEquipment = ({ isOpen, onSave, onCancel }) => {
//   const [equipmentName, setEquipmentName] = useState('');
//   const [description, setDescription] = useState('');
//   const [locationID, setLocationID] = useState('');
//   const [inspectionDate, setInspectionDate] = useState('');
//   const [inspectionInterval, setInspectionInterval] = useState('');
//   const [inspectedBy, setInspectedBy] = useState('');
//   const [status, setStatus] = useState('Good');
//   const [isChecked, setIsChecked] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const companyID = 100001;

//   useEffect(() => {
//     fetchEmployees();
//     fetchLocations();
//   }, []);

//   // Reset form fields when dialog opens
//   useEffect(() => {
//     if (isOpen) {
//       setEquipmentName('');
//       setDescription('');
//       setLocationID('');
//       setInspectionDate('');
//       setInspectionInterval('');
//       setInspectedBy('');
//       setStatus('Good');
//       setIsChecked(false);
//     }
//   }, [isOpen]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/employees`);
//       setEmployees(response.data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/locations`);
//       setLocations(response.data);
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newEquipment = {
//       equipmentName,
//       description,
//       locationID,
//       inspectionDate,
//       inspectionInterval,
//       inspectedBy,
//       status,
//       isChecked,
//     };
//     handleCreateEquipment(newEquipment);
//   };

//   const handleCreateEquipment = async (equipment) => {
//     try {
//       await axios.post(`http://localhost:5001/companies/${companyID}/equipments`, equipment);
//       onSave();
//     } catch (error) {
//       console.error("Error creating equipment:", error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
//       <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
//       <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
//         <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
//           <h2 className="text-2xl font-semibold mb-4 text-center">Add New Equipment</h2>
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             {/* Equipment Name */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Equipment Name</label>
//               <input
//                 type="text"
//                 value={equipmentName}
//                 onChange={(e) => setEquipmentName(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter equipment name"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Description</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter equipment description"
//                 rows="2"
//                 required
//               ></textarea>
//             </div>

//             {/* Location and Status in one row */}
//             <div className="flex space-x-4">
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Location</label>
//                 <select
//                   value={locationID}
//                   onChange={(e) => setLocationID(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 >
//                   <option value="">Select Location</option>
//                   {locations.map((location) => (
//                     <option key={location.locationID} value={location.locationID}>
//                       {location.locationName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Status</label>
//                 <select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="Good">Good</option>
//                   <option value="Needs Maintenance">Needs Maintenance</option>
//                   <option value="Out of Service">Out of Service</option>
//                 </select>
//               </div>
//             </div>

//             {/* Inspection Date and Interval */}
//             <div className="flex space-x-4">
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Inspection Date</label>
//                 <input
//                   type="date"
//                   value={inspectionDate}
//                   onChange={(e) => setInspectionDate(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Inspection Interval (Days)</label>
//                 <input
//                   type="number"
//                   value={inspectionInterval}
//                   onChange={(e) => setInspectionInterval(e.target.value)}
//                   placeholder="Enter interval"
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Inspected By */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Inspected By</label>
//               <select
//                 value={inspectedBy}
//                 onChange={(e) => setInspectedBy(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 required
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((employee) => (
//                   <option key={employee.employeeID} value={employee.employeeID}>
//                     {employee.firstName} {employee.lastName} ({employee.role})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Checked */}
//             <div className="flex items-center mt-4">
//               <input
//                 type="checkbox"
//                 checked={isChecked}
//                 onChange={(e) => setIsChecked(e.target.checked)}
//                 className="mr-2"
//               />
//               <label className="text-gray-600">Checked</label>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-row justify-between gap-4 mt-6">
//               <DialogPrimitive.Close asChild>
//                 <button
//                   type="button"
//                   className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                 >
//                   Close
//                 </button>
//               </DialogPrimitive.Close>
//               <button
//                 type="submit"
//                 className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
//               >
//                 Add Equipment
//               </button>
//             </div>
//           </form>
//         </div>
//       </DialogPrimitive.Content>
//     </DialogPrimitive.Root>
//   );
// };

// export default CreateEquipment;


// import React, { useState, useEffect } from 'react';
// import axios from '../api/axios';
// import * as DialogPrimitive from '@radix-ui/react-dialog';

// const CreateEquipment = ({ isOpen, onSave, onCancel }) => {
//   const [equipmentName, setEquipmentName] = useState('');
//   const [description, setDescription] = useState('');
//   const [locationID, setLocationID] = useState('');
//   const [inspectionDate, setInspectionDate] = useState('');
//   const [inspectionInterval, setInspectionInterval] = useState('');
//   const [inspectedBy, setInspectedBy] = useState('');
//   const [status, setStatus] = useState('Good');
//   const [isChecked, setIsChecked] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const companyID = 100001;

//   useEffect(() => {
//     fetchEmployees();
//     fetchLocations();
//   }, []);

//   // Reset form fields when dialog opens
//   useEffect(() => {
//     if (isOpen) {
//       setEquipmentName('');
//       setDescription('');
//       setLocationID('');
//       setInspectionDate('');
//       setInspectionInterval('');
//       setInspectedBy('');
//       setStatus('Good');
//       setIsChecked(false);
//     }
//   }, [isOpen]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/employees`);
//       setEmployees(response.data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/locations`);
//       setLocations(response.data);
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newEquipment = {
//       equipmentName,
//       description,
//       locationID,
//       inspectionDate,
//       inspectionInterval,
//       inspectedBy,
//       status,
//       isChecked,
//     };
//     handleCreateEquipment(newEquipment);
//   };

//   const handleCreateEquipment = async (equipment) => {
//     try {
//       await axios.post(`http://localhost:5001/companies/${companyID}/equipments`, equipment);
//       onSave();
//     } catch (error) {
//       console.error("Error creating equipment:", error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
//       {/* Overlay with a dark background */}
//       <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      
//       {/* Dialog Content */}
//       <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
//         <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
//           <h2 className="text-2xl font-semibold mb-4 text-center">Add New Equipment</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Equipment Name */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Equipment Name</label>
//               <input
//                 type="text"
//                 value={equipmentName}
//                 onChange={(e) => setEquipmentName(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter equipment name"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Description</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter equipment description"
//                 rows="2"
//                 required
//               ></textarea>
//             </div>

//             {/* Location and Status in one row */}
//             <div className="flex space-x-4">
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Location</label>
//                 <select
//                   value={locationID}
//                   onChange={(e) => setLocationID(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 >
//                   <option value="">Select Location</option>
//                   {locations.map((location) => (
//                     <option key={location.locationID} value={location.locationID}>
//                       {location.locationName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Status</label>
//                 <select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="Good">Good</option>
//                   <option value="Needs Maintenance">Needs Maintenance</option>
//                   <option value="Out of Service">Out of Service</option>
//                 </select>
//               </div>
//             </div>

//             {/* Inspection Date and Interval */}
//             <div className="flex space-x-4">
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Inspection Date</label>
//                 <input
//                   type="date"
//                   value={inspectionDate}
//                   onChange={(e) => setInspectionDate(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//               <div className="flex flex-col w-1/2">
//                 <label className="text-gray-600">Inspection Interval (Days)</label>
//                 <input
//                   type="number"
//                   value={inspectionInterval}
//                   onChange={(e) => setInspectionInterval(e.target.value)}
//                   placeholder="Enter interval"
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Inspected By */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Inspected By</label>
//               <select
//                 value={inspectedBy}
//                 onChange={(e) => setInspectedBy(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 required
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((employee) => (
//                   <option key={employee.employeeID} value={employee.employeeID}>
//                     {employee.firstName} {employee.lastName} ({employee.role})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Checked */}
//             <div className="flex items-start mt-4">
//               <input
//                 type="checkbox"
//                 checked={isChecked}
//                 onChange={(e) => setIsChecked(e.target.checked)}
//                 className="mr-2 mt-1"
//               />
//               <label className="text-gray-600 text-sm">
//                 By checking this box, I confirm that the information entered is accurate. I understand that any inaccuracies could impact safety and have serious consequences.
//               </label>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-row justify-between gap-4 mt-6">
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="px-4 py-2 text-xs rounded mb-4 border hover:bg-[#D9D6FE] hover:text-[#6938EF]"
//               >
//                 Close
//               </button>
//               <button
//                 type="submit"
//                 className="bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 disabled:opacity-40 disabled:cursor-not-allowed w-full"
//               >
//                 Add Equipment
//               </button>
//             </div>
//           </form>
//         </div>
//       </DialogPrimitive.Content>
//     </DialogPrimitive.Root>
//   );
// };

// export default CreateEquipment;



// import React, { useState, useEffect } from 'react';
// import axios from '../api/axios';
// import * as DialogPrimitive from '@radix-ui/react-dialog';

// const CreateEquipment = ({ isOpen, onSave, onCancel }) => {
//   const [equipmentName, setEquipmentName] = useState('');
//   const [description, setDescription] = useState('');
//   const [locationID, setLocationID] = useState('');
//   const [inspectionDate, setInspectionDate] = useState('');
//   const [inspectionInterval, setInspectionInterval] = useState('');
//   const [inspectedBy, setInspectedBy] = useState('');
//   const [status, setStatus] = useState('Good');
//   const [isChecked, setIsChecked] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const companyID = 100001;

//   useEffect(() => {
//     fetchEmployees();
//     fetchLocations();
//   }, []);

//   // Reset form fields when dialog opens
//   useEffect(() => {
//     if (isOpen) {
//       setEquipmentName('');
//       setDescription('');
//       setLocationID('');
//       setInspectionDate('');
//       setInspectionInterval('');
//       setInspectedBy('');
//       setStatus('Good');
//       setIsChecked(false);
//     }
//   }, [isOpen]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/employees`);
//       setEmployees(response.data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/locations`);
//       setLocations(response.data);
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newEquipment = {
//       equipmentName,
//       description,
//       locationID,
//       inspectionDate,
//       inspectionInterval,
//       inspectedBy,
//       status,
//       isChecked,
//     };
//     handleCreateEquipment(newEquipment);
//   };

//   const handleCreateEquipment = async (equipment) => {
//     try {
//       await axios.post(`http://localhost:5001/companies/${companyID}/equipments`, equipment);
//       onSave();
//     } catch (error) {
//       console.error("Error creating equipment:", error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
//       {/* Overlay with a dark background */}
//       <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      
//       {/* Dialog Content */}
//       <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
//         <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
//           <h2 className="text-2xl font-semibold mb-4 text-center">Add New Equipment</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Equipment Name */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Equipment Name</label>
//               <input
//                 type="text"
//                 value={equipmentName}
//                 onChange={(e) => setEquipmentName(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter equipment name"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Description</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 placeholder="Enter equipment description"
//                 rows="2"
//                 required
//               ></textarea>
//             </div>

//             {/* Location and Status in one row */}
//             <div className="flex flex-col md:flex-row md:space-x-4">
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-600">Location</label>
//                 <select
//                   value={locationID}
//                   onChange={(e) => setLocationID(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
//                   required
//                 >
//                   <option value="">Select Location</option>
//                   {locations.map((location) => (
//                     <option key={location.locationID} value={location.locationID}>
//                       {location.locationName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex flex-col w-full md:w-1/2 mt-4 md:mt-0">
//                 <label className="text-gray-600">Status</label>
//                 <select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
//                 >
//                   <option value="Good">Good</option>
//                   <option value="Needs Maintenance">Needs Maintenance</option>
//                   <option value="Out of Service">Out of Service</option>
//                 </select>
//               </div>
//             </div>

//             {/* Inspection Date and Interval */}
//             <div className="flex flex-col md:flex-row md:space-x-4">
//               <div className="flex flex-col w-full md:w-1/2">
//                 <label className="text-gray-600">Inspection Date</label>
//                 <input
//                   type="date"
//                   value={inspectionDate}
//                   onChange={(e) => setInspectionDate(e.target.value)}
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
//                   required
//                 />
//               </div>
//               <div className="flex flex-col w-full md:w-1/2 mt-4 md:mt-0">
//                 <label className="text-gray-600">Inspection Interval (Days)</label>
//                 <input
//                   type="number"
//                   value={inspectionInterval}
//                   onChange={(e) => setInspectionInterval(e.target.value)}
//                   placeholder="Enter interval"
//                   className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Inspected By */}
//             <div className="flex flex-col">
//               <label className="text-gray-600">Inspected By</label>
//               <select
//                 value={inspectedBy}
//                 onChange={(e) => setInspectedBy(e.target.value)}
//                 className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
//                 required
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((employee) => (
//                   <option key={employee.employeeID} value={employee.employeeID}>
//                     {employee.firstName} {employee.lastName} ({employee.role})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Checked */}
//             <div className="flex items-start justify-items-center mt-4">
//               <input
//                 type="checkbox"
//                 checked={isChecked}
//                 onChange={(e) => setIsChecked(e.target.checked)}
//                 className="mr-2 mt-1"
//               />
//               <label className="text-gray-600 text-xs-5 md:text-sm">
//                 By checking this box, I confirm that the information entered is accurate. I understand that any inaccuracies could impact safety and have serious consequences.
//               </label>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-row justify-between gap-4 mt-6">
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="px-4 py-2 text-xs rounded mb-4 border hover:bg-[#D9D6FE] hover:text-[#6938EF]"
//               >
//                 Close
//               </button>
//               <button
//                 type="submit"
//                 className="bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 disabled:opacity-40 disabled:cursor-not-allowed w-full"
//               >
//                 Add Equipment
//               </button>
//             </div>
//           </form>
//         </div>
//       </DialogPrimitive.Content>
//     </DialogPrimitive.Root>
//   );
// };

// export default CreateEquipment;


import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const CreateEquipment = ({ isOpen, onSave, onCancel }) => {
  const [equipmentName, setEquipmentName] = useState('');
  const [description, setDescription] = useState('');
  const [locationID, setLocationID] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionInterval, setInspectionInterval] = useState('');
  const [inspectedBy, setInspectedBy] = useState('');
  const [status, setStatus] = useState('Good');
  const [isChecked, setIsChecked] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const companyID = 100001;

  useEffect(() => {
    fetchEmployees();
    fetchLocations();
  }, []);

  // Reset form fields when dialog opens
  useEffect(() => {
    if (isOpen) {
      setEquipmentName('');
      setDescription('');
      setLocationID('');
      setInspectionDate('');
      setInspectionInterval('');
      setInspectedBy('');
      setStatus('Good');
      setIsChecked(false);
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEquipment = {
      equipmentName,
      description,
      locationID,
      inspectionDate,
      inspectionInterval,
      inspectedBy,
      status,
      isChecked,
    };
    handleCreateEquipment(newEquipment);
  };

  const handleCreateEquipment = async (equipment) => {
    try {
      await axios.post(`http://localhost:5001/companies/${companyID}/equipments`, equipment);
      onSave();
    } catch (error) {
      console.error("Error creating equipment:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
      {/* Overlay with a dark background */}
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      
      {/* Dialog Content */}
      <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">Add New Equipment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Equipment Name */}
            <div className="flex flex-col">
              <label className="text-gray-600">Equipment Name</label>
              <input
                type="text"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter equipment name"
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-gray-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter equipment description"
                rows="2"
                required
              ></textarea>
            </div>

            {/* Location and Status in one row */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-gray-600">Location</label>
                <select
                  value={locationID}
                  onChange={(e) => setLocationID(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.locationID} value={location.locationID}>
                      {location.locationName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-gray-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Good">Good</option>
                  <option value="Needs Maintenance">Needs Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              </div>
            </div>

            {/* Inspection Date and Interval */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-gray-600">Inspection Date</label>
                <input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-gray-600">Inspection Interval (Days)</label>
                <input
                  type="number"
                  value={inspectionInterval}
                  onChange={(e) => setInspectionInterval(e.target.value)}
                  placeholder="Enter interval"
                  className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Inspected By */}
            <div className="flex flex-col">
              <label className="text-gray-600">Inspected By</label>
              <select
                value={inspectedBy}
                onChange={(e) => setInspectedBy(e.target.value)}
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.employeeID} value={employee.employeeID}>
                    {employee.firstName} {employee.lastName} ({employee.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Checked */}
            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mr-2 mt-1"
              />
              <label className="text-gray-500 text-xs">
                By checking this box, I confirm that the information entered is accurate. I understand that any inaccuracies could impact safety and have serious consequences.
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-row justify-between gap-4 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs rounded mb-4 border hover:bg-[#D9D6FE] hover:text-[#6938EF]"
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 disabled:opacity-40 disabled:cursor-not-allowed w-full"
              >
                Add Equipment
              </button>
            </div>
          </form>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  );
};

export default CreateEquipment;