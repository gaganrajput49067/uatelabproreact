import React from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "primereact/tooltip";

function Input({
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
  display,
  onChange,
  disabled,
  readOnly,
  defaultValue,
  onBlur,
  inputRef,
  removeFormGroupClass,
  onInput,
  max,
  min,
  showTooltipCount,
  tabIndex,
  error,
  errorMessage,
}) {
  const [t] = useTranslation();

  return (
    <>
      <div className={`${respclass}  custominputbox`}>
        <div className={removeFormGroupClass ? "" : "form-group"}>
          <input
            type={type}
            className={`${className} ${error ? "required-fields-active" : ""}`}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onKeyDown={onKeyDown}
            onChange={onChange}
            autoComplete="off"
            step={type === "number" ? "0.01" : ""}
            required={required}
            ref={inputRef}
            onBlur={onBlur}
            max={max}
            min={min}
            style={{ textAlign: display ?? "left" }}
            onInput={onInput}
            disabled={disabled ? disabled : false}
            tabIndex={tabIndex ? tabIndex : "-1"}
            readOnly={readOnly}
          />
          <label htmlFor={id} className="lable truncate">
            {lable}
          </label>
        </div>
      </div>
      {error && <div className="error-message">{errorMessage}</div>}
    </>
  );
}

export default Input;
