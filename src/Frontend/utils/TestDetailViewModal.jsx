import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";

const TestDetailViewModal = ({ data, show, onHide }) => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  console.log(data);
  const getMemberShipCard = (id) => {
    setLoading(true);
    axiosInstance
      .post("MembershipCardIssue/ViewCardDetail", {
        FamilyMemberGroupId: id,
      })
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.message);
          toast.success(res?.data?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };
  useEffect(() => {
    getMemberShipCard(data?.FamilyMemberGroupID);
  }, []);
  return (
    <>
      <Modal
        {...{ show, onHide }}
        title={`Test Details           Card No.: ${data?.cardno}`}
        handleClose={onHide}
      >
        <div className="card" style={{ width: "1000px" }}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Table>
                <thead className="cf">
                  <tr>
                    <th>S.N.</th>
                    <th>Dependent </th>
                    <th>Test Code </th>
                    <th>Test Name</th>
                    <th>SelfDisc</th>
                    <th>DeptDisc</th>
                    <th>SelfFreeTestCount</th>
                    <th>DeptFreeTestCount</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((ele, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{ele?.deptname}</td>
                      <td>{ele?.TestCode}</td>
                      <td>{ele?.ItemName}</td>
                      <td>{ele?.SelfDisc}</td>
                      <td>{ele?.DependentDisc}</td>
                      <td>{ele?.SelfFreeTestCount}</td>
                      <td>{ele?.DependentFreeTestCount}</td>
                      {/* <td>{ele?.}</td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="row">
                <div className="col-sm-2">
                  <button
                    className="btn btn-block btn-danger btn-sm"
                    onClick={onHide}
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default TestDetailViewModal;
