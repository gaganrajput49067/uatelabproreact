import React from "react";
import { Calendar } from "primereact/calendar";

const TimePicker = (props) => {
  const { respclass, placeholderName, value, onChange, name, lable, id } =
    props;

  const handleTimeChange = (e) => {
    const selectedDate = e.value;
    onChange(selectedDate, name);
  };

  return (
    <div className={`${respclass} mb-3`} style={{ position: "relative" }}>
      <Calendar
        id={id}
        value={value}
        onChange={handleTimeChange}
        timeOnly
        hourFormat="12"
        placeholder={placeholderName}
        name={name}
      />
      <label htmlFor={id} className="label lable truncate">
        {lable}
      </label>
    </div>
  );
};

export default TimePicker;
