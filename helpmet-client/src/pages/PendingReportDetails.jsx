import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import axios from '../api/axios';
import * as DialogPrimitive from "@radix-ui/react-dialog"

const DialogClose = DialogPrimitive.Close

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

const PendingReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportDetails, setReportDetails] = useState(null);
  const [holdReason, setHoldReason] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    axios.get(`/reports/pending/${id}`)
      .then(response => setReportDetails(response.data))
      .catch(error => console.error("Error fetching report details:", error));
  }, [id]);

  const confirmOnHold = async () => {
    try {
      await axios.post("/email/send-hold-email", {
        reportDetails,
        holdReason,
      });
      alert("Email sent successfully!");

      setReportDetails((prevDetails) => ({
        ...prevDetails,
        status: "On hold",
      }));
      setHoldReason("");
    } catch (error) {
      console.error("Error sending hold email:", error);
      alert("Could not send hold email.");
    }
  };

  const confirmApprove = async () => {
    try {
      // Move the report from pendingReports to reports collection
      const response = await axios.post(`/reports/approve`, {
        pendingReportId: reportDetails._id,
      });

      const generatedReportID = response.data.reportID;
      // Send approval email
      await axios.post("/email/send-approval-email", {
        reportDetails,
        reportID: generatedReportID,
      });

      setReportDetails((prevDetails) => ({
        ...prevDetails,
        status: "Completed",
      }));
      setSuccessMessage(true);
    } catch (error) {
      console.error("Error during approval process:", error);
      alert("Could not process approval.");
    }
  };
  
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/pending-report');
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
        <section className='w-full max-w-xs min-h-[400px] flex flex-col justify-start p-4 bg-white'>
          <h1 className='text-black'>Injury report approved successfully.</h1>
        </section>
      ) : (
      <div className='text-black max-w-lg w-full p-6 bg-white rounded-lg'>
        <h2>Report Details for {id}</h2>
        <p>Reported by: {reportDetails.reportByFirstName} ({reportDetails.reportBy})</p>
        <p>Injured Employee: {reportDetails.injuredEmployeeFirstName} ({reportDetails.injuredEmployeeID})</p>
        <p>Date of Injury: {new Date(reportDetails.dateOfInjury).toLocaleDateString()}</p>
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
                  className="max-w-[40%] h-auto rounded-lg"
                />
              ))}
            </div>
          ) : (
            <p>No image available</p>
          )}
        </div>
        <p>Status: {reportDetails.status}</p>

        <div className='flex justify-between mt-6'>
          <Dialog>
            <DialogTrigger asChild>
              <button className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-90 max-w-40'>
                  Approve
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>Approve Injury Report</DialogTitle>
              <div className='flex flex-row gap-4 items-center'>
                <DialogDescription>Confirm the approval</DialogDescription>
              </div>
              <div className='flex flex-row justify-between gap-4'>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="text-black border px-6"
                  >
                    Close
                  </button>
                </DialogClose>
                <button
                  type='button'
                  onClick={confirmApprove}
                  className='bg-slate-600 text-white hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed w-full'
                >
                  Confirm
                </button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <button className='bg-purple-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-90 max-w-40'>
                On Hold
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>Put Report On Hold</DialogTitle>
              <DialogDescription>Reason for putting this report on hold:</DialogDescription>
              <textarea 
                placeholder="Message" 
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                className="min-h-[6rem] max-h-[12rem] border w-full p-2 rounded-lg mt-2"
              ></textarea>
              <div className='flex flex-row justify-between gap-4'>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="text-black border px-6"
                  >
                    Close
                  </button>
                </DialogClose>
                <button
                  type='button'
                  onClick={confirmOnHold}
                  className='bg-slate-600 text-white hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed w-full'
                >
                  Confirm
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      )}
    </>
  );
};

export default PendingReportDetails;
