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
    <div className='text-white'>
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
      <p>Image: {reportDetails.image}</p>
      <p>Status: {reportDetails.status}</p>
    </div>
  );
};

export default PendingReportDetails;
