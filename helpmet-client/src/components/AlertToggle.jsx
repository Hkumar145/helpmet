import React from "react";

const AlertToggle = ({ viewMode, setViewMode }) => {
    return (
        <div className="flex items-center p-2 rounded-full">
            <button
                onClick={() => setViewMode("employee")}
                className={`sm:w-36 text-black mt-0 p-2 text-xs lg:text-sm transition-all duration-300 rounded-tl-sm rounded-bl-sm rounded-none ${viewMode === "employee" ? "bg-indigo-700 text-white" : "bg-purple-300 text-black hover:bg-purple-400"}`}
            >
                Employee Alert
            </button>
            <button
                onClick={() => setViewMode("department")}
                className={`sm:w-36 text-black mt-0 p-2 text-xs lg:text-sm transition-all duration-300 rounded-tr-sm rounded-br-sm rounded-none ${viewMode === "department" ? "bg-indigo-700 text-white" : "bg-purple-300 text-black hover:bg-purple-400"}`}
            >
                Department Alert
            </button>
        </div>
    );
};

export default AlertToggle;
