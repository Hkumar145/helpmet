import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateReport from "../components/CreateReport";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import BackToTopButton from "../components/BackToTopButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

const severityMapping = {
  1: "Minor",
  2: "Moderate",
  3: "Severe", 
  4: "Significant",
  5: "Fatal",
};

const injuryTypeMapping = {};

const Report = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (companyID) {
      axios
        .get(`/companies/${companyID}/reports`)
        .then((response) => {
          const sortedReports = response.data.sort(
            (a, b) => new Date(b.dateOfInjury) - new Date(a.dateOfInjury)
          );
          setReport(sortedReports);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching reports:", error);
          setLoading(false);
        });
    }
  }, [companyID]);

  const handleViewDetails = (reportID) => {
    navigate(`/report/${reportID}`);
  };

  const handleViewPendingReports = () => {
    navigate(`/pending-report`);
  };

  const handleCreateInjuryReport = () => {
    navigate("/injury-report");
  };

  const showToast = (message) => {
    setToastMessage(message);
    toast.success(message, {
      autoClose: 3000,
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
    });
  };

  return (
    <div className="w-full flex flex-col px-4 lg:px-7 max-w-[2700px]">
      <ToastContainer position="top-right" />
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-lg font-bold text-black md:text-2xl w-full">
          Report
        </h1>
        <div className="flex flex-col lg:flex-row gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-[#6938EF] w-32 text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-[0.2rem]">
                New Report
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>New Incident Report</DialogTitle>
              <DialogDescription>
                Notify the relevant people to submit incident report.
              </DialogDescription>
              <CreateReport
                onSubmitSuccess={() =>
                  showToast("Injury report email sent successfully!")
                }
              />
            </DialogContent>
          </Dialog>

          <div className="items-center px-0 justify-end border border-gray-200 rounded-md overflow-hidden hidden lg:flex">
            <button
              className={`w-1/2 md:w-36 font-medium mt-0 text-[16px] rounded-none bg-white text-black border-b-4 border-brand40 rounded-l-sm`}
            >
              Completed Report
            </button>
            <button
              className={`w-1/2 md:w-36 border text-gray-700 mt-0 text-[16px] rounded-none bg-gray-100 border-b-4 border-gray-50/0`}
              onClick={handleViewPendingReports}
            >
              Pending Report
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex lg:hidden items-center px-0 justify-end border border-gray-200 rounded-md overflow-hidden">
        <button
          className={`w-1/2 md:w-full font-medium mt-0 text-[16px] rounded-none bg-white text-black border-b-4 border-brand40 rounded-l-sm`}
        >
          Completed Report
        </button>
        <button
          className={`w-1/2 md:w-full border text-gray-700 mt-0 text-[16px] rounded-none bg-gray-100 border-b-4 border-gray-50/0`}
          onClick={handleViewPendingReports}
        >
          Pending Report
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : report.length === 0 ? (
        <div className="text-center mt-6 bg-white rounded-lg py-[120px] px-3">
          <p className="font-bold">No Report Available</p>
          <p className="text-sm text-gray-500">
            Start by creating the first incident report
          </p>
          {/* <button
            className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-4"
            onClick={handleCreateInjuryReport}
          >
            Create Incident Report
          </button> */}
        </div>
      ) : (
        <div className="w-full overflow-x-scroll rounded-lg shadow-md">
          <table className="w-full bg-white text-black mt-4 rounded-lg text-xs">
            <thead>
              <tr className="bg-[#f8f8f8]">
                <th className="px-2 py-4 md:px-4">Report ID</th>
                <th className="px-0 py-4">Severity</th>
                {/* <th className="px-4 py-2">Status</th> */}
                <th className="px-0 py-4 md:px-4">Location</th>
                <th className="px-0 py-4 md:px-4">Date of Injury</th>
                {/* <th className="px-4 py-2">Injured Employee</th> */}
                {/* <th className="px-4 py-2">Report Date</th> */}
                <th className="px-0 py-4 md:px-4">Reported By</th>
                <th className="pr-2 py-4 md:px-4"></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {report.map((report) => (
                <tr
                  key={report.reportID}
                  className="border-t border-[#E4E7EC] hover:bg-[#F9FAFB]"
                >
                  <td className="px-2 py-4 md:px-4">{report.reportID}</td>
                  <td className="px-0 py-4">
                    <span className={`label label-severity-${report.severity}`}>
                      {severityMapping[report.severity]}
                    </span>
                  </td>
                  {/* <td className="px-4 py-2">{report.status}</td> */}
                  <td className="px-0 py-4 md:px-4">{report.locationID}</td>
                  <td className="px-0 py-4 md:px-4">
                    {new Date(report.dateOfInjury).toLocaleDateString()}
                  </td>
                  {/* <td className="px-4 py-2">{report.injuredEmployeeFirstName}<br />({report.injuredEmployeeID})</td> */}
                  {/* <td className="px-4 py-2">{new Date(report.reportDate).toLocaleDateString()}</td> */}
                  <td className="px-0 py-4 md:px-4">
                    <Avatar
                      name={report.reportByFirstName}
                      round={true}
                      size="30"
                      textSizeRatio={1.75}
                      data-tooltip-id={`tooltip-${report.reportID}`}
                      data-tooltip-content={`${report.reportByFirstName}`}
                      style={{ cursor: "default" }}
                      color="#05603A"
                    />
                    <ReactTooltip
                      id={`tooltip-${report.reportID}`}
                      place="top"
                      effect="solid"
                    />
                  </td>
                  <td className="pr-2 py-4 md:px-4 flex items-center justify-center">
                    <button
                      onClick={() => handleViewDetails(report.reportID)}
                      className="p-1 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8] flex items-center gap-1"
                    >
                      <span className="pl-2 text-xs text-gray-700">
                        More Details
                      </span>
                      <img
                        className="min-w-[16px] min-h-[16px]"
                        src="./images/right-arrow.svg"
                        alt="details icon"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <BackToTopButton />
    </div>
  );
};

export default Report;
