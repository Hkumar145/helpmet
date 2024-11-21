import React, { useState } from "react";
import Employee from "./Employee";
import Department from "./Department";
import Location from "./Location";
import SettingToggle from "../components/SettingToggle";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("Departments");

  const renderContent = () => {
    switch (activeTab) {
      case "Departments":
        return <Department />;
      case "Employees":
        return <Employee />;
      case "Locations":
        return <Location />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-0 text-black w-full px-4 lg:px-7 max-w-[2700px]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2 max-w-full lg:w-full">
        <h1 className="text-2xl font-bold">Settings</h1>
        <SettingToggle activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default Setting;
