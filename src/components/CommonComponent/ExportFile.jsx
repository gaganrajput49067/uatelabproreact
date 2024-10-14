import React from "react";

import { useTranslation } from "react-i18next";
import { ExportToExcel } from "../../utils/helpers";
function ExportFile({ dataExcel }) {
  const { t } = useTranslation();
  return (
    <>
      <>
        <button
          className="btn btn-block btn-success btn-sm"
          onClick={() => ExportToExcel(dataExcel)}
          disabled={dataExcel.length == 0}
        >
          {t("Download")}
        </button>
      </>
    </>
  );
}

export default ExportFile;
