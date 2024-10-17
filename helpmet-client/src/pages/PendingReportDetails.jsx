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
};

const PendingReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportDetails, setReportDetails] = useState(null);
  const [holdReason, setHoldReason] = useState("");
  const [reportID, setReportID] = useState("");
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
      await axios.post("/email/send-approval-email", {
        reportDetails,
        reportID
      });
      setSuccessMessage(true);
  
      setReportDetails((prevDetails) => ({
        ...prevDetails,
        status: "Completed",
      }));
      setReportID("");
    } catch (error) {
      console.error("Error sending approve email:", error);
      alert("Could not send approve email.");
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
        <section className='w-full max-w-xs min-h-[400px] flex flex-col justify-start p-4 bg-black/40'>
          <h1 className='text-white'>Injury report approved successfully.</h1>
        </section>
      ) : (
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
          <Dialog>
            <DialogTrigger asChild>
              <button className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-90 max-w-40'>
                  Approve
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>Approve Injury Report</DialogTitle>
              <div className='flex flex-row gap-4 items-center'>
                <DialogDescription>Define Report ID:</DialogDescription>
                <input
                  type="text"
                  placeholder="Report ID"
                  value={reportID}
                  onChange={(e) => setReportID(e.target.value)}
                  className="border p-2 rounded-lg"
                />
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
                  className='bg-slate-600 hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed w-full'
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
                  className='bg-slate-600 hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed w-full'
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