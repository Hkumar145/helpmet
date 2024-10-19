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
        <h1 className='text-white text-2xl'>Report</h1>
        <div className='flex gap-2'>
          <button
            onClick={handleViewPendingReports}
            className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-95 max-w-40'
          >
            Pending Report
          </button>
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
          </div>
      </div>

      <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white mt-4 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">Report ID</th>
              <th className="px-4 py-2">Severity</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Date of Injury</th>
              <th className="px-4 py-2">Report Date</th>
              <th className="px-4 py-2">Reported By</th>
              <th className="px-4 py-2">Injured Employee ID</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {report.map((report) => (
              <tr key={report.reportID} className="border-t border-gray-700">
                <td className="px-4 py-2">{report.reportID}</td>
                <td className="px-4 py-2">{severityMapping[report.severity]}</td>
                <td className="px-4 py-2">{report.status}</td>
                <td className="px-4 py-2">{report.locationID}</td>
                <td className="px-4 py-2">{new Date(report.dateOfInjury).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(report.reportDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{report.reportBy}</td>
                <td className="px-4 py-2">{report.injuredEmployeeID}</td>
                <td className="px-4 py-2">
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