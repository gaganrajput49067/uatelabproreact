import React, { useState } from "react";
import Input from "../../components/CommonComponent/Input";
import ReactSelect from "../../components/CommonComponent/ReactSelect";
import DatePicker from "../../components/CommonComponent/DatePicker";
import PageHead from "../../components/CommonComponent/PageHead";
import CustomTimePicker from "../../components/CommonComponent/TimePicker";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import SubPageHead from "../../components/CommonComponent/SubPageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { Time } from "../../utils/helpers";
import { Document, Page, pdfjs } from "react-pdf";

const FirstPage = () => {
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());

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

  const handleDateChange = (value, name) => {
    console.log(value, name);
  };

  const handleTime = (time, name) => {
    if (name === "FromTime") {
      setFromTime(time);
    } else if (name === "ToTime") {
      setToTime(time);
    }
    console.log(Time(time));
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
                value={new Date()}
                id="Date"
                lable="CustomDate"
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                className="form-control required-fields"
                name="FromTime"
                placeholder="From Time"
                value={fromTime}
                id="FromTime"
                lable="From Time"
                onChange={handleTime}
              />
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                className="form-control required-fields"
                name="ToTime"
                placeholder="To Time"
                value={toTime}
                id="ToTime"
                lable="To Time"
                onChange={handleTime}
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
                placeholder="From Time"
                value={fromTime}
                id="FromTime"
                lable="From Time"
                onChange={handleTime}
              />
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                name="ToTime"
                placeholder="To Time"
                value={toTime}
                id="ToTime"
                lable="To Time"
                onChange={handleTime}
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
      <Test />
    </>
  );
};

export default FirstPage;

const url = "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";
function Test() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  /*To Prevent right click on screen*/
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  /*When document gets loaded successfully*/
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <>
      <div className="main">
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <div>
          <div className="pagec">
            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
          </div>
          <div className="buttonc">
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
              className="Pre"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
