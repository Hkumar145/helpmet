import React, { useState, useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import CreateReport from '../components/CreateReport'
import axios from '../api/axios'

const Report = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    axios.get('/reports')
    // Need to get a list of all reports by CompanyID      router.get("/companies/:id/reports", getReportsByCompany);
      .then(response => {
        const sortedReports = response.data.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
        setReport(sortedReports);
      })
      .catch(error => {
        console.error("Error fetching reports:", error);
      });
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-white text-2xl'>Reports</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-95 max-w-40'>
              New Report
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>New Incident Report</DialogTitle>
            <DialogDescription>Create an incident report and add the relevant people to notify.</DialogDescription>
            <CreateReport />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white mt-4 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">Report ID</th>
              <th className="px-4 py-2">Reported By</th>
              <th className="px-4 py-2">Injured Employee ID</th>
              <th className="px-4 py-2">Date of Injury</th>
              <th className="px-4 py-2">Report Date</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Injury Type</th>
              <th className="px-4 py-2">Severity</th>
              <th className="px-4 py-2">Witness ID</th>
            </tr>
          </thead>
          <tbody>
            {report.map((report) => (
              <tr key={report.reportID} className="border-t border-gray-700">
                <td className="px-4 py-2">{report.reportID}</td>
                <td className="px-4 py-2">{report.reportedBy}</td>
                <td className="px-4 py-2">{report.injuredEmployeeID}</td>
                <td className="px-4 py-2">{new Date(report.dateOfInjury).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(report.reportDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{report.locationID}</td>
                <td className="px-4 py-2">{report.injuryTypeID}</td>
                <td className="px-4 py-2">{report.severity}</td>
                <td className="px-4 py-2">{report.witnessID || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Report