import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import { SelectBox } from "../../components/CommonComponent/SelectBox";

const DoctorShareTransferModal = ({ show, handleClose }) => {
  const [DoctorData, setDoctorData] = useState([]);

  const [state, setState] = useState({
    FromDoctorID: "",
    ToDoctorID: "",
  });
  const handleSelectChange = (event) => {
    const { name, value } = event?.target;
    if (name == "FromDoctorID") {
      setState({
        ...state,
        [name]: String(value),
        ToDoctorID: value == state?.ToDoctorID ? "" : state?.ToDoctorID,
      });
    } else
      setState({
        ...state,
        [name]: String(value),
      });
  };
  console.log(DoctorData, state);
  const postApi = () => {
    if (state?.FromDoctorID && state?.ToDoctorID) {
      axiosInstance
        .post("DocShareMaster/transferDocShare", {
          FromDoctorID: state?.FromDoctorID,
          ToDoctorID: state?.ToDoctorID,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setState({
            FromDoctorID: "",
            ToDoctorID: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "SomeThing Went Wrong"
          );
        });
    } else {
      toast.error("Please Choose FromDoctorID and ToDoctorID");
    }
  };

  const BindDoctorData = () => {
    axiosInstance
      .post("DoctorReferal/getDoctorDataBind")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DoctorName,
            value: ele?.DoctorID,
          };
        });
        setDoctorData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
      });
  };

  useEffect(() => {
    BindDoctorData();
  }, []);
  return (
    <>
      <Modal
        title="Doctor Share Transfer"
        handleClose={() => {
          handleClose();
        }}
      >
        <div className="card" style={{ width: "500px" }}>
          <div className="row">
            <div className="col-sm-6">
              <SelectBox
                options={[
                  { label: "Select From Doctor", value: "" },
                  ...DoctorData,
                ]}
                onChange={handleSelectChange}
                name={"FromDoctorID"}
                is="FromDoctorID"
                lable="From Doctor"
                selectedValue={state?.FromDoctorID}
              />
            </div>
            <div className="col-sm-6">
              <SelectBox
                options={[
                  { label: "Select To Doctor", value: "" },
                  ...(state?.FromDoctorID
                    ? DoctorData.filter(
                        (ele) => ele.value != state?.FromDoctorID
                      )
                    : DoctorData),
                ]}
                onChange={handleSelectChange}
                name={"ToDoctorID"}
                id="ToDoctorID"
                lable="To Doctor"
                selectedValue={state?.ToDoctorID}
                className="required"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">
            <button
              className="btn btn-block btn-success btn-sm"
              onClick={postApi}
            >
              Save
            </button>
          </div>
          <div className="col-sm-2">
            <button
              className="btn btn-block btn-danger btn-sm"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DoctorShareTransferModal;
