import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import Select, { components } from "react-select";

const SelectBox = ({
  placeholderName,
  searchable,
  respclass,
  id,
  onChange,
  dynamicOptions,
  value,
  name,
  defaultValue,
  inputId,
  isDisabled
}) => {
  const [t] = useTranslation();
  const options = [
    {
      value: "chocolate",
      label: "chocolate",
    },
    { value: "strawberry ", label: "strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "", label: "No Option Avalilable" },
  ];
  const selectRef = useRef(null);
  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: 15,
      minHeight: 30,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      flexWrap: "nowrap",
      borderColor: state.isFocused ? "#ced4da" : "#ced4da",
      boxShadow: "none",
      whiteSpace: "normal",
      fontSize: "10",
      // fontWeight: " normal"
    }),
    placeholder: (defaultStyles, state) => {
      return {
        ...defaultStyles,
        color: "none",
        position: "absolute",
        top: state.hasValue || state.selectProps.inputValue ? -8 : "",
        backgroundColor:
          state.hasValue || state.selectProps.inputValue
            ? "white"
            : "transparent",
        transition: "top 0.1s, font-size 0.1s",
        fontSize:
          state.hasValue || state.selectProps.inputValue ? "13px" : "12px",
        lineHeight: "18px",
        width: "80%",
        fontWeight:
          state.hasValue || state.selectProps.isFocused ? " 600" : "500",
      };
    },
    menu: (styles) => ({
      ...styles,
      width: "100%",
      fontSize: 12,
      padding: 0,
      textAlign: "left",
    }),
    menuList: (styles) => ({
      ...styles,
      width: "100%",

      fontSize: 12,
      padding: 0,
      textAlign: "left",
    }),
    container: (provided, state) => ({
      ...provided,
      // marginTop: 50
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      overflow: "visible",
      fontSize: "10",
    }),

    singleValue: (provided, state) => ({
      ...provided,
      fontSize: "12px",
      fontWeight: "600",
    }),
  };

  const handleSelectBox = (value) => {
    let e = {
      target: {
        name: name || "",
        value: value?.value || "",
        label:value?.label||"",
        option: value,
      },
    };

    return onChange(e) ? onChange(e) : () => {};
  };

  return (
    <>
      <div className={respclass}>
        <div className="form-group">
          <Select
            options={dynamicOptions ? dynamicOptions : options}
            isSearchable={searchable}
            id={id}
            ref={selectRef}
            styles={customStyles}
            inputId={inputId}
            value={dynamicOptions?.find((option) => option.value === value)}
            placeholder={placeholderName}
            onChange={handleSelectBox}
            isDisabled={isDisabled}
            name={name}
            defaultValue={defaultValue}
          />
          
        </div>
      </div>
    </>
  );
};

export default SelectBox;
