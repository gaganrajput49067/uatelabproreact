import React from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import MyImage from "../../assets/image/Gagan.jpg";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import DatePicker from "../../components/CommonComponent/DatePicker";
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
                <div className="col-sm-1">
                  <SelectBox name="VisitType" lable="VisitType" />
                </div>
                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="UHID"
                    name="PatientCode"
                    placeholder=" "
                    id="PatientCode"
                  />
                </div>
                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="PreBookingNo"
                    disabled={true}
                    name="PreBookingNo"
                    placeholder=" "
                    id="PreBookingNo"
                  />
                </div>
                <div className="col-sm-2">
                  <Input
                    type="text"
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
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <div className="p-inputgroup flex-1">
                    <Input
                      className="select-input-box form-control input-sm required"
                      name="Mobile"
                      id="Mobile"
                      type="number"
                      lable="Mobile Number"
                      placeholder=" "
                    />
                    <Button icon="pi pi-search" className="iconSize" />
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="d-flex">
                    <div style={{ width: "30%" }}>
                      <SelectBox name="Title" id="Title" lable="Title" />
                    </div>
                    <div style={{ width: "70%" }}>
                      <Input
                        className="select-input-box form-control input-sm required"
                        name="FirstName"
                        type="text"
                        id="FirstName"
                        lable="First Name"
                        placeholder=" "
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="Middle Name"
                    name="MiddleName"
                    placeholder=" "
                    id="MiddleName"
                  />
                </div>
                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="Last Name"
                    name="LastName"
                    placeholder=" "
                    id="LastName"
                  />
                </div>
                {/* <div className="col-sm-1"> */}
                {/* <div className="p-inputgroup flex-1">
                    <Input
                      id="DoctorName"
                      className="select-input-box form-control input-sm required"
                      name="DoctorName"
                      lable="Doctor Name"
                      placeholder=" "
                    />
                    <Button icon="pi pi-plus" className="iconSize" />
                  </div> */}

                {/* */}
                {/* </div> */}
                <div className="col-sm-2">
                  <SelectBox name="Gender" id="Gender" lable="Gender" />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <DatePicker
                    className="custom-calendar"
                    name="DOB"
                    placeholder=" "
                    value={new Date()}
                    id="DOB"
                    lable="DOB"
                  />
                </div>
                <div className="col-sm-3">
                  <div className="p-inputgroup flex-1">
                    <Input placeholder=" " type="text" id="Y" name="AgeYear" />
                    <span className="p-inputgroup-addon iconSizeAge">Y</span>

                    <Input placeholder=" " type="text" id="M" name="AgeMonth" />
                    <span className="p-inputgroup-addon iconSizeAge">M</span>
                    <Input placeholder=" " type="text" id="D" name="AgeDays" />
                    <span className="p-inputgroup-addon iconSizeAge">D</span>
                  </div>
                </div>

                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="Email"
                    name="Email"
                    placeholder=" "
                    id="Email"
                  />
                </div>
                <div className="col-sm-2">
                  <Input
                    lable="Address"
                    type="text"
                    name="HouseNo"
                    placeholder=" "
                    id="Address"
                  />
                </div>
                <div className="col-sm-1">
                  <Input
                    lable="Pincode"
                    type="number"
                    name="PinCode"
                    placeholder=" "
                    id="PinCode"
                  />
                </div>
                <div className="col-sm-2">
                  <Input
                    lable="Locality"
                    type="text"
                    name="Locality"
                    placeholder=" "
                    id="Locality"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="City"
                    name="City"
                    placeholder=" "
                    id="City"
                  />
                </div>
                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="State"
                    name="State"
                    placeholder=" "
                    id="State"
                  />
                </div>
                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="Country"
                    name="Country"
                    placeholder=" "
                    id="Country"
                  />
                </div>

                <div className="col-sm-4">
                  <div className="d-flex">
                    <div style={{ width: "30%" }}>
                      <SelectBox name="IdType" id="IdType" lable="IdType" />
                    </div>
                    <div style={{ width: "70%" }}>
                      <Input
                        className="select-input-box form-control input-sm required"
                        name="PatientIDProofNo"
                        type="text"
                        id="PatientIDProofNo"
                        lable="Patient ID Proof Number"
                        placeholder=" "
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <SelectBox name="CollectionBoyId" lable="Collection Boy" />
                </div>
              </div>
              <div className="row">
                
              </div>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12" >
              <div className="row">
                <div className="col-sm-12" >
                  <Image
                    src={MyImage}
                    alt="Image"
                    width="182"
                    height="130"
                    preview
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <button
                    className="btn btn-info btn-block btn-sm"
                    id="Upload Document"
                  >
                    Upload Document
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <button
                    className="btn btn-info btn-block btn-sm"
                    id="Medical History"
                  >
                    Medical History
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <button
                    className="btn btn-primary btn-block btn-sm"
                    id="PRDM"
                  >
                    PRDM
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <button
                    className="btn btn-primary btn-block btn-sm"
                    id="PNDT"
                  >
                    Pre-Natal Diagnostic Technique
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default PatientRegistration;
