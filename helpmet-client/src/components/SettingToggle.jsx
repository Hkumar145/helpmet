import React from "react";

const SettingToggle = ({ activeTab, setActiveTab }) => {
  return (
    <div className="items-center px-0 justify-end border border-gray-200 rounded-md overflow-hidden hidden lg:flex">
      <button
        onClick={() => setActiveTab("Employees")}
        className={`w-1/2 md:w-36 font-medium mt-0 text-[16px] rounded-none text-black border-b-4 ${
          activeTab === "Employees"
            ? "bg-white border-brand40 rounded-l-md"
            : "bg-gray-100 text-gray-700 border-b-4 border-gray-50/0"
        }`}
      >
        Employees
      </button>
      <button
        onClick={() => setActiveTab("Departments")}
        className={`w-1/2 md:w-36 font-medium mt-0 text-[16px] rounded-none  ${
          activeTab === "Departments"
            ? "bg-white text-black border-b-4 border-brand40"
            : "bg-gray-100 text-gray-700 border-b-4 border-gray-50/0"
        }`}
      >
        Departments
      </button>
      <button
        onClick={() => setActiveTab("Locations")}
        className={`w-1/2 md:w-36 font-medium mt-0 text-[16px] rounded-none text-gray-700 border-b-4  ${
          activeTab === "Locations"
            ? "border-brand40 rounded-r-md bg-white text-black"
            : "bg-gray-100 text-gray-700 border-b-4 border-gray-50/0"
        }`}
      >
        Locations
      </button>
    </div>
  );
};

export default SettingToggle;
