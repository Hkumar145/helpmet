import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import { DateTime } from 'luxon';

const UpdateReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportDetails, setReportDetails] = useState(null);
  const [reportBy, setReportBy] = useState('');
  const [injuredEmployeeID, setInjuredEmployeeID] = useState('');
  const [dateOfInjury, setDateOfInjury] = useState('');
  const [locationID, setLocationID] = useState('');
  const [locations, setLocations] = useState([]);
  const [injuryTypeID, setInjuryTypeID] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState([]);
  const [witnessID, setWitnessID] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [success, setSuccess] = useState(false);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(`/update-report/${id}`);
        const report = response.data;
        const formattedDate = DateTime.fromISO(report.dateOfInjury, { zone: 'America/Vancouver' }).toJSDate();
        setReportDetails(report);
        setReportBy(report.reportBy);
        setInjuredEmployeeID(report.injuredEmployeeID);
        setDateOfInjury(formattedDate);
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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`/companies/${companyID}/locations`);
        setLocations(response.data || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("Failed to fetch locations.");
      }
    };

    fetchLocations();
  }, [companyID]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files.length > 0) {
      setImage(Array.from(files));
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
    image.forEach((img) => formData.append('image', img));
    const formattedDate = DateTime.fromJSDate(dateOfInjury, { zone: 'America/Vancouver' }).toISO();
    formData.append('reportBy', reportBy);
    formData.append('injuredEmployeeID', injuredEmployeeID);
    formData.append('dateOfInjury', formattedDate);
    formData.append('locationID', locationID);
    formData.append('injuryTypeID', injuryTypeID);
    formData.append('severity', severity);
    formData.append('description', description);
    if (witnessID) {
      formData.append('witnessID', witnessID);
    }
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
        setImage([]);
        setWitnessID('');
        setSuccessMessage(true);
        setSuccess(true);
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update report. Please try again.", {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
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
        <section className='w-full max-w-sm min-h-[400px] flex flex-col justify-start p-4'>
          <h1 className='text-[#6938EF] text-clip text-center'>Injury report updated successfully.</h1>
        </section>
      ) : (
      <div className="bg-white p-6 rounded-lg min-w-full mx-auto text-black lg:min-w-[1024px]">
        <ToastContainer position="top-right" autoClose={3000} />
        <h1 className="text-2xl font-bold mb-4">Update Injury Report</h1>
        <form className="flex flex-col gap-4 text-black injury-form" onSubmit={handleSubmit}>
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
          <DateTimePicker
            className="injury-datetime-picker"
            onChange={setDateOfInjury}
            value={dateOfInjury}
            required
            disableClock={true}
            clearIcon={null}
            calendarIcon={null}
            format='y-MM-dd'
            maxDate={new Date()}
          />

          <label>Location</label>
          <select
            name="locationID"
            value={locationID}
            onChange={handleChange}
            required
            className="p-2 rounded border appearance-none"
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat'
            }}
          >
            <option value="" disabled>- select location -</option>
            {locations.map((location) => (
              <option key={location.locationID} value={location.locationID}>
                {location.locationName}
              </option>
            ))}
          </select>

          <label>Injury Type ID</label>
          <select
            name="injuryTypeID"
            value={injuryTypeID}
            onChange={handleChange}
            required
            className="p-2 rounded border appearance-none"
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat'
            }}
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
            className="p-2 rounded border appearance-none"
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat'
            }}
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
          {image && image.length > 0 ? (
            <div className="flex gap-4 overflow-x-scroll mb-2 p-2">
              {image.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Injury Report Image ${index + 1}`}
                  className="h-32 w-32 object-cover rounded-md flex-shrink-0"
                />
              ))}
            </div>
          ) : (
            <p>No image was submitted</p>
          )}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            multiple
            className="p-2 rounded border text-black"
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
            className="bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 disabled:opacity-40 disabled:cursor-not-allowed w-full"
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