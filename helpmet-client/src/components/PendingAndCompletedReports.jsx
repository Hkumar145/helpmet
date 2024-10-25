import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PendingAndCompletedReports = () => {
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();

  useEffect(() => {
    if (companyID) {
      // Fetch pending reports count
      axios.get(`/companies/${companyID}/reports/pending`)
      
        .then(response => {
          setPendingReportsCount(response.data.length); // Set the pending reports count
        })
        .catch(error => {
          console.error("Error fetching pending reports:", error);
        });

      // Fetch completed reports count
      axios.get(`/companies/${companyID}/reports`)
        .then(response => {
          setCompletedReportsCount(response.data.length); // Set the completed reports count
        })
        .catch(error => {
          console.error("Error fetching completed reports:", error);
        });
    }
  }, [companyID]);

  const handleViewPendingReports = () => {
    navigate(`/pending-report`);
  };

  const handleViewCompletedReports = () => {
    navigate(`/report`);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-white text-2xl'>Reports Summary</h1>
      </div>

      <div className='mt-4'>
        <p className='text-white text-lg'>
          Total Pending Reports: {pendingReportsCount}
        </p>
        <p className='text-white text-lg'>
          Total Completed Reports: {completedReportsCount}
        </p>
      </div>

      <div className='mt-4 flex gap-4'>
        <button
          onClick={handleViewPendingReports}
          className='bg-purple-700 text-white p-3 rounded-lg hover:opacity-90'
        >
          View Pending Reports
        </button>

        <button
          onClick={handleViewCompletedReports}
          className='bg-green-700 text-white p-3 rounded-lg hover:opacity-90'
        >
          View Completed Reports
        </button>
      </div>
    </div>
  );
};

export default PendingAndCompletedReports;
