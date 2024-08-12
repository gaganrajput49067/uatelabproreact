import React from "react";
import { TextBox } from "rc-easyui";
import { useTranslation } from "react-i18next";

function Input({
  type,
  name,
  className,
  id,
  placeholder,
  label,
  checked,
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
  onInput,
  max,
  min,
  showTooltipCount,
  tabIndex,
}) {
  const [t] = useTranslation();

  return (
    <>
      <div className="custominputbox mb-3">
        <div className="form-group">
          <input
            type={type}
            className={`${className} form-control`}
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
            checked={checked}
            maxLength={max}
            minLength={min}
            max={max}
            min={min}
            style={{ textAlign: display ?? "left" }}
            onInput={onInput}
            disabled={disabled}
            tabIndex={tabIndex}
            readOnly={readOnly}
          />
          <label htmlFor={id} className="lable truncate">
            {lable}
          </label>
        </div>
      </div>
    </>
  );
}

export default Input;
