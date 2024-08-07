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
      {" "}
      <div className="form-group">
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
            >
              {ele?.label}
            </option>
          ))}
        </select>
        <label htmlFor={id} className="lable truncate">
          {lable}
        </label>
      </div>
    </>
  );
};
