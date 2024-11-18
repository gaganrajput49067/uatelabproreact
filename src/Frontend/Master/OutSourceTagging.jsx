import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";

const OutSourceTagging = () => {
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [OutSourcedata, setOutSourcedata] = useState([]);
  const [centreId, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [button, showButton] = useState(false);
  const [payload, setPayload] = useState({
    CentreID: "",
    DepartmentID: "",
  });
  const { t } = useTranslation();

  const getDepartment = () => {
    axiosInstance
      .get("Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const getOutSourceTagging = () => {
    setLoad(true);
    axiosInstance
      .post("OutSourceLabMaster/getAllOutSourceTaggingData", payload)
      .then((res) => {
        if (res.status === 200) {
          setOutSourcedata(res.data.message);
          setLoad(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const post = () => {
    setLoad(true);
    axiosInstance
      .post("OutSourceLabMaster/InsertOutSourceTaggingData", {
        CentreID: payload?.CentreID,
        DepartmentID: payload?.DepartmentID,
        isActive: "1",
        Data: OutSourcedata,
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

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value, ItemValue: "" });
    setErr({});
  };

  console.log(OutSourcedata);

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...OutSourcedata];
      data[index][name] = checked ? 1 : 0;
      return setOutSourcedata(data);
    } else {
      const val = OutSourcedata.map((ele) => {
        return {
          ...ele,
          IsOutsource: checked ? 1 : 0,
        };
      });
      return setOutSourcedata(val);
    }
  };

  const getAccessCentres = (state) => {
    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        state(CentreDataValue);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.sessionStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  useEffect(() => {
    setPayload({
      ...payload,
      CentreID: centreId[0]?.value,
      DepartmentID: Department[0]?.value,
    });
  }, [centreId, Department]);
  useEffect(() => {
    getDepartment();
    getAccessCentres(setCentreData);
  }, []);
  return (
    <>
      <PageHead name="Out Source Tagging" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                name="CentreID"
                options={centreId}
                value={payload?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="DepartmentID"
                options={Department}
                selectedValue={payload?.DepartmentID}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-block btn-warning btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => {
                      getOutSourceTagging();
                      showButton(true);
                    }}
                  >
                    {t("Search")}
                  </button>
                </>
              )}
            </div>
          </div>
          {load ? (
            <Loading />
          ) : (
            <>
                
            </>
          )}
        </div>
      </PageHead>
    </>
  );
}; 

export default OutSourceTagging;
