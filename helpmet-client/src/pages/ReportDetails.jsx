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
  T0001: 'Overexertion',
  T0002: 'Fall from Elevation',
  T0003: 'Struck By',
  T0004: 'Exposure to Toxic Substances',
  T0005: 'Caught In',
  T0006: 'Epidemic Related',
  T0007: 'Motor Vehicle Incident',
  T0008: 'Industrial and Other Vehicle Accident',
  T0009: 'Contact with Electricity',
  T0010: 'Matter in Eye'
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
    <div className='text-black max-w-lg w-full p-6 bg-white rounded-lg'>
      <h1>Report Details for {reportDetails.reportID}</h1>
      <p>Report ID: {reportDetails.reportID}</p>
      <p>Reported by: {reportDetails.reportByFirstName} ({reportDetails.reportBy})</p>
      <p>Injured Employee: {reportDetails.injuredEmployeeFirstName} ({reportDetails.injuredEmployeeID})</p>
      <p>Date of injury: {new Date(reportDetails.dateOfInjury).toLocaleDateString()}</p>
      <p>Report Date: {new Date(reportDetails.reportDate).toLocaleDateString()}</p>
      <p>Location ID: {reportDetails.locationID}</p>
      <p>Injury type: {injuryTypeMapping[reportDetails.injuryTypeID]} ({reportDetails.injuryTypeID})</p>
      <p>Severity: {severityMapping[reportDetails.severity]}</p>
      <p>Description: {reportDetails.description}</p>
      <p>Witness: {reportDetails.witnessEmployeeFirstName ? `${reportDetails.witnessEmployeeFirstName} (${reportDetails.witnessID})` : "No witness"}</p>
      <div>
        <h3>Image:</h3>
        {reportDetails.image && reportDetails.image.length > 0 ? (
          <div className="flex overflow-x-scroll gap-4">
            {reportDetails.image.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Injury Report Image ${index + 1}`}
                className="max-w-[40%] h-auto rounded-lg object-cover"
              />
            ))}
          </div>
        ) : (
          <p>No image available</p>
        )}
      </div>
      <p>Status: {reportDetails.status}</p>
    </div>
  );
};

export default ReportDetails;