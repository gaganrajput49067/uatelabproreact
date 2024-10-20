import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";

const MemberShipViewModal = ({ data, show, onHide }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(data);

  const getViewTest = (id, key) => {
    setLoading(true);
    axiosInstance
      .post("MembershipCardMaster/GetAllCardDetail", {
        FamilyMemberIsPrimary: id === "Yes" ? 1 : 0,
        PatientId: key,
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
        toast.error();
      });
  };
  useEffect(() => {
    getViewTest(data?.FamilyMemberIsPrimary, data?.patient_id);
  }, []);
  return (
    <>
      <Modal {...{ show, onHide }} title="Test Detail" handleClose={onHide}>
        <div className="card" style={{ width: "1000px" }}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <th>S.N.</th>
                    <th>Department </th>
                    <th>Test Code </th>
                    <th>Test Name</th>
                    <th>
                      {data?.FamilyMemberIsPrimary === "Yes"
                        ? "SelfDisc"
                        : "DeptDisc"}
                    </th>
                    <th>
                      {data?.FamilyMemberIsPrimary === "Yes"
                        ? "SelfFreeTestCount"
                        : "DeptFreeTestCount"}
                    </th>
                    <th>
                      {data?.FamilyMemberIsPrimary === "Yes"
                        ? "SelfFreeTestConsume"
                        : "DeptFreeTestConsume"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((ele, index) => (
                    <tr key={index}>
                      <td data-title="S.N.">{index + 1}</td>
                      <td data-title="Dependent">{ele?.deptname}</td>
                      <td data-title="Test Code">{ele?.TestCode}</td>
                      <td data-title="Test Name">{ele?.ItemName}</td>
                      <td data-title="SelfDisc">
                        {data?.FamilyMemberIsPrimary === "Yes"
                          ? ele?.SelfDisc
                          : ele?.DependentDisc}
                      </td>
                      <td data-title="SelfFreeTestCount">
                        {data?.FamilyMemberIsPrimary === "Yes"
                          ? ele?.SelfFreeTestCount
                          : ele?.DependentFreeTestCount}
                      </td>
                      <td data-title="DeptFreeTestCount">
                        {data?.FamilyMemberIsPrimary === "Yes"
                          ? ele?.SelfFreeTestConsume
                          : ele?.DependentFreeTestConsume}
                      </td>
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

export default MemberShipViewModal;
