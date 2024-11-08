import React from "react";

const AlertToggle = ({ viewMode, setViewMode }) => {
    return (
        <div className="flex items-center p-2 rounded-full w-full justify-end">
            <button
                onClick={() => setViewMode("employee")}
                className={`w-1/2 md:w-36 border font-semibold text-black mt-0 text-[16px] rounded-tl-sm rounded-bl-sm rounded-none ${viewMode === "employee" ? "bg-brand40 text-white border-brand40" : "bg-brand20 text-black border-brand30"}`}
            >
                Employee Alert
            </button>
            <button
                onClick={() => setViewMode("department")}
                className={`w-1/2 md:w-36 border font-semibold text-black mt-0 text-[16px] rounded-tr-sm rounded-br-sm rounded-none ${viewMode === "department" ? "bg-brand40 text-white border-brand40" : "bg-brand20 text-black border-brand30"}`}
            >
                Department Alert
            </button>
        </div>
    );
};

export default AlertToggle;
