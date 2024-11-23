import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Loader from "../components/Loader";

const severityMapping = {
  1: "Minor",
  2: "Moderate",
  3: "Severe",
  4: "Significant",
  5: "Fatal",
};

const injuryTypeMapping = {
  T0001: "Overexertion",
  T0002: "Fall from Elevation",
  T0003: "Struck By",
  T0004: "Exposure to Toxic Substances",
  T0005: "Caught In",
  T0006: "Epidemic Related",
  T0007: "Motor Vehicle Incident",
  T0008: "Industrial and Other Vehicle Accident",
  T0009: "Contact with Electricity",
  T0010: "Matter in Eye",
};

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportDetails, setReportDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/reports/${id}`)
      .then((response) => {
        setReportDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching report details:", error);
        setLoading(false);
      });
  }, [id]);


  return (
    loading ? ( 
      <div className="flex justify-center items-center h-[400px]">
        <Loader />
      </div>
    ) : (
      <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs px-2">
        <div className="flex flex-row items-center justify-between w-full gap-12 px-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center py-2 px-4 bg-white rounded text-xs text-black mt-0 gap-2 border text-nowrap mr-4 hover:bg-[#D9D6FE] hover:text-[#6938EF]"
          >
            <img src="../../images/return.svg" alt="return icon" />
            Back to reports
          </button>
          <p className="font-bold text-base">
            Report ID: {reportDetails.reportID}
          </p>
        </div>
        <div className="flex flex-row gap-4 text-nowrap">
          <p className="bg-white py-2 px-3 rounded">
            Severity:{" "}
            <span className={`label label-severity-${reportDetails.severity}`}>
              {severityMapping[reportDetails.severity]}
            </span>
          </p>
          <p className="bg-white py-2 px-3 rounded">
            Status:{" "}
            <span className="label label-completed">
              {reportDetails.status}
            </span>
          </p>
        </div>
      </div>

      <div>
        {reportDetails.image && reportDetails.image.length > 0 ? (
          <div className="flex overflow-x-scroll gap-4">
            {reportDetails.image.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Injury Report Image ${index + 1}`}
                className="max-w-[40%] max-h-60 rounded-lg object-cover"
              />
            ))}
          </div>
        ) : (
          // <p>No image available</p>
          <div></div>
        )}
      </div>

      <div className="flex flex-col text-black max-w-lg min-w-full p-6 bg-white rounded-lg text-sm gap-4 border shadow-md">
        <div>
          <p>Description</p>
          <span className="report-info">{reportDetails.description}</span>
        </div>

        <div className="line-spacer"></div>

        <div>
          <p>Location</p>
          <span className="report-info">
            {reportDetails.locationName
            ? `${reportDetails.locationName} (${reportDetails.locationID})`
            : reportDetails.locationID}
          </span>
        </div>

        <div className="line-spacer"></div>

        <div className="flex flex-col gap-6 md:flex-row justify-between">
          <div className="w-[100%] md:w-[50%]">
            <p>Injured Employee</p>
            <span className="report-info">
              {reportDetails.injuredEmployeeFirstName} •{" "}
              {reportDetails.injuredEmployeeRole} (
              {reportDetails.injuredEmployeeID})
            </span>
          </div>
          <div className="w-[100%] md:w-[50%]">
            <p>Date of injury</p>
            <span className="report-info">
              {new Date(reportDetails.dateOfInjury).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="line-spacer"></div>

        <div className="flex flex-col gap-6 md:flex-row justify-between">
          <div className="w-[100%] md:w-[50%]">
            <p>Reported by</p>
            <span className="report-info">
              {reportDetails.reportByFirstName} • {reportDetails.reportByRole} (
              {reportDetails.reportBy})
            </span>
          </div>
          <div className="w-[100%] md:w-[50%]">
            <p>Report Date</p>
            <span className="report-info">
              {new Date(reportDetails.reportDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="line-spacer"></div>

        <div>
          <p>Injury Type</p>
          <span className="report-info">
            {injuryTypeMapping[reportDetails.injuryTypeID]}
          </span>
        </div>

        <div className="line-spacer"></div>

        <div>
          <p>Witness</p>
          <span className="report-info">
            {reportDetails.witnessEmployeeFirstName
              ? `${reportDetails.witnessEmployeeFirstName} • ${reportDetails.witnessEmployeeRole} (${reportDetails.witnessID})`
              : "No witness"}
          </span>
        </div>
      </div>
      </div>
    )
  );
};

export default ReportDetails;
