import React, { useState } from 'react';

const InjuryReport = () => {
  const [formData, setFormData] = useState({
    reportID: '',
    reportedBy: '',
    injuredEmployeeID: '',
    dateOfInjury: '',
    reportDate: '',
    location: '',
    injuryType: '',
    severity: '',
    description: '',
    photos: null,
    witnesses: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Injury report submitted.");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Injury Report</h1>
      <form className="flex flex-col gap-4 text-black" onSubmit={handleSubmit}>
        <label>Report ID</label>
        <input
          type="text"
          name="reportID"
          value={formData.reportID}
          onChange={handleChange}
          placeholder="Enter Report ID"
          required
          className="p-2 rounded border"
        />

        <label>Reported By</label>
        <input
          type="text"
          name="reportedBy"
          value={formData.reportedBy}
          onChange={handleChange}
          placeholder="Enter your employee ID"
          required
          className="p-2 rounded border"
        />

        <label>Injured Employee's ID</label>
        <input
          type="text"
          name="injuredEmployeeID"
          value={formData.injuredEmployeeID}
          onChange={handleChange}
          placeholder="Enter injured employee's ID"
          required
          className="p-2 rounded border"
        />

        <label>Date of Injury</label>
        <input
          type="date"
          name="dateOfInjury"
          value={formData.dateOfInjury}
          onChange={handleChange}
          required
          className="p-2 rounded border"
        />

        <label>Report Date</label>
        <input
          type="date"
          name="reportDate"
          value={formData.reportDate}
          onChange={handleChange}
          required
          className="p-2 rounded border"
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter Location"
          required
          className="p-2 rounded border"
        />

        <label>Injury Type</label>
        <select
          name="injuryType"
          value={formData.injuryType}
          onChange={handleChange}
          required
          className="p-2 rounded border"
        >
          <option value="" disabled>- select injury type -</option>
          <option value="Overexertion">Overexertion</option>
          <option value="Fall from Elevation">Fall from Elevation</option>
          <option value="Fall on Same Level">Fall on Same Level</option>
          <option value="Struck By">Struck By</option>
          <option value="Exposure to Toxic Substances">Exposure to Toxic Substances</option>
          <option value="Caught In">Caught In</option>
          <option value="Repetitive Motion">Repetitive Motion</option>
          <option value="Motor Vehicle Incident">Motor Vehicle Incident</option>
          <option value="Industrial and Other Vehicle Accident">Industrial and Other Vehicle Accident</option>
          <option value="Contact with Eleectricity">Contact with Eleectricity</option>
          <option value="Matter in Eye">Matter in Eye</option>
          <option value="Other Accident">Other Accident</option>
        </select>

        <label>Severity</label>
        <select
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          required
          className="p-2 rounded border"
        >
          <option value="" disabled>- select severity -</option>
          <option value="Minor">Minor</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>

        <label>Describe the incident</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Include key details about the event, actions taken, and any immediate effects."
          required
          className="p-2 rounded border min-h-[6rem] max-h-[12rem]"
          rows="4"
        ></textarea>

        <label>Incident Photos</label>
        <input
          type="file"
          name="photos"
          onChange={handleChange}
          multiple
          className="p-2 rounded border text-white"
        />

        <label>Witnesses</label>
        <input
          type="text"
          name="witnesses"
          value={formData.witnesses}
          onChange={handleChange}
          placeholder="Enter witness names"
          className="p-2 rounded border"
        />

        <button
          type="submit"
          className="mt-4 p-3 bg-emerald-500 rounded hover:bg-emerald-600 text-white font-bold"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InjuryReport;