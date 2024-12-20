import React, { useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import DatePicker from "../../components/CommonComponent/DatePicker";
import CustomTimePicker from "../../components/CommonComponent/TimePicker";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { Time } from "../../utils/helpers";
import PageHead from "../../components/CommonComponent/PageHead";
function LoadData() {
  const today = new Date();
  const [state, setState] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
  });
  const { t } = useTranslation();

  const dateSelect = (value, name) => {
    setState({
      ...state,
      [name]: value,
    });
  };
  const handleTime = (time, name) => {
    setState({ ...state, [name]: time });
  };

  const fetchData = () => {
    axiosInstance
      .post("DocShareMaster/utilityAccountShareData", {
        ...state,
        FromDate: moment(state?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(state?.ToDate).format("DD-MMM-YYYY"),
        FromTime: Time(state.FromTime),
        ToTime: Time(state.ToTime),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setState({
          FromDate: new Date(),
          ToDate: new Date(),
          FromTime: new Date(today.setHours(0, 0, 0, 0)),
          ToTime: new Date(today.setHours(23, 59, 59, 999)),
        });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.data?.message);
      });
  };

  return (
    <>
      <PageHead name="Load Data" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <div>
                <DatePicker
                  placeholder=" "
                  id="FromDate"
                  lable="FromDate"
                  name="FromDate"
                  className="custom-calendar"
                  value={state?.FromDate}
                  onChange={dateSelect}
                  maxDate={new Date()}
                />
              </div>
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                name="FromTime"
                placeholder="FromTime"
                value={state?.FromTime}
                id="FromTime"
                lable="FromTime"
                onChange={handleTime}
              />
            </div>

            <div className="col-sm-2">
              <div>
                <DatePicker
                  name="ToDate"
                  placeholder=" "
                  id="ToDate"
                  lable="ToDate"
                  className="custom-calendar"
                  value={state?.ToDate}
                  onChange={dateSelect}
                  maxDate={new Date()}
                  minDate={new Date(state.FromDate)}
                />
              </div>
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                name="ToTime"
                placeholder="ToTime"
                value={state?.ToTime}
                id="ToTime"
                lable="ToTime"
                onChange={handleTime}
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={fetchData}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
}
export default LoadData;
