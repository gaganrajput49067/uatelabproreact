import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import Modal from "../../components/Modal/Modal";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";

const CampTestDetailModal = ({ selectedData, show, onHide }) => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const GetCampTestDetailData = (ID) => {
    setLoading(true);
    axiosInstance
      .post("Camp/GetCampTestDetail", { ID: ID })
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    GetCampTestDetailData(selectedData?.ID);
  }, []);
  return (
    <>
      <Modal
        title={"Camp Test Detail"}
        {...{ show, onHide }}
        handleClose={onHide}
      >
        <div className="card" style={{ width: "500px" }}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Item</th>
                    <th>Request Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title="Code">{ele?.testCode}</td>
                      <td data-title="Item">{ele?.TestName}</td>
                      <td data-title="RequestDate">{ele?.requestedrate}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CampTestDetailModal;
