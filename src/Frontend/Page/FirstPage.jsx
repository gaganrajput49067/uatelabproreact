import React from "react";
import Input from "../../components/CommonComponent/Input";
import ReactSelect from "../../components/CommonComponent/ReactSelect";
import DatePicker from "../../components/CommonComponent/DatePicker";
import PageHead from "../../components/CommonComponent/PageHead";
import CustomTimePicker from "../../components/CommonComponent/TimePicker";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import SubPageHead from "../../components/CommonComponent/SubPageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
const FirstPage = () => {
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];
  const dummyData = [
    {
      id: 1,
      name: "John Doe",
      value: "john.doe@example.com",
      label: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      value: "jane.smith@example.com",
      label: "Inactive",
    },
    {
      id: 14,
      name: "John 22Doe",
      value: "john.do32e@example.com",
      label: "Active",
    },
    {
      id: 22,
      name: "Jane Sm323ith",
      value: "jane.sm32ith@example.com",
      label: "Inactive",
    },
    // more data...
  ];

  const handleChange = (e) => {
    console.log(e);
  };

  const handleDateChange = (e) => {
    console.log(e);
  };

  return (
    <>
      <PageHead>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <Input
                type="text"
                id="username"
                className="form-control required-fields"
                name="username"
                lable="Username"
                placeholder=" "
              />
            </div>
            <div className="col-md-2">
              <ReactSelect
                className="required-fields"
                placeholderName="SelectBox"
                id="SelectBox"
                name="SelectBox"
                dynamicOptions={dummyData}
                value="a"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <DatePicker
                className="custom-calendar"
                name="Date"
                placeholder=" "
                value=""
                id="Date"
                lable="CustomDate"
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                className="form-control required-fields"
                name="FromTime"
                placeholder=" "
                value={new Date()}
                id="FromTime"
                lable="FromTime"
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                className="form-control required-fields"
                name="ToTime"
                placeholder=" "
                value=""
                id="ToTime"
                lable="ToTime"
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="row">
            <div className="col-md-2">
              <SelectBoxWithCheckbox
                value=""
                options={options}
                placeholder=" "
                lable="SearchBox1"
                id="SearchBox1"
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-2">
              <ReactSelect
                className="required-fields"
                placeholderName="SelectBox"
                id="SelectBox"
                name="SelectBox"
                dynamicOptions={dummyData}
                value="a"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-sm btn-primary">Button</button>
            </div>
          </div>
        </div>
      </PageHead>
      <SubPageHead>
        {" "}
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <Input
                type="text"
                id="username"
                className="form-control required-fields"
                name="username"
                lable="Username"
                placeholder=" "
              />
            </div>
            <div className="col-md-2">
              <ReactSelect
                className="required-fields"
                placeholderName="SelectBox"
                id="SelectBox"
                name="SelectBox"
                dynamicOptions={dummyData}
                value="a"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <DatePicker
                className="custom-calendar"
                name="Date"
                placeholder=" "
                value=""
                id="Date"
                lable="CustomDate"
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                className="form-control required-fields"
                name="FromTime"
                placeholder=" "
                value={new Date()}
                id="FromTime"
                lable="FromTime"
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                className="form-control required-fields"
                name="ToTime"
                placeholder=" "
                value=""
                id="ToTime"
                lable="ToTime"
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-2"></div>
          </div>
          <div className="row">
            <div className="col-md-2">
              <SelectBoxWithCheckbox
                value=""
                options={options}
                placeholder=" "
                lable="SearchBox1"
                id="SearchBox1"
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-2">
              <SelectBox
                className="required-fields"
                placeholderName="SearchBox2"
                id="SearchBox2"
                name="SearchBox2"
                options={dummyData}
                lable="SearchBox2"
                value="a"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-sm btn-primary">Button</button>
            </div>
          </div>
        </div>
      </SubPageHead>
    </>
  );
};

export default FirstPage;
