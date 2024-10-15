import React, { useEffect, useState } from "react";
import LinkPageHead from "../../components/CommonComponent/LinkPageHead";
import { getDoctorSuggestion } from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import { ActiveDoctor } from "../../utils/Constants";
import { useTranslation } from "react-i18next";
import { autocompleteOnBlur, IndexHandle, number } from "../../utils/helpers";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import { toast } from "react-toastify";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import { Link } from "react-router-dom";
const DoctorMaster = () => {
  const [details, setDetails] = useState({
    pagesize: 0,
    totalcount: 0,
  });
  const [indexMatch, setIndexMatch] = useState(0);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [Specialization, setSpecialization] = useState([]);
  const [dropFalse, setDropFalse] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState({
    DoctorName: "",
    Mobile: "",
    Specialization: "All",
    isActive: ActiveDoctor[0]?.value,
    IndexNo: currentPage,
    SecondReferDoctor: 0,
  });
  const { t } = useTranslation();

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setPayload({ ...payload, [name]: data.Name });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleIndex = (e) => {
    const { name } = e.target;
    switch (name) {
      case "DoctorName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(doctorSuggestion.length - 1);
            }
            break;
          case 40:
            if (doctorSuggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(doctorSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload((payload) => ({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    getDoctorSuggestion(payload, setDoctorSuggestion, setPayload);
  }, [payload?.DoctorName]);

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        if (name == "Specialization") {
          setSpecialization(value);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetch = () => {
    setLoading(true);
    axiosInstance
      .post("DoctorReferal/SearchDoctorData", {
        ...payload,
        Name: payload?.DoctorName,
        IndexNo: currentPage - 1,
      })
      .then((res) => {
        if (res?.data.success) {
          setTableData(res?.data?.message);
        } else {
          setTableData([]);
          toast.error(res?.data?.message);
        }
        setDetails((details) => ({
          ...details,
          pagesize: res?.data?.pageSize ?? 10,
          totalcount: res?.data?.totalCount ?? 10,
        }));
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };
  useEffect(() => {
    fetch();
  }, [currentPage]);
  useEffect(() => {
    getDropDownData("Specialization");
  }, []);

  return (
    <>
      <LinkPageHead
        name="DoctorMaster"
        showDrop={"true"}
        to="/CreateDoctorReferal"
        title="Create New Doctor"
      >
        <div className="card">
          <div className="box-body">
            <div className="row">
              <div className="col-sm-2 ">
                <Input
                  lable="DoctorName"
                  id="DoctorName"
                  placeholder=" "
                  name="DoctorName"
                  value={payload?.DoctorName}
                  type="text"
                  autoComplete={"off"}
                  onChange={(e) => {
                    handleChange(e);
                    setDropFalse(true);
                  }}
                  onBlur={(e) => {
                    autocompleteOnBlur(setDoctorSuggestion);
                    setTimeout(() => {
                      const data = doctorSuggestion.filter(
                        (ele) => ele?.Name === e.target.value
                      );
                      if (data.length === 0) {
                        setPayload({ ...payload, DoctorName: "" });
                      }
                    }, 500);
                  }}
                  onKeyDown={handleIndex}
                />
                {dropFalse && doctorSuggestion.length > 0 && (
                  <ul
                    className="suggestion-data"
                    style={{ top: "26px", right: "1px" }}
                  >
                    {doctorSuggestion.map((data, index) => (
                      <li
                        onClick={() => handleListSearch(data, "DoctorName")}
                        className={`${index === indexMatch && "matchIndex"}`}
                        key={index}
                      >
                        {data?.Name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-sm-2">
                <Input
                  lable="Mobile"
                  id="Mobile"
                  placeholder=" "
                  type="number"
                  name="Mobile"
                  onInput={(e) => number(e, 10)}
                  value={tableData.Mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  options={[
                    { label: "Specialization", value: "" },
                    ...Specialization,
                  ]}
                  lable="Specialization"
                  id="Specialization"
                  value={payload?.Specialization}
                  name="Specialization"
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2">
                <SelectBox
                  options={ActiveDoctor}
                  value={payload?.isActive}
                  name="isActive"
                  lable="isActive"
                  id="isActive"
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2">
                <input
                  type="checkbox"
                  checked={payload?.SecondReferDoctor}
                  onChange={handleSelectChange}
                  name="SecondReferDoctor"
                />
                &nbsp;
                <label className="control-label ml-2">
                  {t("Second Refer Doctor")}
                </label>
              </div>
              <div className="col-sm-1">
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  onClick={fetch}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </LinkPageHead>

      <div className="card">
        {loading ? (
          <Loading />
        ) : (
          <>
            {tableData?.length > 0 ? (
              <>
                <Table>
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Name")}</th>
                      <th>{t("Phone")}</th>
                      <th>{t("Specialization")}</th>
                      <th>{t("Email")}</th>
                      <th>{t("ClinicName")}</th>
                      <th>{t("Degree")}</th>
                      <th>{t("Address")}</th>
                      <th>{t("Mobile")}</th>
                      <th>{t("Active")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((data, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>
                          {index +
                            1 +
                            IndexHandle(currentPage, details?.pagesize)}
                          &nbsp;
                        </td>
                        <td data-title={t("Name")}>{data?.Name}&nbsp;</td>
                        <td data-title={t("Phone")}>
                          {data?.Phone ? data?.Phone : "-"}&nbsp;
                        </td>
                        <td data-title={t("Specialization")}>
                          {data?.Specialization ? data?.Specialization : "-"}
                          &nbsp;
                        </td>
                        <td data-title={t("Email")}>
                          {data?.Email ? data?.Email : "-"}&nbsp;
                        </td>
                        <td data-title={t("ClinicName")}>
                          {data?.ClinicName ? data?.ClinicName : "-"}&nbsp;
                        </td>
                        <td data-title={t("Degree")}>
                          {data?.Degree ? data?.Degree : "-"}&nbsp;
                        </td>
                        <td data-title={t("Address")}>
                          {data?.Address ? data?.Address : "-"}&nbsp;
                        </td>
                        <td data-title={t("Mobile")}>
                          {data?.Mobile ? data?.Mobile : "-"}&nbsp;
                        </td>
                        <td data-title={t("Active")}>
                          {data?.isActive === 1 ? t("Active") : t("De-Active")}
                          &nbsp;
                        </td>
                        <td data-title={t("Action")} className="text-primary">
                          <Link
                            to="/CreateDoctorReferal"
                            state={{
                              url: "DoctorReferal/GetSingleDoctorData",
                              url1: "DoctorReferal/UpdateDoctorReferal",
                              id: data?.DoctorReferalID,
                            }}
                            className="float-right"
                          >
                            {t("Edit")}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={details?.totalcount}
                  pageSize={details?.pagesize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            ) : (
              <NoRecordFound />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DoctorMaster;
