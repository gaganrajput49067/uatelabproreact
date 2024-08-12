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
  onChange,
  tabIndex,
  timeOnly,

  maxDate,
  minDate,
}) {
  const handleDateChange = (e) => {
    onChange(e?.target?.value, name);
  };
  return (
    <>
      <div className={`${respclass} mb-3`} style={{ position: "relative" }}>
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
            onChange={handleDateChange}
            // wrapperClassName="datepicker"
            tabIndex={tabIndex ? tabIndex : "-1"}
            maxDate={maxDate}
            minDate={minDate}
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
