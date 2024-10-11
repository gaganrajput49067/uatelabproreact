import React from "react";
import { useTranslation } from "react-i18next";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";

const { t } = useTranslation();

const SampleTypeCreate = () => {
  return (
    <>
      <PageHead name="SampleTypeCreate" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Sample Name"
                id="SampleName"
                name="SampleName"
                placeholder=" "
              />
              <Input
                type="text"
                lable="Sample Name"
                id="SampleName"
                name="SampleName"
                placeholder=" "
              />
            </div>
            <div className="col-sm-1">
              <label>IsActive</label>
              &nbsp;
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
              />
            </div>

            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-success btn-sm"
              >
                {load ? <Loading /> : t("Save")}
              </button>
            </div>
          </div>
        </div>
        <div className="card">
          <Table>
            {" "}
            <thead className="cf">
              <tr>
                <th>{t("SampleName")}</th>
                <th>{t("Container")}</th>
                <th>{t("ColorName")}</th>
                <th>{t("Active")}</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </Table>
        </div>
      </PageHead>
    </>
  );
};

export default SampleTypeCreate;
