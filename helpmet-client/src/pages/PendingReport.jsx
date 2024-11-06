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
          const sortedPendingReports = response.data.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
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
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between gap-4'>
        <h1 className='text-lg text-black md:text-2xl'>Pending Report</h1>
        <button
            onClick={handleViewCompletedReports}
            className='bg-[#6938EF] text-white p-3 mt-0 rounded-lg text-center hover:opacity-90 max-w-40'
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-black mt-4 rounded-lg text-sm">
            <thead>
              <tr>
                {/* <th className="px-4 py-2">Report ID</th> */}
                {/* <th className="px-4 py-2">Severity</th> */}
                <th className="px-2 py-2 md:px-4">Status</th>
                <th className="px-0 py-2 md:px-4">Location</th>
                <th className="px-0 py-2 md:px-4">Date of Injury</th>
                {/* <th className="px-4 py-2">Injured Employee</th> */}
                {/* <th className="px-4 py-2">Report Date</th> */}
                <th className="px-0 py-2 md:px-4">Reported By</th>
                <th className="px-2 py-2 md:px-4"></th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {pendingReports.map((report, index) => (
                <tr key={report.reportID || report._id || `report-${index}`} className="border-t border-[#E4E7EC]">
                  {/* <td className="px-4 py-2">{report.reportID ? report.reportID : "N/A"}</td> */}
                  {/* <td className="px-4 py-2">{severityMapping[report.severity]}</td> */}
                  <td className="px-2 py-2 md:px-4">{report.status}</td>
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
                    />
                    <ReactTooltip id={`tooltip-${report.reportID}`} place="top" effect="solid" />
                  </td>
                  <td className="px-2 py-2 md:px-4">
                    <button
                      onClick={() => handleViewDetails(report._id)}
                      className='bg-purple-600 text-white p-2 rounded hover:bg-purple-800 mt-0'
                    >
                      Details
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
