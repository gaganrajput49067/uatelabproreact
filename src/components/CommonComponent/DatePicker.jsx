import React from "react";
import { Calendar } from "primereact/calendar";

function DatePicker({
  type,
  name,
  className,
  respclass,
  id,
  placeholder,
  lable,
  value,
  onKeyDown,
  required,
  handleChange,
  tabIndex,
  timeOnly
}) {
  return (
    <>
      <div className={respclass} style={{ position: "relative" }}>
        <div className="form-group">
          <Calendar
            inputId={id}
            id={id}
            showIcon
            placeholder={placeholder}
            className={className}
            dateFormat="dd-MM-yy"
            value={value}
            name={name}
            onChange={handleChange}
            wrapperClassName="datepicker"
            tabIndex={tabIndex?tabIndex:"-1"}
          />
      
          <label
            htmlFor={id}
            className="label lable truncate "
            style={{ fontSize: "5px !important" }}
          >
            {lable}
          </label>
        </div>
      </div>
    </>
  );
}

export default DatePicker;
