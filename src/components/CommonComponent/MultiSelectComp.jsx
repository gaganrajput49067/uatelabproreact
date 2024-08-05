import React from "react";
import { MultiSelect } from "primereact/multiselect";

const MultiSelectComp = (props) => {
  const {
    respclass,
    options,
    value,
    handleChange,
    name,
    placeholder,
  } = props;


  return (
    <div className={respclass}>
      <div className="form-controls mb-2">
        <MultiSelect
          filter
          value={value}
          onChange={(e) => handleChange(name, e.value)}
          options={options}
          optionLabel="name"
          placeholder={placeholder}
          maxSelectedLabels={3}
          className={"multiselect"}
          name={name}
          closeIcon
        />
      </div>
    </div>
  );
};

export default MultiSelectComp;
