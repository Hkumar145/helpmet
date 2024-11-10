import React, { useState } from 'react';
import Employee from './Employee';
import Department from './Department';
import Location from './Location';

const Setting = () => {
  const [activeTab, setActiveTab] = useState('Employees');

  const renderContent = () => {
    switch (activeTab) {
      case 'Employees':
        return <Employee />;
      case 'Departments':
        return <Department />;
      case 'Locations':
        return <Location />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 text-black w-full px-6">
      <div className='flex flex-col md:flex-row items-center justify-between gap-6 border-b-2 border-gray-300 pb-2 max-w-full lg:w-full'>
        <h1 className='text-lg font-bold'>Settings</h1>
        <div className="flex justify-end text-xs">
          <button
            className={`px-4 py-2 mt-0 ${activeTab === 'Employees' ? 'bg-[#D9D6FE] border-2 border-[#4A1FB8] text-black' : 'text-gray-700'}`}
            onClick={() => setActiveTab('Employees')}
          >
            Employees
          </button>
          <button
            className={`px-4 py-2 mt-0 ${activeTab === 'Departments' ? 'bg-[#D9D6FE] border-2 border-[#4A1FB8] text-black' : 'text-gray-700'}`}
            onClick={() => setActiveTab('Departments')}
          >
            Departments
          </button>
          <button
            className={`px-4 py-2 mt-0 ${activeTab === 'Locations' ? 'bg-[#D9D6FE] border-2 border-[#4A1FB8] text-black' : 'text-gray-700'}`}
            onClick={() => setActiveTab('Locations')}
          >
            Locations
          </button>
        </div>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Setting;
