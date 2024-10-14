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
export const Status = [
  {
    label: "Pending",
    value: "0",
  },
  {
    label: "Approval",
    value: "1",
  },
];
export const SearchByCulture = [
  { label: "Select", value: "" },
  { label: "BarcodeNo", value: "pli.BarcodeNo" },
  { label: "Mobile", value: "pm.mobile" },
  { label: "PatientCode", value: "lt.PatientCode" },
  { label: "PatientName", value: "lt.PName" },
  { label: "VisitNo", value: "pli.LedgertransactionNo" },
];
export const ReportTypePreliminary = [
  { label: "Preliminary 1", value: "Preliminary 1" },
  { label: "Preliminary 2", value: "Preliminary 2" },
  { label: "Preliminary 3", value: "Preliminary 3" },
  { label: "Final Report", value: "Final Report" },
];
export const PayBy = [
  {
    label: "Patient",
    value: 0,
  },
  {
    label: "Corporate",
    value: 1,
  },
];
export const AgainstInvoice = [
  {
    label: "Select Invoice Type",
    value: "",
  },
  {
    label: "Against Invoice",
    value: 1,
  },
  {
    label: "Against Advance",
    value: 2,
  },
];

export const BillingCycle = [
  {
    label: "Weekly",
    value: "Weekly",
  },
  {
    label: "15 Days",
    value: "15 Days",
  },
  {
    label: "Monthly",
    value: "Monthly",
  },
];
export const GraceTime = [
  {
    label: "select GraceTime in Days",
    value: "",
  },
  {
    label: 1,
    value: 1,
  },
  {
    label: 2,
    value: 2,
  },
  {
    label: 3,
    value: 3,
  },
  {
    label: 4,
    value: 4,
  },
  {
    label: 5,
    value: 5,
  },
  {
    label: 6,
    value: 6,
  },
  {
    label: 7,
    value: 7,
  },
];
export const PaymentMode = [
  {
    label: "Cash",
    value: "Cash",
  },
  {
    label: "Credit",
    value: "Credit",
  },
];
export const DataType = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Package",
    value: "Package",
  },
  {
    label: "Profile",
    value: "Profile",
  },
  {
    label: "Test",
    value: "Test",
  },
];
export const ReportTypeNew = [
  {
    label: "Select",
    value: "",
  },
  {
    label: "Numeric",
    value: "1",
  },
  {
    label: "Memo",
    value: "2",
  },
  {
    label: "Ms-Word",
    value: "3",
  },
];
export const SampleOption = [
  {
    label: "Sample Not Required",
    value: "Sample Not Required",
  },
  {
    label: "Sample Required",
    value: "Sample Required",
  },
];

export const InestigationRange = {
  InvestigationID: "",
  LabObservationID: "",
  Gender: "",
  FromAge: "",
  ToAge: "",
  MinReading: "",
  MaxReading: "",
  DisplayReading: "",
  DefaultReading: "",
  MinCritical: "",
  MaxCritical: "",
  ReadingFormat: "",
  Interpretation: "",
  MacID: "",
  MethodName: "",
  ShowMethod: "",
  CentreID: "",
  AbnormalValue: "",
  RangeType: "",
  AutoApprovedMin: "",
  AutoApprovedMax: "",
  AMRMin: "",
  AMRMax: "",
  ReflexMin: 0,
  ReflexMax: 0,
  RoundOff: 0,
  DlcCheck: "",
  isActive: 1,
};

export const RoundOff = [
  {
    label: -1,
    value: -1,
  },
  {
    label: 0,
    value: 0,
  },
  {
    label: 1,
    value: 1,
  },
  {
    label: 2,
    value: 2,
  },
  {
    label: 3,
    value: 3,
  },
  {
    label: 4,
    value: 4,
  },
];