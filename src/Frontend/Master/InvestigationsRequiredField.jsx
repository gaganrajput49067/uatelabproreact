import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import Table from "../../components/Table/Table";
import PageHead from "../../components/CommonComponent/PageHead";
import Loading from "../../components/Loading/Loading";
const InvestigationsRequiredField = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  const ID = {
    InvestigationID: state?.data ? state?.data : "",
  };

  const { t } = useTranslation();

  const getInvestigationsList = () => {
    axiosInstance
      .post("Investigations/RequiredFields", {
        InvestigationID: ID.InvestigationID,
      })
      .then((res) => {
        if (res.status === 200) {
          setLoad(false);
          setData(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const post = () => {
    setLoad(true);

    axiosInstance
      .post("Investigations/SaveInvestigationRequired", {
        InvestigationRequiredData: data,
      })
      .then((res) => {
        if (res.data.message) {
          setLoad(false);
          toast.success(res.data.message);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoad(false);
      });
  };

  const handleChangeMain = (e, i, names) => {
    const { value, name, checked, type } = e.target;
    const datas = [...data];
    if (names) {
      datas[i][names] = value;
      setData(datas);
    } else {
      datas[i][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
      setData(datas);
    }
  };

  useEffect(() => {
    getInvestigationsList();
  }, []);

  return (
    <>
      <PageHead name={`Test Name : ${state?.TestName}`} showDrop={"true"}>
        <div className="card">
          <Table>
            <thead className="cf">
              <tr>
                <th>{t("S.No")}</th>
                <th>{t("Investigation Name")}</th>
                <th>{t("Field ID")}</th>
                <th>{t("Field Name")}</th>
                <th>{t("Show On Booking")}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((data, i) => (
                <tr key={i}>
                  <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                  <td data-title={t("Investigation Name")}>
                    {state?.TestName}&nbsp;
                  </td>
                  <td data-title={t("Field ID")}>{data?.FieldID}&nbsp;</td>
                  <td data-title={t("Field Name")}>{data?.FieldName}&nbsp;</td>
                  <td data-title={t("Show On Booking")}>
                    <input
                      type="checkbox"
                      name="showonbooking"
                      checked={data?.showonbooking}
                      onChange={(e) => handleChangeMain(e, i)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="row">
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={post}
                >
                  {t("Save")}
                </button>
              )}
            </div>{" "}
            <div className="col-sm-1">
              {state?.flag ? (
                <Link
                  to="/Investigations"
                  state={{
                    other: {
                      button: "Update",
                      pageName: "Edit",
                      showButton: true,
                    },
                    url1: state?.url1,
                    url: "Investigations/UpdateInvestigation",
                  }}
                >
                  <span className="btn btn-block btn-primary btn-sm">Back</span>
                </Link>
              ) : (
                <button
                  className="btn btn-block btn-primary btn-sm"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};
export default InvestigationsRequiredField;
