import { useEffect, useState } from "react";
import DatePicker from "./DatePicker";

const DatePicker2 = ({
  date,
  onChange,
  name,
  maxDate,
  minDate,
  onChangeTime,
  onBlur,
  secondName,
  disabled,
  time,
  index,
}) => {
  console.log(date);

  const [Time, setTime] = useState(initialTime());
  function initialTime() {
    if (secondName === "FromTime") {
      return { Hour: "00", Minute: "00", Second: "00" };
    } else if (secondName === "ToTime") {
      return { Hour: "23", Minute: "59", Second: "59" };
    } else {
      const hours = time
        ? new Date(date).getHours().toString().padStart(2, "0")
        : "";
      const minutes = time
        ? new Date(date).getMinutes().toString().padStart(2, "0")
        : "";
      const seconds = time
        ? new Date(date).getSeconds().toString().padStart(2, "0")
        : "";
      return { Hour: hours, Minute: minutes, Second: seconds };
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Hour") {
      if (value === "" || value.length === 1) {
        setTime({ ...Time, [name]: value });
        return;
      }

      let hour = parseInt(value.replace(/\D/g, ""));
      if (isNaN(hour) || hour < 0 || hour > 23) return;

      setTime({ ...Time, [name]: hour });
    } else if (name === "Minute") {
      if (value === "" || value.length === 1) {
        setTime({ ...Time, [name]: value });
        return;
      }

      let minute = parseInt(value.replace(/\D/g, ""));
      if (isNaN(minute) || minute < 0 || minute > 59) return;

      setTime({ ...Time, [name]: minute });
    } else if (name === "Second") {
      if (value === "" || value.length === 1) {
        setTime({ ...Time, [name]: value });
        return;
      }

      let second = parseInt(value.replace(/\D/g, ""));
      if (isNaN(second) || second < 0 || second > 59) return;

      setTime({ ...Time, [name]: second });
    } else {
      setTime({ ...Time, [name]: value });
    }
  };

  useEffect(() => {
    if (secondName) {
      onChangeTime(Time, secondName, index);
    }
  }, [Time, index]);

  return (
    <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
      <tr>
        <td className="d-flex align-items-centre">
          <DatePicker
            showMonthDropdown
            selected={date}
            onChange={(e) => onChange(e, name)}
            name={name}
            disabled={disabled}
            autoComplete="off"
            onBlur={onBlur}
            showYearDropdown
            className={"p-0 m-0"}
            dateFormat="dd-MMM-yyyy"
            maxDate={maxDate}
            minDate={minDate ? minDate : new Date("01-01-1900")}
            placeholder="Select Date"
            placeholderText={"DD/MM/YYYY"}
          />
        </td>
        {secondName && (
          <td>
            <input
              type="text"
              className={"form-control input-sm"}
              style={{ width: "40px" }}
              value={Time?.Hour}
              name="Hour"
              disabled={disabled}
              onChange={handleChange}
            />
          </td>
        )}
        {secondName && (
          <td>
            <input
              type="text"
              className={"form-control input-sm"}
              style={{ width: "40px" }}
              value={Time?.Minute}
              disabled={disabled}
              name="Minute"
              onChange={handleChange}
            />
          </td>
        )}
        {secondName && (
          <td>
            <input
              type="text"
              className={"form-control input-sm"}
              style={{ width: "40px" }}
              value={Time?.Second}
              disabled={disabled}
              name="Second"
              onChange={handleChange}
            />
          </td>
        )}
      </tr>
    </table>
  );
};

export default DatePicker2;
