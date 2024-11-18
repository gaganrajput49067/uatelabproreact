import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import LinkPageHead from "../../components/CommonComponent/LinkPageHead";
import SubPageHead from "../../components/CommonComponent/SubPageHead";
const MicroBiologyMasterMapping = () => {
  const location = useLocation();
  const [getMapItem, setGetMapItem] = useState([]);
  const [payloadUnMappedItem, setPayloadUnMappedItem] = useState([]);
  const [payloadMappedItem, setPayloadMappedItem] = useState([]);
  const [getUnMapItem, setGetUnMapItem] = useState([]);
  const { t } = useTranslation();

  const handleChange = (e, state) => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }

    let data = state.filter((ele) => {
      if (value.includes(ele?.MapMasterID)) {
        return {
          TypeID: ele?.TypeID,
          MasterID: ele?.MasterID,
          MapTypeID: ele?.MapTypeID,
          MapMasterID: ele?.MapMasterID,
          BreakPoint: ele?.Name,
        };
      }
    });

    setPayloadUnMappedItem(data);
  };

  const handleChangeGetMapData = (e, state) => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }

    let data = state.filter((ele) => {
      if (value.includes(ele?.MapID)) {
        return {
          TypeID: ele?.TypeID,
          MasterID: ele?.MasterID,
          MapTypeID: ele?.MapTypeID,
          MapMasterID: ele?.MapMasterID,
          BreakPoint: ele?.Name,
        };
      }
    });
    setPayloadMappedItem(data);
  };

  const fetchMap = () => {
    axiosInstance
      .post("MapMicroMaster/getsaveddata", {
        SearchType: "4",
        MasterID: location?.state?.id,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            ...ele,
            MapTypeID: "4",
          };
        });
        setGetMapItem(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };
  const fetchUnMap = () => {
    axiosInstance
      .post("MapMicroMaster/getunmappeddata", {
        SearchType: "4",
        MasterID: location?.state?.id,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            ...ele,
            MasterID: location?.state?.id,
          };
        });
        setGetUnMapItem(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Wents Wrong"
        );
      });
  };

  const handleMapSave = () => {
    axiosInstance
      .post("MapMicroMaster/savemapping", {
        MappingData: payloadUnMappedItem,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setPayloadUnMappedItem([]);
        fetchMap();
        fetchUnMap();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const handleMapDelete = () => {
    axiosInstance
      .post("MapMicroMaster/deletemapping", {
        MappingData: payloadMappedItem,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setPayloadMappedItem([]);
        fetchMap();
        fetchUnMap();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    fetchMap();
    fetchUnMap();
  }, []);
  return (
    <>
      <LinkPageHead
        name="Micro Biology Master Mapping"
        showDrop={"true"}
        to="/MicroBiologyMaster"
        title="Back To Main Page"
      >
        <div className="card">
          <div className="row">
            <div className="col-sm-4">
              <span style={{ fontWeight: "bold" }}>
                {t("Organism Master")} :&nbsp;
              </span>
              <span>{location?.state?.Name}</span>
            </div>
            <div className="col-sm-3">
              <span style={{ fontWeight: "bold" }}>{t("Code")} :&nbsp;</span>
              <span> {location?.state?.Code}</span>
            </div>
          </div>
        </div>
      </LinkPageHead>
      <div className="card pt-3">
        <div className="row">
          <div className="col-md-5">
            <SubPageHead title={"Mapped Item"}>
              <div className="card">
                <select
                  multiple
                  className="form-control mapping-tag "
                  onChange={(e) => handleChangeGetMapData(e, getMapItem)}
                  style={{ border: "none" }}
                >
                  {getMapItem.map((ele, index) => (
                    <option key={index} value={ele?.MapID} className="p-2">
                      {ele?.Name}
                    </option>
                  ))}
                </select>
              </div>
            </SubPageHead>
          </div>

          <div
            className="col-sm-2 col-md-2"
            style={{
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "180px",
              // margin:"auto"
            }}
          >
            <div>
              <button
                className="btn btn-info btn-sm btn-block"
                style={{ width: "50px" }}
                onClick={() => handleMapSave("Left")}
                disabled={payloadUnMappedItem?.length > 0 ? false : true}
              >
                {t("Left")}
              </button>
            </div>
            <div>
              <button
                className="btn btn-info btn-sm btn-block"
                style={{ width: "50px", marginLeft: "5px" }}
                onClick={() => handleMapDelete("Right")}
                disabled={payloadMappedItem?.length > 0 ? false : true}
              >
                {t("Right")}
              </button>
            </div>
          </div>
          <div className="col-md-5">
            <SubPageHead title={"UnMapped Item"}>
              <div className="card">
                <select
                  multiple
                  className="form-control mapping-tag "
                  onChange={(e) => handleChange(e, getUnMapItem)}
                  style={{ border: "none" }}
                 >
                  {getUnMapItem.map((ele, index) => (
                    <option
                      key={index}
                      value={ele?.MapMasterID}
                      className="p-2"
                    >
                      {ele?.Name}
                    </option>
                  ))}
                </select>
              </div>
            </SubPageHead>
          </div>
        </div>
      </div>
    </>
  );
};

export default MicroBiologyMasterMapping;
