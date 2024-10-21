import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import MemberShipViewModal from "./MemberShipViewModal";

const DependentMemberDetailModal = ({ data, show, onHide }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [MemberShipViewData, setMemberShipViewData] = useState(false);
  const [ViewData, setViewData] = useState(false);
  console.log(data);
  const getMemberShipCard = (id) => {
    setLoading(true);
    axiosInstance
      .post("MembershipCardMaster/BindMembershipMember", {
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
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    getMemberShipCard(data?.FamilyMemberGroupID);
  }, []);
  console.log(tableData);
  return (
    <>
      {MemberShipViewData && (
        <MemberShipViewModal
          show={MemberShipViewData}
          data={ViewData}
          onHide={() => {
            setMemberShipViewData(false);
          }}
        />
      )}
      <Modal
        {...{ show, onHide }}
        title="Dependent Members Detail Modal"
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
                    <th>Member Name</th>
                    <th>UHID</th>
                    <th>Mobile No.</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Relation</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((ele, index) => (
                    <tr key={index}>
                      <td data-title="S.N.">{index + 1}</td>
                      <td data-title="Member Name">{ele?.pname}</td>
                      <td data-title="UHID">{ele?.patient_id}</td>
                      <td data-title="Mobile No.">{ele?.Mobile}</td>
                      <td data-title="Age">{ele?.age}</td>
                      <td data-title="Gender">{ele?.gender}</td>
                      <td data-title="Relation">{ele?.relation}</td>
                      <td
                        data-title="View"
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => {
                          setMemberShipViewData(true);
                          setViewData(ele);
                        }}
                      >
                        <i className="fa fa-search" />
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

export default DependentMemberDetailModal;
