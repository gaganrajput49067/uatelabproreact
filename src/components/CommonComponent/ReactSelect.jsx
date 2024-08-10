import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import Select, { components } from "react-select";
const { ValueContainer, Placeholder } = components;

const CustomValueContainer = ({ children, ...props }) => (
  <ValueContainer {...props}>
    <Placeholder {...props} isFocused={props.isFocused} className="truncate">
      {props.selectProps.placeholder}
    </Placeholder>
    {React.Children.map(children, (child) =>
      child && child.type !== Placeholder ? child : null
    )}
  </ValueContainer>
);

const ReactSelect = ({
  placeholderName,
  searchable,
  // defaultValue,
  respclass,
  id,
  handleChange,
  value,
  requiredClassName,
  dynamicOptions,
  name,
  inputId,
  isDisabled,
  ref,
  DropdownIndicator,
  tabIndex,
}) => {
  const [t] = useTranslation();
  const selectRef = useRef(null);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: 15,
      minHeight: "24px !important",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      flexWrap: "nowrap",
      borderColor: state.isFocused ? "#ced4da" : "#ced4da",
      boxShadow: "none",
      whiteSpace: "normal",
      
    
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
    }),
    menuList: (styles) => ({
      ...styles,
      width: "100%",
      fontSize: 12,
      padding: 0,
    }),
    container: (provided, state) => ({
      ...provided,
      // marginTop: 50
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      overflow: "visible",
    }),
  };

  const DefaultDropdownIndicator = () => (
    <div className="custom-dropdown-indicator">
      {!DropdownIndicator && (
        <svg
          height="20"
          width="20"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
          className="css-tj5bde-Svg"
        >
          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
        </svg>
      )}
    </div>
  );

  return (
    <>
      <div className={respclass}>
        <div className="form-group">
          <Select
            options={dynamicOptions ? dynamicOptions : []}
            isSearchable={searchable}
            // defaultValue={defaultValue}
            components={{
              ValueContainer: CustomValueContainer,
              DropdownIndicator: DefaultDropdownIndicator,
            }}
            id={id}
            ref={selectRef}
            inputId={inputId}
            value={
              value
                ? dynamicOptions?.find((option) => option?.value === value)
                : ""
            }
            styles={customStyles}
            placeholder={placeholderName}
            onChange={handleChange ? (e) => handleChange(name, e) : () => {}}
            isDisabled={isDisabled}
            className={requiredClassName}
            menuPortalTarget={document.body}
            tabIndex={tabIndex ? tabIndex : "-1"}
          />
        </div>
      </div>
    </>
  );
};

export default ReactSelect;
