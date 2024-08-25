import React, { useEffect, useState } from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getTrimmedData } from "../../utils/helpers";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import axios from "axios";
import { BindFieldType } from "../../utils/NetworkApi/commonApi";
import Input from "../../components/CommonComponent/Input";
import { toast } from "react-toastify";

const GlobalTypeMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  console.log(state);
  const [FieldType, setFieldType] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    FieldType: "",
    FieldDisplay: "",
    IsActive: "1",
  });

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleChange = (e) => {
    const { checked } = e.target;
    setPayload({ ...payload, IsActive: checked ? "1" : "0" });
  };

  const validations = (payload) => {
    let err = "";
    if (payload?.FieldType === "") {
      err = "Please Choose Field Type";
    } else if (payload?.FieldDisplay === "") {
      err = "Please Enter Field Display";
    }

    return err;
  };

  
  const handleSubmit = () => {
    const generated = validations(getTrimmedData(payload));
    if (generated === "") {
      setLoad(true);
      axios
        .post(
          state?.url ? state?.url : "/api/v1/Global/InsertGlobalData",
          getTrimmedData(payload)
        )
        .then((res) => {
          toast.success(res.data?.message);
          setLoad(false);
          if (payload?.FieldType === "SelectType") {
            setPayload({
              FieldType: "",
              FieldDisplay: "",
              IsActive: "1",
            });
            BindFieldType(setFieldType);
          } else {
            navigate("/ViewGlobalMaster");
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      toast.error(generated);
    }
  };

  useEffect(() => {
    if (state?.data) {
      setPayload({
        FieldId: state?.data?.FieldId,
        FieldType: state?.data?.FieldType,
        FieldDisplay: state?.data?.FieldDisplay,
        IsActive: state?.data?.IsActive === 1 ? "1" : "0",
      });
    }
  }, []);

  useEffect(() => {
    BindFieldType(setFieldType);
  }, []);
  return (
    <>
      <PageHead name="Global Type Master">
        <div className="card">
          <div className="row">
            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={[
                  { label: "Select Field Type", value: "" },
                  ...FieldType,
                ]}
                name="FieldType"
                id="Field Type"
                lable="Field Type"
                selectedValue={payload?.FieldType}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                name="FieldDisplay"
                lable="Field Display"
                id="Field Display"
                placeholder=" "
                value={payload?.FieldDisplay}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-1 flex">
              <input
                type="checkbox"
                className="mb-3"
                id="IsActive"
                checked={payload?.IsActive === "1" ? true : false}
                onChange={handleChange}
              />
              <label htmlFor="IsActive" className="ml-2">
                {"Active"}
              </label>
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-success btn-sm btn-block"
                  onClick={handleSubmit}
                >
                  {state?.url ? "Update" : "Create"}
                </button>
              )}
            </div>

            <div className="col-sm-1">
              <Link to="/ViewGlobalMaster">{"Back to List"}</Link>
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default GlobalTypeMaster;
