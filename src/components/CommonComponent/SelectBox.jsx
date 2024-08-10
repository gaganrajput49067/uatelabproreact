export const SelectBox = ({
  isDisabled,
  options,
  id,
  name,
  onChange,
  className,
  selectedValue,
  keyEvent,
  onKeyPress,
  lable,
}) => {
  return (
    <>
      <div className="form-group selectbox">
        <select
          className={`form-control input-sm ${className}`}
          value={selectedValue?.label !== "" && selectedValue}
          disabled={isDisabled}
          name={name}
          id={id}
          defaultValue={selectedValue}
          onChange={onChange}
          onKeyDown={(e) => keyEvent && onKeyPress(e, name)}
        >
          {options?.map((ele, index) => (
            <option
              key={index}
              value={ele?.value}
              className={`Status-${ele?.status && ele?.value}`}
              style={
                selectedValue == ele?.value ? { background: "lightblue" } : {}
              }
            >
              {ele?.label}
            </option>
          ))}
        </select>

        <label htmlFor={id} className="lable truncate">
          {lable}
        </label>
        <i className="fa fa-angle-down"></i>
      </div>
    </>
  );
};
