import React, { useState } from "react";
import Employee from "./Employee";
import Department from "./Department";
import Location from "./Location";
import SettingToggle from "../components/SettingToggle";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("Employees");

  const renderContent = () => {
    switch (activeTab) {
      case "Employees":
        return <Employee />;
      case "Departments":
        return <Department />;
      case "Locations":
        return <Location />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-0 text-black w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2 max-w-full lg:w-full">
        <h1 className="text-2xl font-bold">Settings</h1>
        <SettingToggle activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default Setting;
