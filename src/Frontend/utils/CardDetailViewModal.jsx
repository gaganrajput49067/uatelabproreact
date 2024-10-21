import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";

const CardDetailViewModal = ({ data, show, onHide }) => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  console.log(data);
  const getMemberShipCard = async (id) => {
    setLoading(true);
    await axiosInstance
      .post("MembershipCardIssue/GetCardDetail", {
        MemberShipId: id,
      })
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.message);
          toast.success(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };
  useEffect(() => {
    getMemberShipCard(data);
  }, []);
  console.log(loading);
  return (
    <Modal {...{ show, onHide }} title="Card Test Details" handleClose={onHide}>
      <div className="card">
        <div className="row">
          {loading ? (
            <Loading />
          ) : (
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
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CardDetailViewModal;
