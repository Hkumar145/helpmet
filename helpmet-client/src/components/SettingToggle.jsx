import React from "react";

const SettingToggle = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex items-center py-2 px-0 rounded-full w-full justify-end">
            <button
                onClick={() => setActiveTab("Employees")}
                className={`w-1/2 md:w-36 border font-semibold text-black mt-0 text-[16px] rounded-tl-sm rounded-bl-sm rounded-none ${activeTab === "Employees" ? "bg-brand40 text-white border-brand40" : "bg-brand20 text-black border-brand30"}`}
            >
                Employees
            </button>
            <button
                onClick={() => setActiveTab("Departments")}
                className={`w-1/2 md:w-36 border-t border-b font-semibold text-black mt-0 text-[16px] rounded-none ${activeTab === "Departments" ? "bg-brand40 text-white border-brand40" : "bg-brand20 text-black border-brand30"}`}
            >
                Departments
            </button>
            <button
                onClick={() => setActiveTab("Locations")}
                className={`w-1/2 md:w-36 border font-semibold text-black mt-0 text-[16px] rounded-tr-sm rounded-br-sm rounded-none ${activeTab === "Locations" ? "bg-brand40 text-white border-brand40" : "bg-brand20 text-black border-brand30"}`}
            >
                Locations
            </button>
        </div>
    );
};

export default SettingToggle;