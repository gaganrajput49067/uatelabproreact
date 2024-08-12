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
      <div className="form-group selectbox m-0 ">
        <select
          className={`form-control input-sm ${className} m-0 mt-0`}
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
              className={`Status-${ele?.status && ele?.value} p-0 m-0 mt-0`}
              style={
                selectedValue == ele?.value ? { background: "lightblue" } : {}
              }
            >
              {ele?.label}
            </option>
          ))}
        </select>
        {lable && lable !== "" && (
          <label htmlFor={id} className="lable truncate ">
            {lable}
          </label>
        )}
        <i className="fa fa-angle-down "></i>
      </div>
    </>
  );
};
