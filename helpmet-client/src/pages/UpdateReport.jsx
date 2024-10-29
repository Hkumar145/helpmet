import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const UpdateReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportDetails, setReportDetails] = useState(null);
  const [reportBy, setReportBy] = useState('');
  const [injuredEmployeeID, setInjuredEmployeeID] = useState('');
  const [dateOfInjury, setDateOfInjury] = useState('');
  const [locationID, setLocationID] = useState('');
  const [injuryTypeID, setInjuryTypeID] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [witnessID, setWitnessID] = useState('');
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(`/update-report/${id}`);
        const report = response.data;
        setReportDetails(report);
        setReportBy(report.reportBy);
        setInjuredEmployeeID(report.injuredEmployeeID);
        setDateOfInjury(report.dateOfInjury.split('T')[0]);
        setLocationID(report.locationID);
        setInjuryTypeID(report.injuryTypeID);
        setSeverity(report.severity);
        setDescription(report.description);
        setImage(report.image);
        setWitnessID(report.witnessID || '');
      } catch (error) {
        console.error("Error fetching report details:", error);
      }
    };

    fetchReportDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files.length > 0) {
        setFile(files[0]); // Set the file state without uploading
        setImage('');
    } else {
        const stateUpdateFunctions = {
            reportBy: setReportBy,
            injuredEmployeeID: setInjuredEmployeeID,
            dateOfInjury: setDateOfInjury,
            locationID: setLocationID,
            injuryTypeID: setInjuryTypeID,
            severity: setSeverity,
            description: setDescription,
            witnessID: setWitnessID,
        };

        const updateFunction = stateUpdateFunctions[name];
        if (updateFunction) {
            updateFunction(value);
        }
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    formData.append('reportBy', reportBy);
    formData.append('injuredEmployeeID', injuredEmployeeID);
    formData.append('dateOfInjury', dateOfInjury);
    formData.append('locationID', locationID);
    formData.append('injuryTypeID', injuryTypeID);
    formData.append('severity', severity);
    formData.append('description', description);
    formData.append('witnessID', witnessID ? witnessID : null);
    formData.append('status', "On going");

    try {
        const response = await axios.put(`/update-report/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setReportBy('');
        setInjuredEmployeeID('');
        setDateOfInjury('');
        setLocationID('');
        setInjuryTypeID('');
        setSeverity('');
        setDescription('');
        setImage('');
        setWitnessID('');
        setSuccessMessage(true);
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Failed to update report. Please try again.");
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  if (!reportDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {successMessage ? (
        <section className='w-full max-w-xs min-h-[400px] flex flex-col justify-start p-4 bg-black/40'>
          <h1 className='text-white'>Injury report updated successfully.</h1>
        </section>
      ) : (
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-white">
        <h1 className="text-2xl font-bold mb-4">Update Injury Report</h1>
        <form className="flex flex-col gap-4 text-black" onSubmit={handleSubmit}>
          <label>Reported By (Employee ID)</label>
          <input
            type="number"
            name="reportBy"
            value={reportBy}
            onChange={handleChange}
            placeholder="Enter your employee ID"
            required
            className="p-2 rounded border"
          />

          <label>Injured Employee's ID</label>
          <input
            type="number"
            name="injuredEmployeeID"
            value={injuredEmployeeID}
            onChange={handleChange}
            placeholder="Enter injured employee's ID"
            required
            className="p-2 rounded border"
          />

          <label>Date of Injury</label>
          <input
            type="date"
            name="dateOfInjury"
            value={dateOfInjury}
            onChange={handleChange}
            required
            className="p-2 rounded border"
          />

          <label>Location ID</label>
          <input
            type="text"
            name="locationID"
            value={locationID}
            onChange={handleChange}
            placeholder="Enter Location ID"
            required
            className="p-2 rounded border"
          />

          <label>Injury Type ID</label>
          <select
            name="injuryTypeID"
            value={injuryTypeID}
            onChange={handleChange}
            required
            className="p-2 rounded border"
          >
            <option value="" disabled>- select injury type -</option>
            <option value="T0001">Overexertion</option>
            <option value="T0002">Fall from Elevation</option>
            <option value="T0003">Struck By</option>
            <option value="T0004">Exposure to Toxic Substances</option>
            <option value="T0005">Caught In</option>
            <option value="T0006">Epidemic Related</option>
            <option value="T0007">Motor Vehicle Incident</option>
            <option value="T0008">Industrial and Other Vehicle Accident</option>
            <option value="T0009">Contact with Electricity</option>
            <option value="T0010">Matter in Eye</option>
          </select>

          <label>Severity</label>
          <select
            name="severity"
            value={severity}
            onChange={handleChange}
            required
            className="p-2 rounded border"
          >
            <option value="" disabled>- select severity -</option>
            <option value={1}>Minor</option>
            <option value={2}>Moderate</option>
            <option value={3}>Severe</option>
            <option value={4}>Significant</option>
            <option value={5}>Fatal</option>
          </select>

          <label>Describe the incident</label>
          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Include key details about the event, actions taken, and any immediate effects."
            required
            className="p-2 rounded border min-h-[6rem] max-h-[12rem]"
            rows="4"
          ></textarea>

          <label>Incident Photos (Optional)</label>
          {image && (
            <div className="mb-2">
              <img src={image} alt="Existing image" className="h-32 w-32 object-cover rounded-md" />
            </div>
          )}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="p-2 rounded border text-white"
          />

          <label>Witnesses ID (Optional)</label>
          <input
            type="number"
            name="witnessID"
            value={witnessID}
            onChange={handleChange}
            placeholder="Enter witness ID"
            className="p-2 rounded border"
          />

          <button
            type="submit"
            className="mt-4 p-3 bg-emerald-500 rounded hover:bg-emerald-600 text-white font-bold"
          >
            Update Report
          </button>
        </form>
      </div>
      )}
    </>
  );
};

export default UpdateReport;