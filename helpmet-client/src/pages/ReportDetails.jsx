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
const ReportDetails = () => {
  const { id } = useParams();
  const [reportDetails, setReportDetails] = useState(null);

  useEffect(() => {
    axios.get(`/reports/${id}`)
      .then(response => {
        setReportDetails(response.data);
      })
      .catch(error => {
        console.error("Error fetching report details:", error);
      });
  }, [id]);

  if (!reportDetails) return <div>Loading...</div>;

  return (
    <div className='text-white'>
      <h1>Report Details</h1>
      <p>Report ID: {reportDetails.reportID}</p>
      <p>Reported by: {reportDetails.reportBy}</p>
      <p>Injured Employee ID: {reportDetails.injuredEmployeeID}</p>
      <p>Date of injury: {new Date(reportDetails.dateOfInjury).toLocaleDateString()}</p>
      <p>Report Date: {new Date(reportDetails.reportDate).toLocaleDateString()}</p>
      <p>Location ID: {reportDetails.locationID}</p>
      <p>Injury type ID: {reportDetails.injuryTypeID}</p>
      <p>Severity: {severityMapping[reportDetails.severity]}</p>
      <p>Description: {reportDetails.description}</p>
      <p>Witness ID: {reportDetails.witnessID}</p>
      <p>Image: {reportDetails.image}</p>
    </div>
  );
};

export default ReportDetails;