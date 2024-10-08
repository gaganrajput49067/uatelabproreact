export const stateIniti = {
  DOB: "",
  Age: "",
  AgeYear: "",
  AgeDays: "",
  AgeMonth: "",
  RateID: 2,
  TotalAgeInDays: "",
  Title: "Mr.",
  FirstName: "",
  LastName: "",
  MiddleName: "",
  CentreID: "",
  Mobile: "",
  PinCode: "",
  State: "",
  Country: "",
  Email: "",
  City: "",
  HouseNo: "",
  StreetName: "",
  Locality: "",
  Phone: "",
  Gender: "Male",
  isVIP: 0,
  IsMask: 0,
  PatientCode: "",
  PageName: "PatientRegistration",
  BarcodeNo: "",
  ProEmployee: "",
};
export const LTDataIniti = {
  TypeOfTnx: "OPD-LAB",
  NetAmount: "",
  GrossAmount: "",
  Date: "",
  DiscountOnTotal: "",
  IsCredit: 0,
  PName: "",
  Age: "",
  Gender: "",
  VIP: "0",
  LedgerTransactionIDHash: "",
  DiscountReason: "",
  DiscountApprovedBy: "",
  Remarks: "",
  Guid: "",
  ReferRate: "1",
  CentreName: "",
  DiscountType: 1,
  DoctorID: "1",
  DoctorName: "Self",
  SecondReferDoctor: "",
  DoctorMobile: "",
  DoctorEmail: "",
  ReferLabId: "",
  ReferLabName: "",
  ReferLab: 0,
  OtherReferLab: "",
  CardNo: "",
  CentreID: "",
  RateTypeId: "",
  Adjustment: "",
  AdjustmentDate: "",
  isDocumentUploaded: 0,
  PatientIDProof: "",
  PatientIDProofNo: "",
  PatientSource: "",
  PatientType: "",
  VisitType: 1,
  HLMPatientType: "OPD",
  HLMOPDIPDNo: "",
  reVisit: 0,
  HLMUHID: "",
  Source: "",
  BedNo: "",
  isAllowPrint: 0,
  CollectionBoyId: "",
  ReportDeliveryMethodId: "",
  ReportDeliveryMethodDetail: "",
  MedicalHistoryCount: 0,
  UploadDocumentCount: 0,
  IsMedicalHistory: "",
  IsDocumentUploaded: "",
  RegistrationDate: new Date(),
  SrfId: "",
  IcmrId: "",
  IsConcern: "",
  HideAmount: "",
  DiscountId: "",
};
export const DISCOUNT_TYPE = [
  { label: "EmployeeWise", value: 1 },
  { label: "Discount Type Wise", value: 2 },
];
export const SampleStatusSearch = [
  {
    label: "Sample Not Collected",
    value: 1,
    status: true,
  },
  {
    label: "Collected",
    value: 2,
    status: true,
  },
  {
    label: "Received",
    value: 3,
    status: true,
  },
  {
    label: "Rejected",
    value: 4,
    status: true,
  },
];
export const SearchBy = [
  { label: "Select", value: "" },
  { label: "BarcodeNo", value: "BarcodeNo" },
  { label: "Mobile", value: "Mobile" },
  { label: "PatientCode", value: "PatientCode" },
  { label: "PatientName", value: "PatientName" },
  { label: "VisitNo", value: "VisitNo" },
];
export const NoOfPricks = [
  { label: "Select", value: "" },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
];
export const SampleSource = [
  {
    label: "Left Arm",
    value: "Left Arm",
  },
  {
    label: "Right Arm",
    value: "Right Arm",
  },
];

export const DateTypeSearch = [
  { label: "Registration Date", value: "Date" },
  { label: "Sample Collected Date", value: "SampleCollectionDate" },
  { label: "Department Receive Date", value: "DepartmentReceiveDate" },
];
export const SampleStatus = [
  // { label: " Serach", value: ""},
  { label: "Not Collected", value: "1", status: true },
  { label: "Collected", value: "2", status: true },
  { label: "Receive", value: "3", status: true },
  { label: "Rejected", value: "4", status: true },
  { label: "Result Done", value: "10", status: true },
  { label: "Approved", value: "5", status: true },
  { label: "Hold", value: "11", status: true },
  { label: "Re-Run", value: "14", status: true },
  { label: "Mac Data", value: "13", status: true },
  { label: "Dispatched", value: "15", status: true },
  { label: "Printed", value: "6", status: true },
  { label: "OutSource", value: "18", status: true },
  { label: "All", value: "", status: true },
];
export const ActiveDoctor = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "In-Active",
    value: "0",
  },
];
export const Flag = [
  { label: "Normal", value: "Normal" },
  { label: "Abnormal", value: "Abnormal" },
];

export const Order = [
  { label: "DESC", value: "DESC" },
  { label: "ASC", value: "ASC" },
];

export const StatusCheck = {
  10: "Save",
  5: "Approve",
  11: "Hold",
  6: "Approve",
};

export const workSheetSampleStatus = [
  { label: "All", value: "", status: true },
  { label: "Receive", value: "3", status: true },
  { label: "Rejected", value: " 4", status: true },
  { label: "Approved", value: "5", status: true },
];
