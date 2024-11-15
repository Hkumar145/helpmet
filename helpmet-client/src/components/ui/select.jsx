import React from "react";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F4F3FF" : "#F9FAFB",
    borderColor: state.isFocused ? "#6938EF" : "#E4E7EC",
    borderRadius: "8px",
    fontSize: "14px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#98A2B3",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    "&:hover": {
      color: "#6938EF",
    },
  }),
  menu: (provided) => ({
    ...provided,
    width: "280px",
    padding: "8px",
    borderRadius: "12px",
    marginTop: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    borderRadius: "8px",
    marginBottom: "8px",
    backgroundColor: state.isSelected ? "#F4F3FF" : "#fff",
    color: state.isSelected ? "#4A1FB8" : "#000",
    "&:hover": {
      backgroundColor: "#F4F3FF",
      color: "#4A1FB8",
    },
  }),
};

const CustomSelect = ({
  options,
  onChange,
  value,
  isLoading = false,
  placeholder = "Select...",
  isSearchable = true,
  isMulti = false,
}) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      value={value}
      isLoading={isLoading}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isMulti={isMulti}
      styles={customStyles}
    />
  );
};

export default CustomSelect;