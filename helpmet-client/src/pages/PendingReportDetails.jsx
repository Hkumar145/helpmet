import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import axios from "../api/axios";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DialogClose = DialogPrimitive.Close;

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

const PendingReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportDetails, setReportDetails] = useState(null);
  const [holdReason, setHoldReason] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    axios
      .get(`/reports/pending/${id}`)
      .then((response) => setReportDetails(response.data))
      .catch((error) => console.error("Error fetching report details:", error));
  }, [id]);

  const confirmOnHold = async () => {
    toast.info("Processing...", {
      autoClose: 1000,
      className: "custom-toast-info",
      bodyClassName: "custom-toast-body",
    });

    try {
      await axios.post("/email/send-hold-email", {
        reportDetails,
        holdReason,
      });

      setReportDetails((prevDetails) => ({
        ...prevDetails,
        status: "On hold",
      }));
      setHoldReason("");
      toast.success("Report put on hold successfully!", {
        autoClose: 3000,
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
    } catch (error) {
      toast.error(`Failed to put the report on hold: ${error}`, {
        autoClose: 3000,
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
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
        navigate("/pending-report");
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
        <section className="w-full max-w-sm min-h-[400px] flex flex-col justify-start p-4">
          <h1 className="text-[#6938EF] text-center">
            Injury report approved successfully.
          </h1>
        </section>
      ) : (
        <>
          <ToastContainer position="top-right" />
          <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs px-2">
              <div className="flex flex-row items-center justify-between w-full px-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center py-2 px-4 bg-white rounded text-xs text-black mt-0 gap-2 border text-nowrap mr-4 hover:bg-[#D9D6FE] hover:text-[#6938EF]"
                >
                  <img src="../../images/return.svg" alt="return icon" />
                  Back to reports
                </button>
                <p className="font-bold text-base">Report ID: {id}</p>
              </div>
              <div className="flex flex-row gap-4 text-nowrap">
                <p className="bg-white py-2 px-3 rounded">
                  Severity:{" "}
                  <span
                    className={`label label-severity-${reportDetails.severity}`}
                  >
                    {severityMapping[reportDetails.severity]}
                  </span>
                </p>
                <p className="bg-white py-2 px-3 rounded">
                  Status:{" "}
                  <span
                    className={`label ${
                      reportDetails.status === "On going"
                        ? "label-ongoing"
                        : "label-onhold"
                    }`}
                  >
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
                    {reportDetails.reportByFirstName} •{" "}
                    {reportDetails.reportByRole} ({reportDetails.reportBy})
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
              <div className="flex justify-evenly mt-0 gap-4 self-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="text-[#6938EF] border-2 border-[#6938EF] hover:bg-[#D9D6FE] hover:text-[#6938EF] rounded text-sm px-4 py-2 mb-0 disabled:cursor-not-allowed"
                      // className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-sm px-4 py-2 rounded mb-0 disabled:cursor-not-allowed"
                      disabled={reportDetails.status === "On hold"}
                      title={
                        reportDetails.status === "On hold"
                          ? "This report is on hold"
                          : ""
                      }
                    >
                      On Hold
                    </button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogTitle>Put Report On Hold</DialogTitle>
                    <DialogDescription>
                      Reason for putting this report on hold:
                    </DialogDescription>
                    <textarea
                      placeholder="Message"
                      value={holdReason}
                      onChange={(e) => setHoldReason(e.target.value)}
                      className="min-h-[6rem] max-h-[12rem] border w-full p-2 rounded-lg mt-2"
                    ></textarea>
                    <div className="flex flex-row justify-end gap-2">
                      <DialogClose asChild>
                        <button
                          type="button"
                          className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
                        >
                          Cancel
                        </button>
                      </DialogClose>
                      <DialogClose asChild>
                        <button
                          type="button"
                          onClick={confirmOnHold}
                          className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Confirm
                        </button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-sm px-4 py-2 rounded mb-0 disabled:cursor-not-allowed"
                      disabled={reportDetails.status === "On hold"}
                      title={
                        reportDetails.status === "On hold"
                          ? "This report is on hold"
                          : ""
                      }
                    >
                      Approve
                    </button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogTitle>Approve Injury Report</DialogTitle>
                    <div className="flex flex-row gap-4 items-center">
                      <DialogDescription>Confirm the approval</DialogDescription>
                    </div>
                    <div className="flex flex-row justify-end gap-2">
                      <DialogClose asChild>
                        <button
                          type="button"
                          className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
                        >
                          Cancel
                        </button>
                      </DialogClose>
                      <button
                        type="button"
                        onClick={confirmApprove}
                        className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Confirm
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

        </>
      )}
    </>
  );
};

export default PendingReportDetails;
