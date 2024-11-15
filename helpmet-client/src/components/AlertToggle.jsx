import React from "react";

const AlertToggle = ({ viewMode, setViewMode }) => {
    return (
        <div className="w-full sm:w-auto items-center px-0 justify-end border border-gray-200 rounded-md overflow-hidden lg:flex">
           
            <button
                onClick={() => setViewMode("employee")}
                className={`w-1/2 sm:w-36 mt-0 text-[16px] rounded-none ${
                    viewMode === "employee"
                        ? "bg-white text-black border-b-4 border-brand40 font-medium "
                        : "bg-gray-100 text-gray-700 border-b-4 border-gray-50/0"
                }`}
            >
                Employee Alert
            </button>
            <button
                onClick={() => setViewMode("department")}
                className={`w-1/2 sm:w-36 mt-0 text-[16px] rounded-none ${
                    viewMode === "department"
                        ? "bg-white text-black border-b-4 border-brand40 font-medium "
                        : "bg-gray-100 text-gray-700 border-b-4 border-gray-50/0"
                }`}
            >
                Department Alert
            </button>
        </div>
    );
};

export default AlertToggle;
