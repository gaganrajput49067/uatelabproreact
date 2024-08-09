import axios from "axios";
import * as Yup from "yup";
const conditionalRequired = (message) => Yup.string().test(
    "isRequired",
    message,
    function (value) {
      if (this.parent.PNDT) {
        return value;
      }
      return true;
    }
  );
  const conditionalRequiredMobile = (message) => Yup.string().test(
    "isRequired",
    message,
    function (value) {
      if (this.parent.BTB != 1) {
        return value; 
      }
      return true;
    }
  );
  export const PatientRegisterSchema = Yup.object({
    Mobile: conditionalRequiredMobile("This Field is Required").min(10, "Minimum 10 characters"),
    FirstName: Yup.string()
      .required("This Field is Required")
      .min(1)
      .max(25)
      .trim(),
    DOB: Yup.date()
      .required("This Field is Required")
      .max(new Date(), "inValid Date"),
    DoctorID: Yup.string().required("This Field is Required"),
    DoctorName: Yup.string().required("This Field is Required"),
    Email: Yup.string().email(),
    Husband: conditionalRequired("This Field is Required"),
    NoOfChildren: conditionalRequired("This Field is Required"),
    NoOfSon: conditionalRequired("This Field is Required"),
    NoOfDaughter: conditionalRequired("This Field is Required"),
    Pregnancy: conditionalRequired("This Field is Required"),
    AgeOfSon: conditionalRequired("This Field is Required"),
    AgeOfDaughter: conditionalRequired("This Field is Required"),
    PNDTDoctor: conditionalRequired("This Field is Required"),
  });

  export const CouponValidateSchema = (state, formData,LTData) => {

    let err = "";
    if (state?.Mobile == "" && LTData?.BTB!=1) {
      err = { ...err, Mobile: "This Field is Required" };
    }
    if (state?.Mobile != "" && state?.Mobile.length < 10) {
      err = { ...err, Mobiles: "Mobile must be at least 10 characters" };
    }
  
    if (state?.FirstName == "") {
      err = { ...err, FirstName: "This Field is Required" };
    }
    if (state?.FirstName != "" && state?.FirstName.trim().length < 3) {
      err = { ...err, FirstNames: "FirstName must be at least 3 characters" };
    }
    if (state?.DOB == "") {
      err = { ...err, DOB: "This Field is Required" };
    }
    if (formData?.DoctorName == "") {
      err = { ...err, DoctorName: "This Field is Required" };
    }
    if (formData?.DoctorName != "" && formData?.DoctorID == "") {
      err = { ...err, DoctorID: "This Field is Required" };
    }
    return err;
  };