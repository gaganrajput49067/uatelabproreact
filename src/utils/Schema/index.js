import moment from "moment";
import * as Yup from "yup";
const conditionalRequired = (message) =>
  Yup.string().test("isRequired", message, function (value) {
    if (this.parent.PNDT) {
      return value;
    }
    return true;
  });
const conditionalRequiredMobile = (message) =>
  Yup.string().test("isRequired", message, function (value) {
    if (this.parent.BTB != 1) {
      return value;
    }
    return true;
  });
export const PatientRegisterSchema = Yup.object({
  Mobile: conditionalRequiredMobile("This Field is Required").min(
    10,
    "Minimum 10 characters"
  ),
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

export const CouponValidateSchema = (state, formData, LTData) => {
  let err = "";
  if (state?.Mobile == "" && LTData?.BTB != 1) {
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
    const emailArray = emails.split(",").map((email) => email.trim());
    for (const email of emailArray) {
      if (!emailRegex.test(email)) {
        return false;
      }
    }
    return true;
  };

  if (!validateEmails(formData?.To)) {
    err = {
      ...err,
      To: "Please enter valid email addresses separated by commas",
    };
  }

  if (formData?.CC.trim().length > 0 && !validateEmails(formData?.CC)) {
    err = {
      ...err,
      CC: "Please enter valid email addresses separated by commas",
    };
  }

  if (formData?.BCC.trim().length > 0 && !validateEmails(formData?.BCC)) {
    err = {
      ...err,
      BCC: "Please enter valid email addresses separated by commas",
    };
  }
  return err;
};
export const SmsEmail = (formData) => {
  let err = "";
  if (formData?.SmsToPatient.length > 0 && formData?.SmsToPatient.length < 10) {
    err = {
      ...err,
      SmsToPatient: "Must contain atleast 10 digits",
    };
  }

  if (formData?.SmsToDoctor.length > 0 && formData?.SmsToDoctor.length < 10) {
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
  if (formData?.Department.trim().length < 2) {
    err = { ...err, Departments: "Must have 2 Character" };
  }

  if (formData?.DepartmentCode.trim() === "") {
    err = { ...err, DepartmentCode: "This Field is Required" };
  }
  if (formData?.DepartmentCode.trim().length < 2) {
    err = { ...err, DepartmentCodes: "Must have 2 Character" };
  }

  return err;
};
export const CompanyMasterValidation = Yup.object({
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

export const SubPageMasterValidation = (payload) => {
  let errors = "";
  if (payload?.MenuID === "") {
    errors = { ...errors, MenuID: "This Field is Required" };
  }
  if (payload?.PageId === "") {
    errors = { ...errors, PageId: "This Field is Required" };
  }
  if (payload?.SubPageName === "") {
    errors = { ...errors, SubPageName: "This Field is Required" };
  } else if (payload?.SubPageName.length < 2) {
    errors = { ...errors, SubPageName: "Must be 2 Character long" };
  }

  if (payload?.Url === "") {
    errors = { ...errors, Url: "This Field is Required" };
  } else if (payload?.Url.length < 2) {
    errors = { ...errors, Url: "Must be 2 Character long" };
  }

  if (toString(payload?.Priority).trim() === "") {
    errors = { ...errors, Priority: "This Field is Required" };
  }

  return errors;
};

export const validationForSampleType = (formData) => {
  let err = "";
  if (formData?.SampleName.trim() === "") {
    err = { ...err, SampleName: "This Field is Required" };
  }
  if (formData?.Container === "") {
    err = { ...err, Container: "This Field is Required" };
  }
  return err;
};
export const CenterMasterValidationSchema = Yup.object({
  CentreCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Centre: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  PANNo: Yup.string().min(10),
  BankAccountNo: Yup.string().min(10),
  IFSCCode: Yup.string().min(11),
  DemandDraft: Yup.string().min(6),
  Email: Yup.string()
    .email()
    .trim("The contact name cannot include leading and trailing spaces")
    .matches(
      /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Please Enter a Valid Email"
    ),
  Type: Yup.string().required("This Field is Required"),
  Phone: Yup.string().min(10).max(12).trim(),
  Url: Yup.string()
    .trim("Url cannot include leading and trailing spaces")
    .matches(/^[A-Za-z0-9._%-]+\.[A-Za-z]{2,6}$/, "Please Enter a Valid Url"),
});

export const RateMasterValidationSchema = Yup.object({
  CentreCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  Centre: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Type: Yup.string().required("This Field is Required"),
  AgainstInvoice: Yup.string().required("This Field is Required"),
  Email: Yup.string()
    .email()
    .trim("The contact name cannot include leading and trailing spaces")
    .matches(
      /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Please Enter a Valid Email"
    ),
  InvoiceEmail: Yup.string()
    .email()
    .trim("The contact name cannot include leading and trailing spaces")
    .matches(
      /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Please Enter a Valid Email"
    ),
  Phone: Yup.string().min(10).max(12).trim(),
  Url: Yup.string()
    .trim("Url cannot include leading and trailing spaces")
    .matches(/^[A-Za-z0-9._%-]+\.[A-Za-z]{2,6}$/, "Please Enter a Valid Url"),
  IntimationLimit: Yup.string().test(
    "is-less-than-or-equal",
    "Intimation limit must be less than or equal to credit limit",
    function (intimationLimit) {
      const creditLimit = this.resolve(Yup.ref("CreditLimit"));
      return (
        !creditLimit ||
        !intimationLimit ||
        parseFloat(intimationLimit) <= parseFloat(creditLimit)
      );
    }
  ),
});

export const RateMasterValidationSchemacash = Yup.object({
  CentreCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  Centre: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Type: Yup.string().required("This Field is Required"),

  Email: Yup.string()
    .email()
    .trim("The contact name cannot include leading and trailing spaces")
    .matches(
      /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Please Enter a Valid Email"
    ),
  InvoiceEmail: Yup.string()
    .email()
    .trim("The contact name cannot include leading and trailing spaces")
    .matches(
      /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Please Enter a Valid Email"
    ),
  Phone: Yup.string().min(10).max(12).trim(),
  Url: Yup.string()
    .trim("Url cannot include leading and trailing spaces")
    .matches(/^[A-Za-z0-9._%-]+\.[A-Za-z]{2,6}$/, "Please Enter a Valid Url"),
});

export const InvestigationsMasterSchema = Yup.object().shape({
  TestCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  TestName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  // ShortName: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  // PrintName: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  SampleContainer: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  FromAge: Yup.number().required("This Field is Required"),
  // PrintSequence: Yup.number().required("This Field is Required"),
  ToAge: Yup.number()
    .required("This Field is Required")
    .test(
      "from-to-age",
      "To age must be greater than or equal to FromAge",
      function (value) {
        const { FromAge } = this.parent;
        return value >= FromAge;
      }
    )
    .test("not-zero", "Age must not be zero", function (value) {
      return value !== 0;
    }),

  ReportType: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Gender: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  DepartmentID: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  // SampleQty: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  // SampleRemarks: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  SampleTypeId: Yup.string().test(
    "isRequired",
    "This Field is Required",
    function (value) {
      const sampleOption = this.parent.SampleOption;
      if (sampleOption === "Sample Required") {
        return !!value;
      }
      return true;
    }
  ),
  // SampleTypeId: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  BaseRate: Yup.number().required("This Field is Required"),
  MaxRate: Yup.number()
    .required("This Field is Required")
    .test(
      "MaxRate",
      "MaxRate must be greater than or equal to BaseRate",
      function (value) {
        const { BaseRate } = this.parent;
        return value >= BaseRate;
      }
    ),

  MethodName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const ProfileInvestigationsMasterSchema = Yup.object().shape({
  TestCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  TestName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  // ShortName: Yup.string()
  //   .required("This Field is Required")
  // .trim("The contact name cannot include leading and trailing spaces"),
  // PrintName: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  SampleContainer: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  FromAge: Yup.number().required("This Field is Required"),
  ToAge: Yup.number()
    .required("This Field is Required")
    .test(
      "from-to-age",
      "To age must be greater than or equal to FromAge",
      function (value) {
        const { FromAge } = this.parent;
        return value >= FromAge;
      }
    ),
  ReportType: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Gender: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  DepartmentID: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  // SampleQty: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  // SampleRemarks: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  // SampleTypeId: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  SampleTypeId: Yup.string().test(
    "isRequired",
    "This Field is Required",
    function (value) {
      const sampleOption = this.parent.SampleOption;
      if (sampleOption === "Sample Required") {
        return !!value;
      }
      return true;
    }
  ),

  BaseRate: Yup.number().required("BaseRate is required"),
  MaxRate: Yup.number()
    .required("This Field is Required")
    .test(
      "MaxRate",
      "MaxRate must be greater than or equal to BaseRate",
      function (value) {
        const { BaseRate } = this.parent;
        return value >= BaseRate;
      }
    ),
});
export const PackageInvestigationsMasterSchema = Yup.object().shape({
  TestCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  TestName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  // ShortName: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  FromAge: Yup.number().required("This Field is Required"),
  // PrintSequence: Yup.number().required("This Field is Required"),
  ToAge: Yup.number()
    .required("This Field is Required")
    .test(
      "from-to-age",
      "To age must be greater than or equal to FromAge",
      function (value) {
        const { FromAge } = this.parent;
        return value >= FromAge;
      }
    )
    .test("not-zero", "Age must not be zero", function (value) {
      return value !== 0;
    }),

  Gender: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  DepartmentID: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  BaseRate: Yup.number().required("This Field is Required"),
  MaxRate: Yup.number()
    .required("This Field is Required")
    .test(
      "MaxRate",
      "MaxRate must be greater than or equal to BaseRate",
      function (value) {
        const { BaseRate } = this.parent;
        return value >= BaseRate;
      }
    ),
});

export const DocotorReferal = Yup.object({
  // DoctorCode: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  // Phone: Yup.number(),
  // Title: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  Name: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  // Locality: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  // Zone: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  // Degree: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  // Specialization: Yup.string()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  //  ClinicName: Yup.string()
  //    .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces"),
  // Email: Yup.string()
  //   .email()
  //   .required("This Field is Required")
  //   .trim("The contact name cannot include leading and trailing spaces")
  //   .matches(
  //     /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
  //     "Please Enter a Valid Email"
  //   ),
  Mobile: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .matches(/^[5-9]\d{9}$/, "Phone number is not valid")
    .required("This Field is Required"),
});

export const EmployeeMasterSchema = Yup.object({
  Name: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Mobile: Yup.string().matches(
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    "Phone number is not valid"
  ),
  Email: Yup.string()
    .email()
    .trim("The contact name cannot include leading and trailing spaces")
    .matches(
      /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Please Enter a Valid Email"
    ),
  Department: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Centre: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  AccessRight: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  ApprovalRight: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  CentreID: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  DesignationID: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Username: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  isPassword: Yup.boolean(),
  Password: Yup.string().when("isPassword", (isPassword, schema) => {
    if (isPassword[0]) {
      return schema
        .required("Please Enter your password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        );
    }
    return schema;
  }),
});
export const validationForDesignations = (formData) => {
  let err = "";
  if (formData?.Name.trim() === "") {
    err = { ...err, Name: "This Field is Required" };
  }
  if (formData?.SequenceNo === "") {
    err = { ...err, SequenceNo: "This Field is Required" };
  }
  return err;
};

export const AdvancePaymentValidationSchema = (formData) => {
  let err = "";
  if (formData?.Type == "") {
    err = { ...err, Type: "This Field is Required" };
  }
  if (formData?.RateTypeID == "") {
    err = { ...err, RateTypeID: "This Field is Required" };
  }

  return err;
};

export const FieldMasterValidation = Yup.object({
  Name: Yup.string()
    .required("Please Enter Your Name")
    .min(3)
    .max(20)
    .trim("The contact name cannot include leading and trailing spaces"),
  Age: Yup.string()
    .required("Please Enter Your Name")
    .min(1)
    .max(3)
    .trim("The contact name cannot include leading and trailing spaces"),
  Mobile: Yup.string()
    .typeError("That doesn't look like a phone number")
    .required("Phone number is required!")
    .min(10)
    .max(10)
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const InvestigationCommentMasterValidation = (payload) => {
  let errors = "";
  if (payload?.InvestigationID === "") {
    errors = { ...errors, InvestigationID: "This Field is Required" };
  }
  return errors;
};

export const InvestigationCommentValidation = Yup.object().shape({
  InvestigationID: Yup.array().required("This Field is Required"),
});
export const MicroBioMasterSchema = (formData) => {
  let err = "";

  if (formData?.Name.trim() === "") {
    err = { ...err, Name: "This Field is Required" };
  }
  if (formData?.Code.trim() === "") {
    err = { ...err, Code: "This Field is Required" };
  }

  return err;
};

export const validationForIDMAster = (formData) => {
  let err = "";
  if (formData?.TypeName === "") {
    err = { ...err, TypeName: "This Field is Required" };
  }
  if (formData?.InitialChar?.trim() === "") {
    err = { ...err, InitialChar: "This Field is Required" };
  }
  if (formData?.FinancialYearStart?.trim() === "") {
    err = { ...err, FinancialYearStart: "This Field is Required" };
  }

  if (formData?.TypeLength === "") {
    err = { ...err, TypeLength: "This Field is Required" };
  }
  return err;
};

export const OutSourceLabMasterValidationSchema = Yup.object({
  LabName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  ContactPersonName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  MobileNo: Yup.string().min(10).required("This Field is Required"),
  EmailID: Yup.string().email(),
});
export const ChangePasswordSchema = Yup.object({
  OldPassword: Yup.string()
    .required("Please Enter your old Password")
    .min(6)
    .trim("The contact name cannot include leading and trailing spaces"),
  NewPassword: Yup.string()
    .trim("The contact name cannot include leading and trailing spaces")
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  ConfirmPassword: Yup.string()
    .trim("The contact name cannot include leading and trailing spaces")
    .required()
    .oneOf([Yup.ref("NewPassword"), null], "Passwords must match"),
});
export const CompanyKeyValidationSchema = (payload) => {
  let err = "";
  if (payload?.CompanyID === "") {
    err = { ...err, CompanyID: "This Field is Required" };
  }
  if (payload?.KeyID.trim() === "") {
    err = { ...err, KeyID: "This Field is Required" };
  }
  if (payload?.SecretKey.trim() === "") {
    err = { ...err, SecretKey: "This Field is Required" };
  }

  return err;
};
export const OnlinePaymentValidationSchema = (payload) => {
  let err = "";
  if (payload?.RateTypeId === "") {
    err = { ...err, RateTypeId: "This Field is Required" };
  }
  if (payload?.Amount === "") {
    err = { ...err, Amount: "This Field is Required" };
  }

  return err;
};
export const ModalityMasterValidations = (formData)=>{
  let err=""
  if (formData?.DepartmentId == "") {
    err = { ...err, DepartmentId: "This Field is Required" };
  }
  if (formData?.ModalityName == "") {
    err = { ...err, ModalityName: "This Field is Required" };
  }

  return err
}
export const RoomTypeValidation = (payloadRoom)=>{
  let err=""
  if (payloadRoom?.RoomName == "") {
    err = { ...err, RoomName: "This Field is Required" };
  }
  if (payloadRoom?.RoomType == "") {
    err = { ...err, RoomType: "This Field is Required" };
  }

  return err
}
export const RoomMapValidation = (payloadMap)=>{
  let err=""
  if (payloadMap?.RoomId == "") {
    err = { ...err, RoomId: "This Field is Required" };
  }
  if (payloadMap?.GroupId == "") {
    err = { ...err, GroupId: "This Field is Required" };
  }

  return err
}
export const TimeSlotValidation = (payload)=>{
  let err=""
  if (payload?.ModalityId == "") {
    err = { ...err, ModalityId: "This Field is Required" };
  }
  if (payload?.ShiftId == "") {
    err = { ...err, ShiftId: "This Field is Required" };
  }
  if (payload?.CentreId == "") {
    err = { ...err, CentreId: "This Field is Required" };
  }
  if (payload?.DurationforPatient == "") {
    err = { ...err, DurationforPatient: "This Field is Required" };
  }

  return err
}
export const TokenGenerationMasterValidations = (formData)=>{
  let err=""
  if (formData?.DepartmentId == "") {
    err = { ...err, DepartmentId: "This Field is Required" };
  }
  if (formData?.ModalityId == "") {
    err = { ...err, ModalityId: "This Field is Required" };
  } if (formData?.GroupName == "") {
    err = { ...err, GroupName: "This Field is Required" };
  }
  if (formData?.Sequence == "") {
    err = { ...err, Sequence: "This Field is Required" };
  }

  return err
}
export const validationForAgeWise = (formData) => {
  let err = "";
  if (formData?.DiscountType.trim() === "") {
    err = { ...err, DiscountType: "This Field is Required" };
  }
  // if (formData?.FromAge > formData?.ToAge ) {
  //   err = { ...err,FromAgeCheck : "FromAge is greater" };
  // }
  // if (formData?.FromAge < formData?.ToAge) {
  //   err = { ...err, ToAgeCheck: "ToAge is greater" };
  // }
  if (["", "0"].includes(formData?.DiscountPer)) {
    err = { ...err, DiscountPer: "This Field is Required" };
  } else if (formData?.DiscountPer > 100) {
    err = { ...err, DiscountPer: "Enter Valid Discount" };
  }

  if (formData?.FromAge === "") {
    err = { ...err, FromAge: "This Field is Required" };
  } else if (formData?.FromAge > 110) {
    err = { ...err, FromAge: "Enter Valid Age" };
  }

  if (
    moment(formData?.FromDate).format("DD-MM-YYYY") >
    moment(formData?.ToDate).format("DD-MM-YYYY")
  ) {
    err = { ...err, ToDateCheck: "Invalid Date" };
  }

  if (formData?.ToAge === "") {
    err = { ...err, ToAge: "This Field is Required" };
  } else if (formData?.ToAge > 110) {
    err = { ...err, ToAge: "Enter Valid Age" };
  } else if (formData?.ToAge == 0) {
    err = { ...err, ToAge: " Should not be 0" };
  } else if (formData?.ToAge < formData?.FromAge) {
    err = { ...err, ToAge: " Must be equal or greater than FromAge" };
  }

  if (formData?.Gender === "") {
    err = { ...err, Gender: "Gender is Required" };
  }

  if (formData?.DiscountShareType === "") {
    err = { ...err, DiscountShareType: "DiscountShareType is Required" };
  }

  return err;
};

export const validationForMachineMaster = (payload) => {
  let err = "";
  if (payload?.MachineID.trim() === "") {
    err = { ...err, MachineID: "This Field is Required" };
  }
  if (payload?.MachineName === "") {
    err = { ...err, MachineName: "This Field is Required" };
  }

  if (payload?.CentreID === "") {
    err = { ...err, CentreID: "Centre ID is Required" };
  }

  if (payload?.GlobalMachineID === "") {
    err = { ...err, GlobalMachineID: "Global Machine ID is Required" };
  }
  if (payload?.ITDKEY === "") {
    err = { ...err, ITDKEY: "This Field is Required" };
  }

  return err;
};


export const CampRequestSchema = (formData) => {
  let err = "";
  if (formData?.CampName=== "") {
    err = { ...err, CampName: "This Field is Required" };
  }
  if (formData?.center=== "") {
    err = { ...err, Campcenter: "This Field is Required" };
  }
  if (formData?.campType === "") {
    err = { ...err, Camptype: "This Field is Required" };
  }
  
  return err;
};
export const validateIssue = (formData, type, error) => {
  let err = error ?? "";
  if (formData?.cardid === "" && (type === "cardid" || type === "All")) {
    err = { ...err, cardid: "This feild is Required" };
  }

  if (formData?.PatientData?.DOB === "" && (type === "DOB" || type === "All")) {
    err = { ...err, DOB: "Select from Item" };
  }

  if (
    formData?.PatientData?.Mobile === "" &&
    (type === "Mobile" || type === "All")
  ) {
    err = { ...err, Mobile: "This Field is Required" };
  } else if (
    formData?.PatientData?.Mobile.length !== 10 &&
    (type === "Mobile" || type === "All")
  ) {
    err = { ...err, Mobilelen: "Invalid!.. 10 Digits Required" };
  }

  if (
    formData?.PatientData?.PName === "" &&
    (type === "PName" || type === "All")
  ) {
    err = { ...err, PName: "This Field is Required" };
  } else if (
    formData?.PatientData?.PName !== "" &&
    formData?.PatientData?.PName.length <=2 &&
    (type === "PName" || type === "All")
  ) {
    err = { ...err, PNamelength: "This Field is Required" };
  }

  return err;
};