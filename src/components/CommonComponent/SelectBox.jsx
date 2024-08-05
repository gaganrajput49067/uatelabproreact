import React from "react";
import { useTranslation } from "react-i18next";
import Select, { components } from "react-select";

const SelectBox = ({
  placeholderName,
  searchable,
  respclass,
  id,
  handleChange,
  dynamicOptions,
  value,
  name,
  defaultValue,
  inputId,
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
      fontSize: "11px",
      fontWeight: "600",
    }),
  };

  const handleSelectBox = (value) => {
    let e = {
      target: {
        name: name || "",
        value: value?.value || "",
        option: value,
      },
    };

    return handleChange(e) ? handleChange(e) : () => {};
  };

  return (
    <>
      <div className={respclass}>
        <div className="form-group">
          <Select
            options={dynamicOptions ? dynamicOptions : options}
            isSearchable={searchable}
            id={id}
            styles={customStyles}
            inputId={inputId}
            value={dynamicOptions?.find((option) => option.value === value)}
            placeholder={placeholderName}
            onChange={handleSelectBox}
            name={name}
            defaultValue={defaultValue}
          />
        </div>
      </div>
    </>
  );
};

export default SelectBox;
