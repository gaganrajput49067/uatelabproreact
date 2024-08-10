import React from "react";
import Modal from "../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import Table from "../../components/Table/Table";
import { dateConfig } from "../../utils/helpers";
const MobileDataModal = ({ mobleData, handleClose4, handleSelctData }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={"Registerd Patient Details"}
      top={"10%"}
      handleClose={handleClose4}
    >
      <Table>
        <thead className="cf">
          <tr>
            <th>{t("Select")}</th>
            <th>{t("UHID")}</th>
            <th>{t("Patient Name")}</th>
            <th>{t("Age")}</th>
            <th>{t("DOB")}</th>
            <th>{t("Gender")}</th>
            <th>{t("Mobile")}</th>
            <th>{t("City")}</th>
            <th>{t("State")}</th>
          </tr>
        </thead>
        <tbody>
          {mobleData.map((data, index) => (
            <tr key={index}>
              <td data-title={t("Select")}>
                <button
                  className="btn  btn-info w-100 btn-sm"
                  onClick={() => {
                    handleSelctData(data);
                  }}
                >
                  {t("Select")}&nbsp;
                </button>
              </td>
              <td data-title={t("UHID")}>{data?.PatientCode}&nbsp;</td>
              <td data-title={t("Patient Name")}>
                {data?.Title +
                  " " +
                  data?.FirstName +
                  " " +
                  data?.MiddleName +
                  " " +
                  data?.LastName}
                &nbsp;
              </td>
              <td data-title={t("Age")}>{data?.Age}&nbsp;</td>
              <td data-title={t("DOB")}>{dateConfig(data?.DOB)}&nbsp;</td>
              <td data-title={t("Gender")}>{data?.Gender}&nbsp;</td>
              <td data-title={t("Mobile")}>{data?.Mobile}&nbsp;</td>
              <td data-title={t("City")}>{data?.City}&nbsp;</td>
              <td data-title={t("State")}>{data?.State}&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Modal>
  );
};

export default MobileDataModal;
