import React, { useEffect, useState } from "react";
import LinkPageHead from "../../components/CommonComponent/LinkPageHead";
import { getDoctorSuggestion } from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import { ActiveDoctor } from "../../utils/Constants";

const DoctorMaster = () => {
  const [indexMatch, setIndexMatch] = useState(0);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [Specialization, setSpecialization] = useState([]);
  const [dropFalse, setDropFalse] = useState(true);
  const [tableData, setTableData] = useState([]);
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
        if (res?.data.message.length == 0) {
          toast.error("No Record Found");
        }
        setTableData(res?.data?.message);
        setDetails((details) => ({
          ...details,
          PageSize: res?.data?.PageSize,
          TotalCount: res?.data?.TotalCount,
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
    getDropDownData("Specialization");
  }, []);

  return (
    <>
      <LinkPageHead
        name="DoctorMaster"
        showDrop={"true"}
        link="/CreateDoctorReferal"
        title="Create New Doctor"
      >
        <div className="card"></div>
      </LinkPageHead>
    </>
  );
};

export default DoctorMaster;
