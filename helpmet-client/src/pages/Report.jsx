import React, { useState, useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import CreateReport from '../components/CreateReport'
import { useSelector } from 'react-redux'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

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
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();

  useEffect(() => {
    if (companyID) {
      axios.get(`/companies/${companyID}/reports`)
        .then(response => {
          const sortedReports = response.data.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
          setReport(sortedReports);
        })
        .catch(error => {
          console.error("Error fetching reports:", error);
        });
    }
  }, [companyID]);

  const handleViewDetails = (reportID) => {
    navigate(`/report/${reportID}`);
  };

  const handleViewPendingReports = () => {
    navigate(`/pending-report`);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-lg text-black md:text-2xl'>Report</h1>
        <div className='flex gap-2'>
          <Dialog>
            <DialogTrigger asChild>
              <button className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-95 max-w-40'>
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
            className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-95 max-w-40'
          >
            Pending Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-black mt-4 rounded-lg text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 md:px-4">Report ID</th>
              {/* <th className="px-4 py-2">Severity</th> */}
              {/* <th className="px-4 py-2">Status</th> */}
              <th className="px-0 py-2 md:px-4">Location</th>
              <th className="px-0 py-2 md:px-4">Date of Injury</th>
              {/* <th className="px-4 py-2">Injured Employee</th> */}
              {/* <th className="px-4 py-2">Report Date</th> */}
              <th className="px-0 py-2 md:px-4">Reported By</th>
              <th className="px-2 py-2 md:px-4"></th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {report.map((report) => (
              <tr key={report.reportID} className="border-t border-gray-700">
                <td className="px-2 py-2 md:px-4">{report.reportID}</td>
                {/* <td className="px-4 py-2">{severityMapping[report.severity]}</td> */}
                {/* <td className="px-4 py-2">{report.status}</td> */}
                <td className="px-0 py-2 md:px-4">{report.locationID}</td>
                <td className="px-0 py-2 md:px-4">{new Date(report.dateOfInjury).toLocaleDateString()}</td>
                {/* <td className="px-4 py-2">{report.injuredEmployeeFirstName}<br />({report.injuredEmployeeID})</td> */}
                {/* <td className="px-4 py-2">{new Date(report.reportDate).toLocaleDateString()}</td> */}
                <td className="px-0 py-2 md:px-4">{report.reportByFirstName}<br />({report.reportBy})</td>
                <td className="px-0 py-2 md:px-4">
                  <button
                    onClick={() => handleViewDetails(report.reportID)}
                    className='bg-purple-600 text-white p-2 rounded hover:bg-purple-800'
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Report