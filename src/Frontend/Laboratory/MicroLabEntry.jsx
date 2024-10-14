import React, { useEffect, useState } from "react";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { axiosInstance } from "../../utils/axiosInstance";
import Loading from "../../components/Loading/Loading";
import { getLocalStorageDecryptData } from "../../Navigation/Storage";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import Table from "../../components/Table/Table";
const STATUS_BUTTON = [
  {
    label: "Pending",
    color: "white",
    type: "Pending",
  },
  {
    label: "Microscopic",
    color: "#fec0cb",
    type: "Microscopic",
  },
  {
    label: "Plating",
    color: "#90ee8e",
    type: "Plating",
  },
  {
    label: "Incubation",
    color: "#ff00fc",
    type: "Incubation",
  },
];

const ENTRY_TYPE = [
  {
    label: "Microscopic",
    value: "Microscopic",
  },
  {
    label: "Plating",
    value: "Plating",
  },
  {
    label: "Incubation",
    value: "Incubation",
  },
  {
    label: "All",
    value: "All",
  },
];

const MICROSCOPIC_OPTION = [
  {
    label: "Select",
    value: "",
  },
  {
    label: "Wet Mount",
    value: "Wet Mount",
  },
  {
    label: "Gram Stain",
    value: "Gram Stain",
  },
  {
    label: "AFB",
    value: "AFB",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const INCUBATION_TIME = [
  {
    label: "Select",
    value: "",
  },
  {
    label: "12 Hours",
    value: 12,
  },
  {
    label: "24 Hours",
    value: 24,
  },
  {
    label: "48 Hours",
    value: 48,
  },
  {
    label: "7 Days",
    value: 168,
  },
  {
    label: "15 Days",
    value: 360,
  },
];

const PLATING_COUNT = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
];
const SkipMicroLabEntry = getLocalStorageDecryptData("SkipMicLabEntry");
function MicroLabEntry() {
  const [payload, setPayload] = useState({
    EntryType: "All",
    FromDate: new Date(),
    ToDate: new Date(),
    VisitNo: "",
    SinNo: "",
  });
  const [loading, setLoading] = useState(false);

  const [load, setLoad] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [whichData, setWhichData] = useState({
    Pending: false,
    MicroScopic: false,
    Plating: false,
    Incubation: false,
  });
  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  const handleSearch = (type) => {
    setLoad(true);
    setTableData([]);
    setSingleData({});
    let searchType = type;

    if (getLocalStorageDecryptData("SkipMicLabEntry") == 0) {
    // if (true) {
      if (!type && payload?.EntryType === "Microscopic") {
        searchType = "Microscopic";
      }
      axiosInstance
        .post("RECulture/SearchREData", {
          EntryType: payload?.EntryType,
          FromDate: payload?.FromDate,
          ToDate: payload?.ToDate,
          VisitNo: payload?.VisitNo,
          SINNo: payload?.SinNo,
          SearchType: searchType,
        })
        .then((res) => {
          setLoad(false);
          if (res?.data?.message.length == 0) {
            toast.error("No Record Found");
          }
          setTableData(res?.data?.message);
        })
        .catch((err) => {
          setLoad(false);
          toast.error(err?.response?.data?.message);
        });
    } else {
      setLoad(false);
      if (
        window.confirm(
          "MicroLabEntry Already Done, Do you want to redirect to ResultEntryCulture"
        )
      ) {
        window.location.replace("/resultculture");
      }
    }
  };

  const MicroScopyComponent = ({ data, show }) => {
    const [tableData, setTableData] = useState([]);
    const [payload2, setPayload2] = useState({
      MicroScopic: "",
      MicroScopicComment: "",
    });

    const handleChange2 = (e) => {
      const { name, value } = e.target;
      setPayload2({ ...payload2, [name]: value });
    };
    const handleSave = (data) => {
      setLoading(true);
      const savePayload = tableData.map((ele) => {
        return {
          Test_ID: data.TestID,
          LabObservation_ID: ele?.labObservationID,
          LabObservationName: ele?.labObservationName,
          Value: ele?.value,
          ReadingFormat: ele?.Unit,
          LedgerTransactionNo: data.LedgerTransactionNo,
          BarcodeNo: data.BarcodeNo,
          Reporttype: "Preliminary 1",
        };
      });

      axiosInstance
        .post("RECulture/SaveMicroScopicdata", {
          datatosave: savePayload,
          MicroScopic: payload2?.MicroScopic,
          MicroScopicComment: payload2?.MicroScopicComment,
        })
        .then((res) => {
          setLoading(false);
          handleSearch("Microscopic");
          toast.success(res?.data?.message);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    };

    const fetch = () => {
      axiosInstance
        .post("RECulture/getMicroScopyData", {
          InvestigationID: data?.InvestigationID,
          LedgerTransactionNo: data?.LedgerTransactionNo,
          TestID: data?.TestID,
          BarcodeNo: data?.BarcodeNo,
          Gender: data?.Gender,
          AgeInDays: data?.AgeInDays,
        })
        .then((res) => {
          setTableData(res?.data?.message);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    useEffect(() => {
      show && fetch();
    }, []);

    return (
      <>
        <PageHead name="MicroScopy Detail" showDrop={"true"}>
          {show && (
            <>
              <div className="card">
                <div className="row">
                  <div className="col-sm-6">
                    <SelectBox
                      options={MICROSCOPIC_OPTION}
                      id="MicroScopic"
                      lable="MicroScopic"
                      selectedValue={payload2?.MicroScopic}
                      name="MicroScopic"
                      onChange={handleChange2}
                    />
                  </div>

                  <div className="col-sm-6">
                    <Input
                      lable="MicroScopic Comment"
                      id="MicroScopicComment"
                      placeholder=" "
                      value={payload2?.MicroScopicComment}
                      onChange={handleChange2}
                      name="MicroScopicComment"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* <Table>
            <thead class="cf">
              <tr>
                <th>S.no</th>
                <th>Observation</th>
                <th>Value</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody></tbody>
          </Table> */}

          {show && (
            <div>
              {loading.pend && <Loading />}
              {!loading.pend && (
                <div className="col-sm-3">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleSave(data)}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </PageHead>
      </>
    );
  };

  const PlatingComponent = ({ data, show }) => {
    const [tableData, setTableData] = useState([""]);
    const [comment, setComment] = useState("");
    const [err, setErr] = useState(-1);

    const handleChange = (e) => {
      const value = parseInt(e.target.value);
      const length = [];
      setErr(-1);
      for (let i = 0; i < value; i++) {
        length.push("");
      }
      setTableData(length);
    };

    const handleChangeComment = (e) => {
      const { value, name } = e.target;
      setComment(value);
    };

    const handletableChange = (e, index) => {
      const { value } = e.target;
      const data = [...tableData];
      data[index] = value;
      setTableData(data);
    };
    const check = (data) => {
      for (let i of data) {
        if (i.length == 0) {
          return false;
        }
      }
      return true;
    };
    const handleSave = () => {
      const { match, index } = handleValidation();
      if (match) {
        toast.error("Please enter Value");
        setErr(index);
      } else {
        setLoading(true);
        axiosInstance
          .post("RECulture/SavePlatingData", {
            datatosave: [
              {
                Test_ID: data.TestID,
                LedgerTransactionNo: data.LedgerTransactionNo,
                BarcodeNo: data.BarcodeNo,
                NoOfPlate: tableData.length,
                Comment: comment,
                PlateNo: tableData,
              },
            ],
          })
          .then((res) => {
            setLoading(false);
            handleSearch("Plating");
            toast.success(res?.data?.message);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    };

    const handleValidation = () => {
      let match = false;
      let index = -1;
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i] == "") {
          match = true;
          index = i;
          break;
        }
      }
      return {
        index,
        match,
      };
    };

    return (
      <>
        <PageHead name="Plating Detail" showDrop={"true"}>
          <div className="card">
            <div className="row">
              <div className="col-sm-8">
                <Input
                  lable="Comment"
                  id="comment"
                  name="comment"
                  value={comment}
                  type="comment"
                  placeholder=" "
                  onChange={handleChangeComment}
                />
              </div>

              <div className="col-sm-4">
                <SelectBox
                  options={PLATING_COUNT}
                  name="PLATING_COUNT"
                  lable="PLATING_COUNT"
                  id="PLATING_COUNT"
                  value={tableData?.length}
                  onChange={handleChange}
                />
              </div>
            </div>
            <>
              <Table>
                <thead class="cf">
                  <tr>
                    <th>S.no</th>
                    <th>Plate:Number</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((ele, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          className={`select-input-box form-control input-sm ${
                            index == err && "requireds"
                          }`}
                          value={ele}
                          onChange={(e) => handletableChange(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          </div>
        </PageHead>
        {show && (
          <div className="col-sm-3">
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleSave()}
            >
              Save
            </button>
          </div>
        )}
      </>
    );
  };

  const IncubationComponent = ({ data, show }) => {
    const [payload, setPayload] = useState({
      IncubationPeriod: 12,
      BatchNo: "",
      IncubationComment: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setPayload({ ...payload, [name]: value });
    };

    const handleSave = () => {
      setLoading(true);
      console.log(payload);
      if (payload?.BatchNo == "" || payload?.IncubationComment == "") {
        setLoading(false);
        toast.error("BatchNo and IncubationComment are required");
        return;
      }
      axiosInstance
        .post("RECulture/SaveIncubationData", {
          datatosave: [
            {
              Test_ID: data.TestID,
              LedgerTransactionNo: data.LedgerTransactionNo,
              BarcodeNo: data.BarcodeNo,
              IncubationPeriod: payload?.IncubationPeriod,
              BatchNo: payload?.BatchNo,
              IncubationComment: payload?.IncubationComment,
            },
          ],
        })
        .then((res) => {
          setLoading(false);
          handleSearch("Incubation");
          toast.success(res?.data?.message);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err?.data?.response);
        });
    };

    return (
      <>
        <PageHead name="Micro Lab Entry" showDrop={"true"}>
          <div className="card">
            <div className="row">
              <div className="col-sm-4">
                <SelectBox
                  options={INCUBATION_TIME}
                  id="IncubationPeriod"
                  lable="IncubationPeriod"
                  selectedValue={payload?.IncubationPeriod}
                  name="IncubationPeriod"
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-4">
                <Input
                  type="text"
                  lable="BatchNo"
                  id="BatchNo"
                  placeholder=""
                  value={payload?.BatchNo}
                  name="BatchNo"
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-4">
                <Input
                  lable="IncubationComment"
                  id="IncubationComment"
                  name="IncubationComment"
                  placeholder=" "
                  onChange={handleChange}
                />
              </div>
            </div>{" "}
          </div>
        </PageHead>
        {show && (
          <div className="col-sm-3">
            <button className="btn btn-success btn-sm" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </>
    );
  };

  const UpdateComponent = ({ data, show }) => {
    const [comment, setComment] = useState("");
    const [err, setErr] = useState(-1);
    const [load, setLoad] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [formData, setFormData] = useState({
      MicroScopicComment: "",
      MicroScopic: "",
      PlatingComment: "",
      NoofPlate: "",
      PlateNo: [],
      IncubationPeriod: "",
      IncubationBatch: "",
      IncubationComment: "",
      MicroscopicDoneBY: "",
      MicroscopicDate: "",
    });
    console.log(show);
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name == "NoofPlate") {
        let arr = [];
        for (let i = 0; i < parseInt(value); i++) {
          arr.push("");
        }
        setFormData({ ...formData, [name]: value, PlateNo: arr });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };

    const fetch = () => {
      axiosInstance
        .post("RECulture/GetSavedData", {
          Test_ID: data?.TestID,
        })
        .then((res) => {
          const obj = res?.data?.message[0];
          console.log(obj);
          setFormData({
            MicroScopic: obj?.MicroScopic,
            MicroScopicComment: obj?.MicroScopicComment,
            MicroscopicDoneBY: obj?.MicroScopicDoneBy,
            MicroscopicDate: obj?.MicroScopicDate,
            PlatingDate: obj?.PlatingDate,
            PlatingDoneBy: obj?.PlatingDoneBy,
            IncubationDate: obj?.IncubationDate,
            IncubationDoneBy: obj?.IncubationDoneBy,
            PlatingComment: obj?.PlatingComment,
            NoofPlate: obj?.NoofPlate,
            PlateNo: obj?.PlateNo,
            IncubationPeriod: obj?.IncubationPeriod,
            IncubationBatch: obj?.IncubationBatch,
            IncubationComment: obj?.IncubationComment,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const fetchMicroscopy = () => {
      axiosInstance
        .post("RECulture/getMicroScopyData", {
          InvestigationID: data?.InvestigationID,
          LedgerTransactionNo: data?.LedgerTransactionNo,
          TestID: data?.TestID,
          BarcodeNo: data?.BarcodeNo,
          Gender: data?.Gender,
          AgeInDays: data?.AgeInDays,
        })
        .then((res) => {
          setTableData(res?.data?.message);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const handletableChange = (e, index) => {
      const { value } = e.target;
      const data = formData?.PlateNo;
      data[index] = value;
      setFormData({ ...formData, PlateNo: data });
    };
    const handleValidation = () => {
      let match = false;
      let index = -1;
      for (let i = 0; i < formData?.PlateNo?.length; i++) {
        if (formData?.PlateNo[i] == "") {
          match = true;
          index = i;
          break;
        }
      }
      return {
        index,
        match,
      };
    };
    function emptycheck(obj) {
      const emptyKeys = [];

      for (const key in obj) {
        if (
          obj.hasOwnProperty(key) &&
          (obj[key] === "" || obj[key] === null || obj[key] === undefined)
        ) {
          emptyKeys.push(key);
        }
      }
      if (emptyKeys.length == 0) {
        return [];
      } else {
        return emptyKeys;
      }
    }
    const handleUpdate = () => {
      console.log(formData, data);
      const obj = {
        ...formData,
        Test_ID: data?.TestID,
        NoofPlate: formData?.NoofPlate?.toString(),
        NoOfPlate: formData?.NoofPlate?.toString(),
        Comment: formData?.PlatingComment,
        BatchNo: formData?.IncubationBatch,
      };
      const payload = {
        datatoupdate: [obj],
        datatosave: tableData.map((ele) => {
          return {
            Test_ID: data.TestID,
            LabObservation_ID: ele?.labObservationID,
            LabObservationName: ele?.labObservationName,
            Value: ele?.value,
            ReadingFormat: ele?.Unit,
            LedgerTransactionNo: data.LedgerTransactionNo,
            BarcodeNo: data.BarcodeNo,
            Reporttype: "Preliminary 1",
          };
        }),
      };
      const check = emptycheck(obj);
      if (check.length == 0) {
        const { match, index } = handleValidation();
        if (match) {
          toast.error("Please enter Value");
          setErr(index);
        } else {
          setLoad(true);
          axiosInstance
            .post("api/v1/RECulture/UpdateAllData", payload)
            .then((res) => {
              toast.success(res?.data?.message);
              setSingleData({});
              setLoad(false);
            })
            .catch((err) => {
              toast.error(err?.response?.data?.message);
              setLoad(false);
            });
        }
      } else {
        console.log(check);
        toast.error(`Please Enter ${check.join(",")}`);
      }
    };

    useEffect(() => {
      fetch();
      fetchMicroscopy();
    }, []);

    return load ? (
      <Loading />
    ) : (
      <>
        <div className="row">
          <div className="col-sm-6">
            <PageHead name="MicroScopy Details" showDrop={"true"}>
              <div className="card">
                <div className="row">
                  <div className="col-sm-12">
                    <SelectBox
                      options={MICROSCOPIC_OPTION}
                      selectedValue={formData?.MicroScopic}
                      name="MicroScopic"
                      id="MicroScopic"
                      lable="MicroScopic"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <Input
                      lable="MicroScopic Comment"
                      id="MicroScopicComment"
                      placeholder=" "
                      name="MicroScopicComment"
                      onChange={handleChange}
                      value={formData?.MicroScopicComment}
                    />
                  </div>
                </div>
                {/* <div className="row">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                  style={{ whiteSpace: "normal" }}
                >
                  <thead class="cf">
                    <tr>
                      <th>S.no</th>
                      <th>Observation</th>
                      <th>Value</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div> */}
              </div>
            </PageHead>
          </div>
          <div className="col-sm-6">
            <PageHead name="Plating Details" showDrop={"true"}>
              {" "}
              <div className="card">
                <div className="row">
                  <div className="col-sm-12">
                    <Input
                      lable="Comment"
                      id="comment"
                      value={formData?.PlatingComment}
                      type="comment"
                      placeholder=" "
                      name="PlatingComment"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <SelectBox
                      options={PLATING_COUNT}
                      name="NoofPlate"
                      lable="NoofPlate"
                      id="NoofPlate"
                      placeholder=""
                      selectedValue={formData?.NoofPlate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <Table>
                    <thead class="cf">
                      <tr>
                        <th>S.no</th>
                        <th>Plate:Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData?.PlateNo?.map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              className={`select-input-box form-control input-sm ${
                                index == err && "requireds"
                              }`}
                              value={ele}
                              onChange={(e) => handletableChange(e, index)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </PageHead>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <PageHead name="Micro Lab Entry" showDrop={"true"}>
              <div className="card">
                <div className="row">
                  <div className="col-sm-12">
                    <SelectBox
                      options={INCUBATION_TIME}
                      selectedValue={Number(formData?.IncubationPeriod)}
                      lable="IncubationPeriod"
                      id="IncubationPeriod"
                      name="IncubationPeriod"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <Input
                      lable="Batch/Rack No"
                      id="Batch/Rack No"
                      type="text"
                      placeholder=" "
                      value={formData?.IncubationBatch}
                      name="IncubationBatch"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <Input
                      lable="IncubationComment"
                      placeholder=" "
                      id="IncubationComment"
                      name="IncubationComment"
                      onChange={handleChange}
                      value={formData?.IncubationComment}
                    />
                  </div>
                </div>
              </div>
            </PageHead>
          </div>
          <div className="col-sm-6">
            <Table>
              <tbody>
                <tr className="line-height-table">
                  <td>
                    <label className="requiredlabel">MicroScopy Done By:</label>
                    <div>{formData?.MicroscopicDoneBY}</div>
                  </td>

                  <td>
                    <label className="requiredlabel">Done Date:</label>
                    <div>{formData?.MicroscopicDate}</div>
                  </td>
                </tr>

                <tr className="line-height-table">
                  <td>
                    <label className="requiredlabel">Plating Done By:</label>
                    <div>{formData?.PlatingDoneBy}</div>
                  </td>

                  <td>
                    <label className="requiredlabel">Done Date:</label>
                    <div>{formData?.PlatingDate}</div>
                  </td>
                </tr>

                <tr className="line-height-table">
                  <td>
                    <label className="requiredlabel">Incubation Done By:</label>
                    <div>{formData?.IncubationDoneBy}</div>
                  </td>

                  <td>
                    <label className="requiredlabel">Done Date:</label>
                    <div>{formData?.IncubationDate}</div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <button className="btn btn-success btn-sm" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </>
    );
  };

  const handleSearchWiseDetails = (type, data) => {
    switch (type) {
      case "":
        return <MicroScopyComponent data={data} show={true} />;
        break;
      case "Microscopic":
        return <PlatingComponent data={data} show={true} />;
        break;
      case "Plating":
        return <IncubationComponent data={data} show={true} />;
        break;
      case "Incubation":
        return <UpdateComponent data={data} show={false} />;
        break;
      default:
        break;
    }
  };

  return (
    <>
      {" "}
      {load ? (
        <Loading />
      ) : (
        <>
          <PageHead name="Micro Lab Entry" showDrop={"true"}>
            <div className="card">
              <div className="row">
                <div className="col-sm-2">
                  <SelectBox
                    options={ENTRY_TYPE}
                    selectedValue={payload?.EntryType}
                    name="EntryType"
                    id="EntryType"
                    lable="EntryType"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-2">
                  <DatePicker
                    name="FromDate"
                    id="FromDate"
                    lable="FromDate"
                    value={payload?.FromDate}
                    onChange={dateSelect}
                    maxDate={new Date(payload?.ToDate)}
                  />
                </div>

                <div className="col-sm-2">
                  <DatePicker
                    className="custom-calendar"
                    name="ToDate"
                    value={payload?.ToDate}
                    onChange={dateSelect}
                    placeholder=" "
                    id="ToDate"
                    lable="ToDate"
                    maxDate={new Date()}
                    minDate={new Date(payload?.FromDate)}
                  />
                </div>

                <div className="col-sm-2">
                  <Input
                    value={payload?.VisitNo}
                    name={"VisitNo"}
                    placeholder=" "
                    lable="Visit No"
                    id="VisitNo"
                    type="text"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-2">
                  <Input
                    lable="Sin No"
                    id="SinNo"
                    placeholder=" "
                    value={payload?.SinNo}
                    name={"SinNo"}
                    type="text"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-1">
                  <button
                    className="btn btn-sm btn-primary w-100"
                    onClick={() => handleSearch("")}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="row">
                {STATUS_BUTTON.map((ele, index) => (
                  <div key={index} className="col-sm-1">
                    <button
                      className="statusConfirmed"
                      style={{
                        backgroundColor: ele?.color,
                      }}
                      id={ele?.label}
                      onClick={() => handleSearch(ele?.label)}
                    ></button>
                    <label htmlFor={ele?.label} style={{ color: "black" }}>
                      {ele?.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PageHead>
          <div className="card">
            <div className="row">
              <div className="col-sm-7">
                {tableData?.length > 0 && (
                  <div className="card">
                    <div className="row ">
                      <div
                      className="card-header"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h3>Search Result</h3>
                        <h2>Total Patient : {tableData?.length}</h2>
                      </div>

                      <Table>
                        <thead class="cf">
                          <tr>
                            <th>S.No</th>
                            <th>VisitNo./LRN</th>
                            <th>SIN No</th>
                            <th>Patient Name</th>
                            <th>Test Name</th>
                            <th>Sample Receiving Date and Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData?.map((ele, index) => (
                            <tr
                              key={index}
                              style={{
                                cursor: "pointer",
                                backgroundColor: ele?.rowcolor,
                              }}
                              onClick={() => setSingleData(ele)}
                            >
                              <td>{index + 1}</td>
                              <td>{ele?.LedgerTransactionNo}</td>
                              <td>{ele?.BarcodeNo}</td>
                              <td>{ele?.PName}</td>
                              <td>{ele?.TestName}</td>
                              <td>{ele?.SampleReceiveDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
              {Object.keys(singleData).length > 0 && (
                <div className="col-sm-5">
                  {!loading && (
                    <PageHead name="Details" showDrop={"true"}>
                      <div className="card">
                        <div className="row">
                          <Table>
                            <tbody>
                              <tr className="line-height-table">
                                <td className="requiredlabel">Patient Name:</td>
                                <td colSpan={3}>{singleData?.PName}</td>
                              </tr>
                              <tr className="line-height-table">
                                <td className="requiredlabel">Age:</td>
                                <td>{singleData?.Age}</td>
                                <td className="requiredlabel">Gender:</td>
                                <td>{singleData?.Gender}</td>
                              </tr>

                              <tr className="line-height-table">
                                <td className="requiredlabel">Visit No:</td>
                                <td>{singleData?.LedgerTransactionNo}</td>
                                <td className="requiredlabel">SIN No:</td>
                                <td>{singleData?.BarcodeNo}</td>
                              </tr>

                              <tr className="line-height-table">
                                <td className="requiredlabel">Test Name:</td>
                                <td colSpan={3}>{singleData?.TestName}</td>
                              </tr>

                              <tr className="line-height-table">
                                <td className="requiredlabel">Sample Type:</td>
                                <td>{singleData?.SampleTypeName}</td>
                                <td className="requiredlabel">Party Name:</td>
                                <td>{singleData?.PanelName}</td>
                              </tr>

                              <tr className="line-height-table">
                                <td className="requiredlabel">
                                  Sample Col. Date:
                                </td>
                                <td>{singleData?.SampleCollectionDate}</td>
                                <td className="requiredlabel">
                                  Sample Rec. Date:
                                </td>
                                <td>{singleData?.SampleReceiveDate}</td>
                              </tr>

                              <tr className="line-height-table">
                                <td className="requiredlabel">Status:</td>
                                <td></td>
                                <td className="requiredlabel">
                                  Last Status Date:
                                </td>
                                <td></td>
                              </tr>

                              <tr className="line-height-table">
                                <td className="requiredlabel">Client:</td>
                                <td>{singleData?.PanelName}</td>
                              </tr>
                            </tbody>
                          </Table>

                          {handleSearchWiseDetails(
                            singleData?.CultureStatus,
                            singleData
                          )}
                        </div>
                      </div>
                    </PageHead>
                  )}
                  {loading && <Loading />}
                </div>
              )}
            </div>
          </div>{" "}
        </>
      )}
    </>
  );
}

export default MicroLabEntry;
