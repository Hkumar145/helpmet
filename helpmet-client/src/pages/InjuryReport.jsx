import React, { useState, useCallback } from 'react';
import axios from '../api/axios';
import { useDropzone } from 'react-dropzone';

const InjuryReport = () => {
  const [reportBy, setReportBy] = useState('');
  const [injuredEmployeeID, setInjuredEmployeeID] = useState('');
  const [dateOfInjury, setDateOfInjury] = useState('');
  const [locationID, setLocationID] = useState('');
  const [injuryTypeID, setInjuryTypeID] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState([]);
  const [witnessID, setWitnessID] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === 'file' && files.length > 0) {
        setImage(Array.from(files)); // Set the file state without uploading
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

  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));
    const nonImageFiles = acceptedFiles.filter((file) => !file.type.startsWith("image/"));

    if (nonImageFiles.length > 0) {
        alert("Only image files (e.g., .jpg, .jpeg, .png) are allowed.");
    }

    setImage((prevImages) => [...prevImages, ...imageFiles]);
}, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const removeFile = (file) => {
    setImage((prevImages) => prevImages.filter((img) => img !== file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    image.forEach((img) => formData.append('image', img));
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
        const response = await axios.post('/reports/submit', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        alert("Injury report submitted.");
        setReportBy('');
        setInjuredEmployeeID('');
        setDateOfInjury('');
        setLocationID('');
        setInjuryTypeID('');
        setSeverity('');
        setDescription('');
        setImage([]);
        setWitnessID('');
    } catch (error) {
        console.error("Error submitting report:", error);
        alert("Failed to submit report. Please try again.");
    }
};
  const demoAutoFill = () => {
    setReportBy('100410616');
    setInjuredEmployeeID('100411864');
    setDateOfInjury('2024-11-05');
    setLocationID('L0016');
    setInjuryTypeID('T0002');
    setSeverity('2');
    setDescription('Falling from scaffolding results in a broken bone in right leg');
    setWitnessID('100410616');
  };

  return (
    <div className="bg-white p-6 rounded-lg min-w-full mx-auto text-black md:min-w-[700px]">
      <h1 className="text-2xl font-bold mb-4" onClick={demoAutoFill}>Injury Report</h1>
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
          onWheel={(e) => e.target.blur()}
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
          onWheel={(e) => e.target.blur()}
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
        {/* <input
          type="file"
          name="image"
          onChange={handleChange}
          multiple
          className="p-2 rounded border text-black"
        /> */}
        <div {...getRootProps()} className="p-4 border-dashed border-2 rounded text-center cursor-pointer">
          <input {...getInputProps()} />
          <p><span className='text-[#6938EF]'>Click here to upload</span> or drag and drop</p>
        </div>
        <div className="mt-2">
          {image.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded mt-1">
              <p className="truncate">{file.name}</p>
              <button
                type="button"
                className="text-red-500 hover:underline mt-0"
                onClick={() => removeFile(file)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <label>Witnesses ID (Optional)</label>
        <input
          type="number"
          name="witnessID"
          value={witnessID}
          onChange={handleChange}
          placeholder="Enter witness ID"
          className="p-2 rounded border"
          onWheel={(e) => e.target.blur()}
        />

        <button
          type="submit"
          className="bg-[#6938EF] text-white font-bold w-full self-center hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs py-2 rounded my-0"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InjuryReport;