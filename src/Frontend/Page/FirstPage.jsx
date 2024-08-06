import React from "react";
import Input from "../../components/CommonComponent/Input";
import SelectBox from "../../components/CommonComponent/SelectBox";
import BrowseButton from "../../components/CommonComponent/BrowseButton";
const FirstPage = () => {
  const dummyData = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      status: "Pending",
    },
    {
      id: 4,
      name: "Bob Brown",
      email: "bob.brown@example.com",
      status: "Active",
    },
  ];
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];
  const handleChange = (e) => {
    console.log(e);
  };
  return (
    <>
      <div className="container-fluid">
        <div className="card border-success my-3">
          <div className="card-header bg-success text-white">
            <h4 className="card-title">Route Master</h4>
          </div>
          <div className="card-body">
            <h4 className="card-title">Add New Entry</h4>
            <form>
              <div className="row">
                <div className="col-sm-3">
                  <Input
                    type="text"
                    id="username"
                    className="form-control required-fields"
                    name="username"
                    lable="Username"
                    placeholder=" "
                  />
                </div>
                <div className="col-sm-3">
                  <SelectBox
                    className="form-control form-control-sm"
                    placeholder=" "
                    id="SelectBox2"
                    lable="SelectBox"
                    name="SelectBox"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-3"></div>
                <div className="col-sm-3">
                  <Input
                    type="time"
                    id="time"
                    className="form-control required-fields"
                    name="time"
                    lable="time"
                    placeholder=" "
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <BrowseButton accept="image/*" />
                </div>
                <div className="col-sm-3">
                  <SelectBox
                    inputId="SelectBox"
                    placeholder="SelectBox"
                    id="SelectBox"
                    name="SelectBox"
                    searchable={true}
                  />
                </div>
                <div className="col-sm-3"></div>
                <div className="col-sm-3">
                  <Input
                    type="time"
                    id="time"
                    className="form-control required-fields"
                    name="time"
                    lable="time"
                    placeholder=" "
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container-fluid ">
        <div className="card border-success">
          {" "}
          <div className="card-body">
            <h4 className="card-title">Data</h4>
            <div
              className="divResult boottable table-responsive"
              id="no-more-tables"
            >
              <table className="table table-bordered table-hover table-striped tbRecord">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyData.map((item) => (
                    <tr key={item.id}>
                      <td data-title="ID">{item.id}</td>
                      <td data-title="Name">{item.name}</td>
                      <td data-title="Email">{item.email}</td>
                      <td data-title="Status">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FirstPage;
