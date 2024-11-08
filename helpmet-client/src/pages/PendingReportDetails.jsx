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
      <div>
              <div className='flex flex-col gap-4 max-w-full'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-xs'>
        <div className='flex flex-row items-center justify-between w-[100%]'>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center py-2 px-4 bg-white rounded text-xs text-black mt-0 gap-2 border text-nowrap mr-4 hover:bg-[#D9D6FE] hover:text-[#6938EF]"
          >
            <img src="../../images/return.svg" alt="return icon" />Back to reports
          </button>
          <p className='font-bold text-base'>Report ID: {id}</p>
        </div>
        <div className='flex flex-row gap-4 text-nowrap'>
          <p className='bg-white py-2 px-3 rounded'>Severity: <span className={`label label-severity-${reportDetails.severity}`}>{severityMapping[reportDetails.severity]}</span></p>
          <p className='bg-white py-2 px-3 rounded'>
            Status: <span className={`label ${reportDetails.status === "On going" ? "label-ongoing" : "label-onhold"}`}>{reportDetails.status}</span>
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
            <p>No image available</p>
        )}
      </div>

      <div className='flex flex-col text-black max-w-lg min-w-full p-6 bg-white rounded-lg text-sm gap-4 border'>
        <div>
          <p>Description</p>
          <span className='report-info'>{reportDetails.description}</span>
        </div>

        <div className='line-spacer'></div>

        <div>
          <p>Location</p>
          <span className='report-info'>{reportDetails.locationID}</span>
        </div>

        <div className='line-spacer'></div>

        <div className='flex flex-col gap-6 md:flex-row justify-between'>
          <div className='w-[100%] md:w-[50%]'>
            <p>Injured Employee</p>
            <span className='report-info'>{reportDetails.injuredEmployeeFirstName} • {reportDetails.injuredEmployeeRole} ({reportDetails.injuredEmployeeID})</span>
          </div>
          <div className='w-[100%] md:w-[50%]'>
            <p>Date of injury</p>
            <span className='report-info'>{new Date(reportDetails.dateOfInjury).toLocaleDateString()}</span>
          </div>
        </div>

        <div className='line-spacer'></div>

        <div className='flex flex-col gap-6 md:flex-row justify-between'>
          <div className='w-[100%] md:w-[50%]'>
            <p>Reported by</p>
            <span className='report-info'>{reportDetails.reportByFirstName} • {reportDetails.reportByRole} ({reportDetails.reportBy})</span>
          </div>
          <div className='w-[100%] md:w-[50%]'>
            <p>Report Date</p>
            <span className='report-info'>{new Date(reportDetails.reportDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className='line-spacer'></div>

        <div>
          <p>Injury Type</p>
          <span className='report-info'>{injuryTypeMapping[reportDetails.injuryTypeID]}</span>
        </div>

        <div className='line-spacer'></div>

        <div>
          <p>Witness</p>
          <span className='report-info'>{reportDetails.witnessEmployeeFirstName ? `${reportDetails.witnessEmployeeFirstName} • ${reportDetails.witnessEmployeeRole} (${reportDetails.witnessID})` : "No witness"}</span>
        </div>
      </div>
    </div>

        <div className='flex justify-evenly mt-6'>
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="bg-[#039855] text-white hover:bg-[#A6F4C5] hover:text-[#039855] text-xs px-4 py-2 rounded mb-4 disabled:cursor-not-allowed"
                disabled={reportDetails.status === "On hold"}
                title={reportDetails.status === "On hold" ? "This report is on hold" : ""}
              >
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
              <button
                className="bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 disabled:cursor-not-allowed"
                disabled={reportDetails.status === "On hold"}
                title={reportDetails.status === "On hold" ? "This report is on hold" : ""}
              >
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