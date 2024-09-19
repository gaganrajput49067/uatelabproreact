import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getPaymentModes } from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import { getTrimmedData } from "../../utils/helpers";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import DynamicLabSearchTable from "../Table/DynamicLabSearchTable";
import MedicialModal from "../utils/MedicialModal";
import UploadFile from "../utils/UploadFIleModal/UploadFile";

const DynamicLabSearch = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const location = useLocation();
  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [Identity, setIdentity] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    LabNo: "",
  });

  useEffect(() => {
    setFormData({ ...formData, LabNo: location?.state?.data });
    if (location?.state?.data) {
      TableData("", location?.state?.data);
    }
  }, [location?.state?.data]);
  useEffect(() => {
    getPaymentModes("Identity", setIdentity);
  }, []);
  const { t } = useTranslation();

  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const handleUploadCount = (name, value, secondName) => {
    let data = [...dispatchData];
    if (name === "UploadDocumentCount") {
      data[show?.index][name] = value;
      data[show?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const TableData = (status, labno) => {
    setLoading(true);
    axiosInstance
      .post(
        "Dispatch/DynamicLabSearch",
        getTrimmedData({
          LabNo: labno ? labno : formData?.LabNo ? formData.LabNo.trim() : "",
        })
      )
      .then((res) => {
        if (Array.isArray(res.data.message) && res?.data?.message.length > 0) {
          setDispatchData(res?.data?.message);
          setLoad(true);
        } else {
          toast.error(res?.data?.message);
          setDispatchData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setLoading(false);
        setDispatchData([]);
      });
  };

  return (
    <>
      {show4?.modal && (
        <MedicialModal
          show={show4.modal}
          handleClose={() => {
            setShow4({
              modal: false,
              data: "",
              index: -1,
            });
          }}
          MedicalId={show4?.data}
          handleUploadCount={handleUploadCount}
        />
      )}

      {show?.modal && (
        <UploadFile
          show={show?.modal}
          handleClose={() => {
            setShow({ modal: false, data: "", index: -1 });
          }}
          options={Identity}
          documentId={show?.data}
          pageName="Patient Registration"
          handleUploadCount={handleUploadCount}
        />
      )}
      <PageHead name="Dynamic Lab Search">
        <div className="card">
          <div className="row">
            <div className="col-sm-3">
              <Input
                onChange={handleChange}
                value={formData?.LabNo}
                name="LabNo"
                type="text"
                placeholder=""
                lable="Visit No./BarCodeNo"
                id="Visit No./BarCodeNo"
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-info btn-block btn-sm"
                onClick={() => TableData("")}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card mt-2">
        {loading ? (
          <Loading />
        ) : (
          load && (
            <>
              <DynamicLabSearchTable
                dispatchData={dispatchData}
                show={setShow4}
                show2={setShow}
              />
            </>
          )
        )}
      </div>
    </>
  );
};

export default DynamicLabSearch;
