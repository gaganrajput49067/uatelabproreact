import React from "react";

const TableSelectBox = ({
  isDisabled,
  options,
  id,
  name,
  onChange,
  className,
  selectedValue,
  keyEvent,
  onKeyPress,
}) => {
  return (
    <select
      className={`form-control input-sm ${className} m-0 mt-0`}
      value={selectedValue?.label !== "" && selectedValue}
      disabled={isDisabled}
      name={name}
      id={id}
      defaultValue={selectedValue}
      onChange={onChange}
      onKeyDown={(e) => keyEvent && onKeyPress(e, name)}
    >
      {options?.map((ele, index) => (
        <option
          key={index}
          value={ele?.value}
          className={`Status-${ele?.status && ele?.value} p-0 m-0 mt-0`}
          style={selectedValue == ele?.value ? { background: "lightblue" } : {}}
        >
          {ele?.label}
        </option>
      ))}
    </select>
  );
};

export default TableSelectBox;
