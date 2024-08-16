import React, { useEffect, useState } from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import { BindFieldType } from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import { Link } from "react-router-dom";
import { dateConfig } from "../../utils/helpers";
import { toast } from "react-toastify";

const ViewGlobalMaster = () => {
  const [FieldType, setFieldType] = useState([]);
  const [type, setType] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [load, setLoad] = useState(false);

  const handleChanges = (select) => {
    const data = select.map((ele) => {
      return {
        Type: ele?.value,
      };
    });
    setType(data);
  };
  const handleSearch = () => {
    setLoad(true);
    if (type.length > 0) {
      axiosInstance
        .post("Global/getGlobalDataByFieldType", type)
        .then((res) => {
          setTableData(res?.data?.message);
          setLoad(false);
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
      handleEffect();
    }
  };

  const handleEffect = () => {
    setLoad(true);
    axiosInstance
      .post("Global/getGlobalDataAll")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad(false);
      });
  };

  useEffect(() => {
    BindFieldType(setFieldType);
    handleEffect();
  }, []);
  return (
    <>
      <PageHead name="Global Type Master">
        <div className="card">
          <div className="row">
            <div className="col-sm-2 col-md-2">
              <SelectBoxWithCheckbox
                options={FieldType}
                placeholder=" "
                name="FieldType"
                lable="Field Type"
                id="Field Type"
                onChange={handleChanges}
              />
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-success btn-sm btn-block"
                  onClick={handleSearch}
                >
                  {"Search"}
                </button>
              )}
            </div>

            <div className="col-sm-1">
              <Link to="/GlobalTypeMaster">{"Create New"}</Link>
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card mt-2">
        <Table paginate={true} data={tableData ?? []} itemsPerPage={20}>
          {({ currentItems, finalIndex }) => {
            return (
              <>
                <thead className="cf thead-class">
                  <tr>
                    <th>{"S.No"}</th>
                    <th>{"FieldType"}</th>
                    <th>{"FieldDisplay"}</th>
                    <th>{"Entry Date"}</th>
                    <th>{"Action"}</th>
                    <th>{"Edit"}</th>
                  </tr>
                </thead>{" "}
                <tbody>
                  {currentItems.map((data, index) => (
                    <tr key={index}>
                      <td data-title={"S.No"}>{index + finalIndex}</td>
                      <td data-title={"FieldType"}>{data?.FieldType}</td>
                      <td data-title={"FieldDisplay"}>{data?.FieldDisplay}</td>
                      <td data-title={"Entry Date"}>
                        {dateConfig(data?.EntryDate)}
                      </td>
                      <td data-title={"Action"}>
                        {data?.IsActive === 1 ? "Active" : "Expired"}
                      </td>
                      <td>
                        {data.CompanyId === 0 ? (
                          <p
                            style={{ color: "red" }}
                            Tooltip="System Generated it can't be changed"
                          >
                            System Generated it can't be changed
                          </p>
                        ) : (
                          <Link
                            to="/GlobalTypeMaster"
                            state={{
                              data: data,
                              url: "/api/v1/Global/UpdateGlobalData",
                            }}
                          >
                            {"Edit"}
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            );
          }}
        </Table>
      </div>
    </>
  );
};

export default ViewGlobalMaster;
