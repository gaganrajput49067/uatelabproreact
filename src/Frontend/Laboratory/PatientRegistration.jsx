import React from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";

const PatientRegistration = () => {
  return (
    <>
      <PageHead name="PatientRegistration">
        <div className="card">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <div className="row">
                <div className="col-sm-2">
                  <SelectBox name="CentreID" lable="Centre"/>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">eehebec</div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default PatientRegistration;
