import React from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";

const PatientRegistration = () => {
  return (
    <>
      <PageHead name="PatientRegistration">
        <div className="card">
          <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              <div className="row">
                <div className="col-sm-2">
                  <SelectBox name="CentreID" lable="Centre" />
                </div>
                <div className="col-sm-2">
                  <SelectBox name="RateID" lable="RateType" />
                </div>
                <div className="col-sm-2">
                  <SelectBox name="VisitType" lable="VisitType" />
                </div>
                <div className="col-sm-2">
                  <Input
                    className="form-control"
                    lable="MembershipNo"
                    name="MembershipNo"
                    placeholder=" "
                    id="MembershipNo"
                  />
                </div>
                <div className="col-sm-1">
                  <button
                    className="btn btn-primary btn-block btn-sm"
                    id="Membership"
                  >
                    Create Card
                  </button>
                </div>
                <div className="col-sm-2">
                  <Input
                    className="form-control"
                    lable="UHID"
                    name="PatientCode"
                    placeholder=" "
                    id="PatientCode"
                  />
                </div>
                <div className="col-sm-1">
                  <Input
                    className="form-control"
                    lable="PreBookingNo"
                    disabled={true}
                    name="PreBookingNo"
                    placeholder=" "
                    id="PreBookingNo"
                  />
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
