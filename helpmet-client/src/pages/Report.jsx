import React, { useState, useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import CreateReport from '../components/CreateReport'
import { useSelector } from 'react-redux'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
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

const Report = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();

  useEffect(() => {
    if (companyID) {
      axios.get(`/companies/${companyID}/reports`)
        .then(response => {
          const sortedReports = response.data.sort((a, b) => new Date(b.dateOfInjury) - new Date(a.dateOfInjury));
          setReport(sortedReports);
          setLoading(false);
        })
        .catch(error => {
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
    navigate('/injury-report');
  };

  return (
    <div className='w-full flex flex-col px-6'>
      <div className='flex flex-row items-center justify-between gap-4'>
        <h1 className='text-lg text-black md:text-2xl'>Report</h1>
        <div className='flex gap-2'>
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0">
                New Report
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>New Incident Report</DialogTitle>
              <DialogDescription>Notify the relevant people to submit incident report.</DialogDescription>
              <CreateReport />
            </DialogContent>
          </Dialog>
          <button
            onClick={handleViewPendingReports}
            className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0"
          >
            Pending Report
          </button>
        </div>
      </div>

      {loading ? (
        <p className='text-center mt-6 max-w-[710px] min-w-full'>Loading...</p>
      ) : report.length === 0 ? (
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
        <div className="w-full">
        <table className="w-full bg-white text-black mt-4 rounded-lg text-xs">
            <thead>
              <tr>
                <th className="px-2 py-2 md:px-4">Report ID</th>
                <th className="px-0 py-2">Severity</th>
                {/* <th className="px-4 py-2">Status</th> */}
                <th className="px-0 py-2 md:px-4">Location</th>
                <th className="px-0 py-2 md:px-4">Date of Injury</th>
                {/* <th className="px-4 py-2">Injured Employee</th> */}
                {/* <th className="px-4 py-2">Report Date</th> */}
                <th className="px-0 py-2 md:px-4">Reported By</th>
                <th className="pr-2 py-2 md:px-4"></th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {report.map((report) => (
                <tr key={report.reportID} className="border-t border-[#E4E7EC] hover:bg-[#F9FAFB]">
                  <td className="px-2 py-2 md:px-4">{report.reportID}</td>
                  <td className="px-0 py-2">
                    <span className={`label label-severity-${report.severity}`}>{severityMapping[report.severity]}</span>
                  </td>
                  {/* <td className="px-4 py-2">{report.status}</td> */}
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
                      onClick={() => handleViewDetails(report.reportID)}
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
  )
}

export default Report