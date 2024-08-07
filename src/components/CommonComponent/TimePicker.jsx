
import React from "react";
import { Calendar } from "primereact/calendar";

const TimePicker = (props) => {
  const { respclass, placeholderName, value, handleChange, name, lable, id } =
    props;
  return (
    <>
      <div className={respclass} style={{ position: "relative" }}>
        <Calendar
          id="calendar-timeonly"
          style={{ width: "100px" }}
          value={value}
          onChange={handleChange}
          timeOnly
          hourFormat="12"
          placeholder={placeholderName}
          name={name}
        />

        <label
          htmlFor={id}
          className="label lable truncate "
          style={{ fontSize: "5px !important" }}
        >
          {lable}
        </label>
      </div>
    </>
  );
};

export default TimePicker;
