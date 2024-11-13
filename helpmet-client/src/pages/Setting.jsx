import React, { useState, useEffect } from 'react';
import Employee from './Employee';
import Department from './Department';
import Location from './Location';
import SettingToggle from '../components/SettingToggle';
import LoadingSpinner from '../components/LoadingSpinner';

const Setting = () => {
  const [activeTab, setActiveTab] = useState('Employees');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay with animation
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // Longer delay to show animation

    return () => clearTimeout(timer);
  }, [activeTab]);

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
    <div className="flex flex-col gap-0 text-black w-full px-6">
      <div className='flex flex-col md:flex-row items-center justify-between gap-6 pb-2 max-w-full lg:w-full'>
        <h1 className='text-2xl font-bold'>Settings</h1>
        <SettingToggle activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="mt-0">
        {loading ? (
          <div className="animate-fade-in">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
