import React from 'react';
import { useNavigate } from 'react-router-dom';

const Setting = () => {
  const navigate = useNavigate();

  const goToEmployeeSettings = () => {
    navigate('/setting-employee');
  };

  const goToDepartmentSettings = () => {
    navigate('/setting-department');
  };

  const goToLocationSettings = () => {
    navigate('/setting-location');
  };

  return (
    <div>
      <h1>Settings</h1>
      <div className='flex flex-row gap-8'>
        <button
            className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-95 max-w-40'
            onClick={goToEmployeeSettings}>
                Employee
        </button>
        <button
            className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-95 max-w-40'
            onClick={goToDepartmentSettings}>
                Department
        </button>
        <button
            className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-95 max-w-40'
            onClick={goToLocationSettings}>
                Location
        </button>
      </div>
    </div>
  );
};

export default Setting;