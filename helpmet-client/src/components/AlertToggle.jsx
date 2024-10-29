import React, { useState } from "react";

const AlertToggle = ({ viewMode, setViewMode }) => {
    return (
        <div className="flex items-center p-2 rounded-full">
            <button
                onClick={() => setViewMode('employeeAlert')}
                className={`w-36 text-black mt-0 p-2 rounded-tl-sm rounded-bl-sm rounded-none ${viewMode === 'employeeAlert' ? 'bg-indigo-700 text-white' : 'bg-purple-300 text-black hover:bg-purple-400'}`}
            >
                Employee Alert
            </button>
            <button
                onClick={() => setViewMode('departmentAlert')}
                className={`w-36 text-black mt-0 p-2 rounded-tr-sm rounded-br-sm rounded-none ${viewMode === 'departmentAlert' ? 'bg-indigo-700 text-white' : 'bg-purple-300 text-black hover:bg-purple-400'}`}
            >
                Department Alert
            </button>
        </div>
    );
};

export default AlertToggle;
