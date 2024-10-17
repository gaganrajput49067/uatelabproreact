import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import LinkPageHead from "../../components/CommonComponent/LinkPageHead";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import Table from "../../components/Table/Table";
import { getTrimmedData } from "../../utils/helpers";

const CompanyMasterList = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    CompanyId: "",
    CompanyCode: "",
    CompanyName: "",
    Country: "",
    State: "",
    City: "",
    Email: "",
    Phone: "",
    Address1: "",
    Address2: "",
    Address3: "",
    isPrefixRequired: 0,
    IsWhatsappRequired: 0,
    SelectType: "",
    GraceDays: 0,
    Mobile1: "",
    Mobile2: "",
    BillingType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  const handleSearch = () => {
    setLoading(true);
    axiosInstance
      .post(
        "CompanyMaster/GetCompanyMaster",
        getTrimmedData({
          ...payload,
          BillingType: payload?.BillingType,
          Mobile1: payload?.Mobile1,
          Mobile2: payload?.Mobile2,
          SelectType: payload?.SelectType,
          CompanyId: payload?.CompanyId,
        })
      )
      .then((res) => {
        if (res.status === 200) {
          setFormData(res.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoading(false);
      });
    // } else {
    //   setErr(generatedError);
    //   setLoading(false);
    // }
  };
  return (
    <>
      <LinkPageHead
        name="Company Master"
        showDrop={"true"}
        to="/CompanyMaster"
        title="Create New"
        state={{
          url: "",
        }}
      >
        <div className="card">
          <div className="row">
            <div className="col-sm-2 col-md-2">
              <Input
                lable="Company Code"
                placeholder=" "
                name="CompanyCode"
                id="CompanyCode"
                type="text"
                value={payload?.CompanyCode}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                lable="Company Name"
                placeholder=" "
                name="CompanyName"
                id="CompanyName"
                type="text"
                value={payload?.CompanyName}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2 col-md-1">
              <button
                type="submit"
                className="btn btn-block btn-info btn-sm"
                id="btnSearch"
                title="Search"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </LinkPageHead>
      <div className="card">
        {loading ? (
          <Loading />
        ) : formData.length > 0 ? (
          <Table>
            <thead
              style={{
                position: "sticky",
                top: 0,
              }}
            >
              <tr>
                <th>S.No</th>
                <th>CompanyCode</th>
                <th>CompanyName</th>
                <th>Email</th>
                <th>State</th>
                <th>City</th>
                <th>Mobile1.</th>
                <th>Type</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((ele, index) => (
                <tr key={index}>
                  <td data-title={"S.No"}>{index + 1}&nbsp;</td>
                  <td data-title={"CompanyCode"}>{ele?.CompanyCode} &nbsp;</td>
                  <td data-title={"CompanyName"}>{ele?.CompanyName} &nbsp;</td>
                  <td data-title={"Email"}>{ele?.Email} &nbsp;</td>
                  <td data-title={"State"}>{ele?.State} &nbsp;</td>
                  <td data-title={"City"}>{ele?.City} &nbsp;</td>
                  <td data-title={"Mobile1"}>{ele?.Mobile1} &nbsp;</td>
                  <td data-title={"BillingType"}>{ele?.BillingType} &nbsp;</td>

                  <td data-title={"Edit"}>
                    <Link
                      state={{
                        data: ele?.CompanyID,
                        other: { button: "Update", pageName: "Edit" },
                        url: "CompanyMaster/EditCompanyMaster",
                      }}
                      to="/CompanyMaster"
                    >
                      Edit
                    </Link>
                    &nbsp;
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <NoRecordFound />
        )}
      </div>
    </>
  );
};

export default CompanyMasterList;
