import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PageHead from "../../components/CommonComponent/PageHead";
import Loading from "../../components/Loading/Loading";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { axiosInstance } from "../../utils/axiosInstance";

const RateTypeCopyShare = () => {
  const navigate = useNavigate();
  const [RateTypeData, setRateTypeData] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    FromRateTypeID: "2",
    ToRateTypeID: "3",
  });
  const { t } = useTranslation();

  const handleSelect = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const getRateList = () => {
    axiosInstance
      .get("Centre/getRateList")
      .then((res) => {
        let data = res.data.message;
        let RateType = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        setRateTypeData(RateType);
      })
      .catch((err) => console.log(err));
  };

  const Save = () => {
    if (payload?.FromRateTypeID === payload?.ToRateTypeID) {
      toast.error("From-doctor And To-doctor Cant Be The Same.");
    } else {
      setLoad(true);
      axiosInstance
        .post("RateTypeShare/SaveRateTypeCopy", payload)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
          
          } else {
            toast.error("Something went wrong");
          }
          setLoad(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoad(false);
        });
    }
  };

  useEffect(() => {
    getRateList();
  }, []);

  return (
    <>
      <PageHead name="Rate Type Copy Share" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                onChange={handleSelect}
                lable="From RateType"
                id="From RateType"
                options={[
                  { label: "From RateType", value: "" },
                  ...RateTypeData,
                ]}
                name="FromRateTypeID"
                value={payload?.FromRateTypeID}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                lable="To RateType"
                id="To RateType"
                onChange={handleSelect}
                options={[{ label: "To RateType", value: "" }, ...RateTypeData]}
                name="ToRateTypeID"
                value={payload?.ToRateTypeID}
              />
            </div>

            {load ? (
              <Loading />
            ) : (
              <div className="col-sm-1">
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={Save}
                >
                  {t("Save")}
                </button>
              </div>
            )}
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-primary btn-sm"
                onClick={() => navigate(-1)}
              >
                {t("Back")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default RateTypeCopyShare;
