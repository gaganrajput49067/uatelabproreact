import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import LinkPageHead from "../../components/CommonComponent/LinkPageHead";
import { DataType } from "../../utils/Constants";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";

const InvestigationsList = () => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    DataType: "",
    TestName: "",
    TestCode: "",
  });
  const [data, setData] = useState([]);

  const handleSelect = (e) => {
    const { name } = e.target;
    setPayload({ ...payload, [name]: e.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleActiveSingle = (e, i, arr) => {
    checkboxEdit(arr?.InvestigationID, arr.isActive === 1 ? 0 : 1);
  };

  const getInvestigationsList = () => {
    setLoading(true);
    axiosInstance
      .post("Investigations/GetInvestigations", payload)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };
  // console.log(payload?.DataType);

  const checkboxEdit = (InvestigationId, isActive) => {
    axiosInstance
      .post("Investigations/UpdateActiveInActive", {
        InvestigationId: InvestigationId,
        isActive: isActive,
      })
      .then((res) => {
        if (res.data.message) {
          toast.success("Updated Successfully");
          getInvestigationsList();
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        getInvestigationsList();
      });
  };
  return (
    <>
      <LinkPageHead
        name="InvestigationsList"
        showDrop={"true"}
        to="/Investigations"
        title="Create New"
        state={{
          url: "Investigations/CreateInvestigation",
        }}
      >
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                name="DataType"
                options={DataType}
                id="DataType"
                lable="DataType"
                selectedValue={payload?.DataType}
                onChange={handleSelect}
              />
            </div>
            <div className="col-sm-2">
              <Input
                placeholder=" "
                lable="Test Name"
                id="TestName"
                name="TestName"
                type="text"
                value={payload?.TestName}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2">
              <Input
                placeholder=" "
                lable="Test Code"
                id="TestCode"
                name="TestCode"
                type="text"
                value={payload?.TestCode}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-block btn-primary btn-sm"
                onClick={getInvestigationsList}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <>
          {loading ? (
            <Loading />
          ) : (
            <div className="card">
              {data.length > 0 ? (
                <Table paginate={true} data={data ?? []} itemsPerPage={20}>
                  {({ currentItems, finalIndex }) => {
                    return (
                      <>
                        <thead className="cf">
                          <tr>
                            <th>S.No</th>
                            <th>Data Type</th>
                            <th>Test Name</th>
                            <th>Test Code</th>
                            <th>Active / InActive</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((data, i) => (
                            <tr key={i}>
                              <td data-title={"S.No"}>{i + finalIndex}</td>
                              <td data-title={"Data Type"}>{data?.DataType}</td>
                              <td data-title={"Test Name"}>{data?.TestName}</td>
                              <td data-title={"Test Code"}>{data?.TestCode}</td>
                              <td data-title={"Active / InActive"}>
                                <input
                                  type="checkbox"
                                  name="isActive"
                                  checked={data?.isActive}
                                  onChange={(e) =>
                                    handleActiveSingle(e, i, data)
                                  }
                                />
                              </td>
                              <td data-title={"S.No"}>
                                <Link
                                  to="/Investigations"
                                  state={{
                                    other: {
                                      button: "Update",
                                      pageName: "Edit",
                                      showButton: true,
                                    },
                                    url1: `Investigations/EditInvestigation?id=${data?.InvestigationID}&DataType=${data?.DataType}`,
                                    url: "Investigations/UpdateInvestigation",
                                  }}
                                >
                                  Edit
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </>
                    );
                  }}
                </Table>
              ) : (
                <NoRecordFound />
              )}
            </div>
          )}
        </>
      </LinkPageHead>
    </>
  );
};
export default InvestigationsList;
