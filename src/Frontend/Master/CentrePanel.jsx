import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { getAccessCentres } from "../../utils/NetworkApi/commonApi";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import { isChecked } from "../../utils/helpers";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import PageHead from "../../components/CommonComponent/PageHead";
const CentrePanel = () => {
  const [CentreData, setCentreData] = useState([]);
  const [ReferenceRate, setReferenceRate] = useState([]);
  const [Disable, setDisable] = useState(true);
  const [load, setLoad] = useState({
    ReferenceRateLoading: false,
    SaveLoad: false,
  });

  const [payload, setPayload] = useState({
    CentreID: "",
    CentreName: "",
    Data: [],
  });

  const handleChange = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...ReferenceRate];
      data[index][name] = checked;
      setReferenceRate(data);
    } else {
      const data = ReferenceRate.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setReferenceRate(data);
    }
  };

  useEffect(() => {
    if (CentreData.length > 0) {
      const name = CentreData.find((ele) => ele.value === payload?.CentreID);
      setPayload({ ...payload, CentreName: name?.label });
    }
  }, [payload?.CentreID, CentreData]);

  const saveData = () => {
    setLoad({ ...load, SaveLoad: true });
    const data = ReferenceRate.filter((ele) => ele.isChecked === true);
    const val = data.map((ele) => {
      return { RateTypeID: ele?.value, RateTypeName: ele?.label };
    });
    setPayload({ ...payload, Data: val });

    axiosInstance
      .post("CentreAccess/InsertCentreAccessData", {
        ...payload,
        Data: val,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad({ ...load, SaveLoad: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, SaveLoad: false });
      });
  };
  const getReferenceRate = (id) => {
    axiosInstance
      .get("CentreAccess/CentreAllRateTypeList")
      .then((res) => {
        let data = res.data.message;
        let CentreReferRate = data.map((ele) => {
          return {
            value: ele.RateTypeID,
            label: ele.RateTypeName,
            isChecked: false,
          };
        });
        setReferenceRate(CentreReferRate);
        fetch(CentreReferRate, id);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
    fetch(ReferenceRate, value);
  };

  const disable = () => {
    let disable = true;
    for (var i = 0; i < ReferenceRate.length; i++) {
      if (ReferenceRate[i].isChecked === true) {
        disable = false;
        break;
      }
    }
    setDisable(disable);
  };

  useEffect(() => {
    disable();
  }, [ReferenceRate]);

  const fetch = (mapdata, id) => {
    setLoad({ ...load, ReferenceRateLoading: true });
    axiosInstance
      .post("CentreAccess/GetCentreAccessData", {
        CentreID: id,
      })
      .then((res) => {
        const data = res?.data?.message;

        const val = [...mapdata];

        const haveIds = new Set(data.map(({ RateTypeId }) => RateTypeId));

        const result = val.map((ele) => {
          return {
            ...ele,
            isChecked: haveIds.has(ele?.value),
          };
        });
        setReferenceRate(result);
        setLoad({ ...load, ReferenceRate: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, ReferenceRate: false });
      });
  };

  useEffect(() => {
    if (CentreData.length > 0) {
      getReferenceRate(CentreData[0]?.value);
    }
  }, [CentreData]);

  useEffect(() => {
    getAccessCentres(setCentreData, payload, setPayload);
  }, []);

  return (
    <>
      <PageHead name="Centre Panel">
        <>
          <div className="card">
            <div className="row">
              <div className="col-sm-2">
                <SelectBox
                  options={CentreData}
                  lable="Centre ID"
                  name="CentreID"
                  id="CentreID"
                  selectedValue={payload?.CentreID}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 d-flex">
                <input
                  type="checkbox"
                  name="isChecked"
                  className="mb-3"
                  checked={
                    ReferenceRate?.length > 0
                      ? isChecked("isChecked", ReferenceRate, true).includes(
                          false
                        )
                        ? false
                        : true
                      : false
                  }
                  onChange={(e) => handleChange(e)}
                />
                <label className="ml-2">{"Select all"}</label>
              </div>
            </div>
          </div>
        </>
      </PageHead>
      <div className="card">
        <h2 className="card-title">Tag Rate Type To Selected Centre</h2>
        <hr></hr>
        <div className="col-sm-12">
          {load?.ReferenceRateLoading ? (
            <div className="d-flex align-items-center justify-content-center">
              <Loading />
            </div>
          ) : (
            <div
              className="row"
              style={{
                maxHeight: "50vh",
                overflow: "auto",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            >
              {ReferenceRate.map((ele, index) => (
                <div
                  key={index}
                  className="col-sm-3 d-flex justify-content-between mt-2 pr-4"
                  style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
                >
                  <span className="">{ele.label}</span>
                  <input
                    type="checkbox"
                    className="mb-3"
                    checked={ele?.isChecked}
                    name="isChecked"
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {load?.SaveLoad ? (
          <Loading />
        ) : (
          <div className="col-sm-1 m-0 p-0">
            <button
              type="submit"
              className="btn btn-success btn-sm btn-block mt-3"
              onClick={saveData}
              disabled={Disable}
            >
              {"Save"}
            </button>{" "}
          </div>
        )}
      </div>
    </>
  );
};

export default CentrePanel;
