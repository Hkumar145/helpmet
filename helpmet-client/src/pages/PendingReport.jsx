import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import BackToTopButton from '../components/BackToTopButton';

const severityMapping = {
  1: 'Minor',
  2: 'Moderate',
  3: 'Severe',
  4: 'Significant',
  5: 'Fatal',
};

const injuryTypeMapping = {
};

const PendingReport = () => {
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();

  useEffect(() => {
    if (companyID) {
      axios.get(`/companies/${companyID}/reports/pending`)
        .then(response => {
          const sortedPendingReports = response.data.sort((a, b) => new Date(b.dateOfInjury) - new Date(a.dateOfInjury));
          setPendingReports(sortedPendingReports);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching pending reports:", error);
          setLoading(false);
        });
    }
  }, [companyID]);

  const handleViewDetails = (id) => {
    navigate(`/pending-report/${id}`);
  };

  const handleViewCompletedReports = () => {
    navigate(`/report`);
  };

  const handleCreateInjuryReport = () => {
    navigate('/injury-report');
  };

  return (
    <div className='w-full flex flex-col gap-4 px-6'>
      <div className='flex flex-row items-center justify-between gap-4'>
        <h1 className='text-lg text-black md:text-2xl'>Pending Report</h1>
        <button
            onClick={handleViewCompletedReports}
            className="bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4"
          >
            Completed Report
          </button>
      </div>

      {loading ? (
        <p className='text-center mt-6 max-w-[710px] min-w-full'>Loading...</p>
      ) : pendingReports.length === 0 ? (
        <div className='text-center mt-6 bg-white rounded-lg py-[120px] sm:px-auto lg:px-[350px]'>
          <p className='font-bold text-nowrap'>No Reports Available</p>
          <p className='text-sm text-gray-500 text-nowrap'>Start by creating the first incident report</p>
          <button
            className='bg-green-700 text-white p-3 rounded-lg mt-4 text-nowrap'
            onClick={handleCreateInjuryReport}
          >
            Create Incident Report
          </button>
        </div>
      ) : (
        <div className="w-full overflow-x-scroll">
          <table className="w-full bg-white text-black mt-4 rounded-lg text-xs">
            <thead>
              <tr>
                <th className="px-4 py-2">Report ID</th>
                <th className="px-2 py-2">Severity</th>
                <th className="px-0 py-2 md:px-4">Status</th>
                <th className="px-0 py-2 md:px-4">Location</th>
                <th className="px-0 py-2 md:px-4">Date of Injury</th>
                {/* <th className="px-4 py-2">Injured Employee</th> */}
                {/* <th className="px-4 py-2">Report Date</th> */}
                <th className="px-0 py-2 md:px-4">Reported By</th>
                <th className="pr-2 py-2 md:px-4"></th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {pendingReports.map((report, index) => (
                <tr key={report.reportID || report._id || `report-${index}`} className="border-t border-[#E4E7EC] hover:bg-[#F9FAFB]">
                  <td className="px-4 py-2">{report._id ? report._id : "N/A"}</td>
                  <td className="px-2 py-2">
                    <span className={`label label-severity-${report.severity}`}>{severityMapping[report.severity]}</span>
                  </td>
                  <td className="px-0 py-2 md:px-4"><span className={`text-nowrap label ${report.status === "On going" ? "label-ongoing" : "label-onhold"}`}>{report.status}</span></td>
                  <td className="px-0 py-2 md:px-4">{report.locationID}</td>
                  <td className="px-0 py-2 md:px-4">{new Date(report.dateOfInjury).toLocaleDateString()}</td>
                  {/* <td className="px-4 py-2">{report.injuredEmployeeFirstName}<br />({report.injuredEmployeeID})</td> */}
                  {/* <td className="px-4 py-2">{new Date(report.reportDate).toLocaleDateString()}</td> */}
                  <td className="px-0 py-2 md:px-4">
                    <Avatar
                      name={report.reportByFirstName}
                      round={true}
                      size="30"
                      textSizeRatio={1.75}
                      data-tooltip-id={`tooltip-${report.reportID}`}
                      data-tooltip-content={`${report.reportByFirstName}`}
                      style={{ cursor: 'default' }}
                      color="#05603A"
                    />
                    <ReactTooltip id={`tooltip-${report.reportID}`} place="top" effect="solid" />
                  </td>
                  <td className="pr-2 py-2 md:px-4">
                    <button
                      onClick={() => handleViewDetails(report._id)}
                      className='p-1 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]'
                    >
                      <img className="min-w-[16px] min-h-[16px]" src="./images/right-arrow.svg" alt="details icon" />
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

export default PendingReport;
