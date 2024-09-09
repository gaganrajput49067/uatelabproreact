import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { isChecked } from "../../utils/helpers";
import Loading from "../../components/Loading/Loading";

function RerunResultEntryModal({ show, data, handleClose }) {
  const [tableData, setTableData] = useState([]);
  const [DropDownData, setDropDownData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Reason, setReason] = useState("");

  const fetchDropDown = () => {
    axiosInstance
      .get("RE/GetRerunresion")
      .then((res) => {
        const data = res?.data?.message?.map((ele) => {
          return {
            label: ele?.RerunResion,
            value: ele?.RerunResion,
          };
        });
        setDropDownData(data);
        setReason(data[0]?.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetch = () => {
    axiosInstance
      .post("RE/GetRerunData", {
        LabNO: data?.LedgerTransactionNo,
        TestId: data?.TestID,
      })
      .then((res) => {
        const data = res?.data?.message?.map((ele, index) => {
          return {
            ...ele,
            isChecked: false,
          };
        });
        setTableData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChecked = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked;
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setTableData(data);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setReason(value);
  };

  const handleSubmit = () => {
    const payload = tableData.filter((ele) => ele?.isChecked === true);
    if (payload?.length > 0) {
      setLoading(true);
      axiosInstance
        .post("RE/savererundata", {
          TestID: data?.TestID,
          LabNo: data?.LedgerTransactionNo,
          Reason: "Check",
          ObservationData: payload,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          handleClose();
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Something Went Wrong"
          );
          setLoading(false);
        });
    } else {
      toast.error("Please Choose one Test");
    }
  };

  useEffect(() => {
    fetch();
    fetchDropDown();
  }, []);

  return (
    <Modal
      title={"Test Rerun"}
      handleClose={handleClose}
      className={"table-md"}
    >
      <div className="card">
        <Table>
          <thead class="cf">
            <tr>
              <th>S.no</th>
              <th>Parameter</th>
              <th>Value</th>
              <th className="text-center">
                <input
                  type="checkbox"
                  name="isChecked"
                  checked={
                    tableData.length > 0
                      ? isChecked("isChecked", tableData, true).includes(false)
                        ? false
                        : true
                      : false
                  }
                  onChange={(e) => handleChecked(e)}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((ele, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{ele?.LabObservationName}</td>
                <td>{ele?.VALUE}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    name="isChecked"
                    checked={ele?.isChecked}
                    onChange={(e) => handleChecked(e, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="row">
          <div className="col-sm-3">
            <label>Rerun Reason:</label>
          </div>
          <div className="col-sm-9">
            <SelectBox
              className="select-input-box form-control input-sm"
              options={DropDownData}
              selectedValue={Reason}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              onClick={handleClose}
            >
              Close
            </button>
          </div>

          <div className="col-sm-2">
            {loading ? (
              <Loading />
            ) : (
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                onClick={handleSubmit}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default RerunResultEntryModal;
