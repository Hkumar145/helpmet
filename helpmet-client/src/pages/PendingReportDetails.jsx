import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

const severityMapping = {
  1: 'Minor',
  2: 'Moderate',
  3: 'Severe',
  4: 'Significant',
  5: 'Fatal',
};

const injuryTypeMapping = {
};

const PendingReportDetails = () => {
  const { id } = useParams();
  const [reportDetails, setReportDetails] = useState(null);

  useEffect(() => {
    axios.get(`/reports/pending/${id}`)  // Update API endpoint as needed
      .then(response => setReportDetails(response.data))
      .catch(error => console.error("Error fetching report details:", error));
  }, [id]);

  if (!reportDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='text-white max-w-lg w-full p-6 bg-gray-800 rounded-lg'>
      <h2>Report Details for {id}</h2>
      <p>Reported by: {reportDetails.reportBy}</p>
      <p>Injured Employee ID: {reportDetails.injuredEmployeeID}</p>
      <p>Date of Injury: {new Date(reportDetails.dateOfInjury).toLocaleDateString()}</p>
      <p>Report Date: {new Date(reportDetails.reportDate).toLocaleDateString()}</p>
      <p>Location ID: {reportDetails.locationID}</p>
      <p>Injury type ID: {reportDetails.injuryTypeID}</p>
      <p>Severity: {severityMapping[reportDetails.severity]}</p>
      <p>Description: {reportDetails.description}</p>
      <p>Witness ID: {reportDetails.witnessID}</p>
      <div>
        <h3>Image:</h3>
        {reportDetails.image ? (
          <img src={reportDetails.image} alt="Injury Report" className="max-w-[40%] h-auto rounded-lg" />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <p>Status: {reportDetails.status}</p>

      <div className='flex justify-between mt-6'>
        <button className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-90 max-w-40'>
            Approve
        </button>
        <button className='bg-purple-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-90 max-w-40'>
            On Hold
        </button>
      </div>
    </div>
  );
};

export default PendingReportDetails;
