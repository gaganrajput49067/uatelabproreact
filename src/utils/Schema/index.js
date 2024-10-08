
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
  export const DoctorSchema = Yup.object({
    Name: Yup.string().min(3).max(25).required("Please Enter Your Name"),
    Mobile: Yup.string()
      .typeError("That doesn't look like a phone number")
      .required("Phone number is required!")
      .min(10)
      .max(10),
  });
  
  export const ReportEmailValidation = (formData) => {
    let err = "";
   
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    const validateEmails = (emails) => {
      const emailArray = emails.split(',').map(email => email.trim());
      for (const email of emailArray) {
        if (!emailRegex.test(email)) {
          return false;
        }
      }
      return true;
    };
  
    if (!validateEmails(formData?.To)) {
      err = { ...err, To: "Please enter valid email addresses separated by commas" };
    }
  
    if (
      formData?.CC.trim().length > 0 &&
      !validateEmails(formData?.CC)
    ) {
      err = { ...err, CC: "Please enter valid email addresses separated by commas" };
    }
  
    if (
      formData?.BCC.trim().length > 0 &&
      !validateEmails(formData?.BCC)
    ) {
      err = { ...err, BCC: "Please enter valid email addresses separated by commas" };
    }
    return err;
  };
  export const SmsEmail = (formData) => {
    let err = "";
    if (
      formData?.SmsToPatient.length > 0 &&
      formData?.SmsToPatient.length < 10
    ) {
      err = {
        ...err,
        SmsToPatient: "Must contain atleast 10 digits",
      };
    }
  
    if (
      formData?.SmsToDoctor.length > 0 &&
      formData?.SmsToDoctor.length < 10
    ) {
      err = {
        ...err,
        SmsToDoctor: "Must contain atleast 10 digits",
      };
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (
      formData?.EmailToPatient.trim().length > 0 &&
      !emailRegex.test(formData?.EmailToPatient)
    ) {
      err = { ...err, EmailToPatient: "Please enter a valid email address" };
    }
  
    if (
      formData?.EmailToDoctor.trim().length > 0 &&
      !emailRegex.test(formData?.EmailToDoctor)
    ) {
      err = { ...err, EmailToDoctor: "Please enter a valid email address" };
    }
    if (formData?.SmsToClient.length > 0 && formData?.SmsToClient.length < 10) {
      err = {
        ...err,
        SmsToClient: "Must contain atleast 10 digits",
      };
    }
  
    if (
      formData?.EmailToClient.trim().length > 0 &&
      !emailRegex.test(formData?.EmailToClient)
    ) {
      err = { ...err, EmailToClient: "Please enter a valid email address" };
    }
    return err;
  };

  export const validation = (formData) => {
    let err = "";
    if (formData?.Department.trim() === "") {
      err = { ...err, Department: "This Field is Required" };
    }
    if (
      formData?.Department.trim().length < 2
    ) {
      err = { ...err, Departments: "Must have 2 Character" };
    }
  
    if (formData?.DepartmentCode.trim() === "") {
      err = { ...err, DepartmentCode: "This Field is Required" };
    }
    if (
      formData?.DepartmentCode.trim().length < 2
    ) {
      err = { ...err, DepartmentCodes: "Must have 2 Character" };
    }
  
    return err;
  };export const CompanyMasterValidation = Yup.object({
    CompanyCode: Yup.string()
      .required("Please Enter Company Code")
      .min(3)
      .trim("The contact name cannot include leading and trailing spaces"),
    CompanyName: Yup.string()
      .trim("The contact name cannot include leading and trailing spaces")
      .required("Please Enter Company Name"),
    Email: Yup.string()
      .email()
      .required("Please Enter a Your Email")
      .trim("The contact name cannot include leading and trailing spaces")
      .matches(
        /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
        "Please Enter a Valid Email"
      ),
    Mobile1: Yup.string()
      .min(10)
      .trim("The contact name cannot include leading and trailing spaces")
      .required("Please Enter Mobile1"),
    Mobile2: Yup.string()
      .min(10)
      .trim("The contact name cannot include leading and trailing spaces"),
  });
  export const MenuMasterValidation = (payload) => {
    let errors = "";
  
    if (payload?.MenuName?.trim() === "") {
      errors = { ...errors, MenuName: "This Field is Required" };
    } else if (payload?.MenuName.length < 2) {
      errors = { ...errors, MenuName: "Must be 2 Character long" };
    }
  
    if (payload?.Priority.trim() === "") {
      errors = { ...errors, Priority: "This Field is Required" };
    }
  
    return errors;
  };
  export const PageMasterValidation = (payload) => {
    let errors = "";
    if (payload?.MenuID === "") {
      errors = { ...errors, MenuID: "This Field is Required" };
    }
    if (payload?.PageName?.trim() === "") {
      errors = { ...errors, PageName: "This Field is Required" };
    } else if (payload?.PageName.length < 2) {
      errors = { ...errors, PageName: "Must be 2 Character long" };
    }
    if (payload?.Url?.trim() === "") {
      errors = { ...errors, Url: "This Field is Required" };
    } else if (payload?.Url.length < 2) {
      errors = { ...errors, Url: "Must be 2 Character long" };
    }
    if (toString(payload?.Priority).trim() === "") {
      errors = { ...errors, Priority: "This Field is Required" };
    }
  
    return errors;
  };