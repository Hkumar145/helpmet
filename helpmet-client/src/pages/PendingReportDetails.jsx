import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const [reportDetails, setReportDetails] = useState(null);
  const [holdReason, setHoldReason] = useState("");

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
        <Dialog>
          <DialogTrigger asChild>
            <button className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-90 max-w-40'>
                Approve
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Approve Injury Report</DialogTitle>
            <DialogDescription>Remarks:</DialogDescription>
            <textarea 
              placeholder="Message" 
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
                type='submit'
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
  );
};

export default PendingReportDetails;
