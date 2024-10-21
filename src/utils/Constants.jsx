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
export const Theme = [
  {
    label: "Default",
    value: "",
    color: "#326fd1",
  },
  {
    label: "Grey",
    value: "grey",
    color: "#666866",
  },
  {
    label: "Brown",
    value: "brown",
    color: "#8b2424",
  },
  {
    label: "Blue",
    value: "blue",
    color: "#03a0e7",
  },
  {
    label: "Pale Pink",
    value: "palePink",
    color: "#f78e8e",
  },
  {
    label: "Peach",
    value: "peach",
    color: "#bc8f3c",
  },
  {
    label: "Green",
    value: "green",
    color: "#22d8a9",
  },
];

export const TypeData = [
  {
    label: "As On Date",
    value: "1",
  },
  {
    label: "From Date To Date ",
    value: "2",
  },
  {
    label: "Date Wise Trend (Closing Balance)",
    value: "3",
  },
];

export const RADIOADVANCEINPUT = [
  {
    value: "1",
    label: "Deposit",
  },
  {
    value: "2",
    label: "Credit Note",
  },
  {
    value: "3",
    label: "Debit Note",
  },
];
export const MicroBioMaster = [
  { label: "Organism", value: "2" },
  { label: "Antibiotic", value: "4" },
];
export const SelectType = [
  // {
  //   label: "Select",
  //   value: "Select",
  // },
  {
    label: "PrePaid",
    value: "PrePaid",
  },
  {
    label: "PostPaid",
    value: "PostPaid",
  },
];

export const NoofRecord = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
  { label: "40", value: "40" },
  { label: "50", value: "50" },
  { label: "60", value: "60" },
  { label: "70", value: "70" },
  { label: "80", value: "80" },
  { label: "90", value: "90" },
  { label: "100", value: "100" },
];
export const Showonly = [
  {
    label: "Synced Data",
    value: "1",
  },
  {
    label: "Pending Data",
    value: "0",
  },
];

export const Active = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "Deactive",
    value: "0",
  },
];
export const ActiveTemplateID = [{ label: "Active", value: "1" }];
export const DDLData = [
  {
    label: "",
    value: "",
  },
  {
    label: "PatientName",
    value: "PatientName",
  },
  {
    label: "Age",
    value: "Age",
  },
  {
    label: "Mobile",
    value: "Mobile",
  },
  {
    label: "Bill",
    value: "Bill",
  },
  {
    label: "Date",
    value: "Date",
  },
  {
    label: "Address",
    value: "Address",
  },
  {
    label: "Centre",
    value: "Centre",
  },
  {
    label: "PatientCode",
    value: "PatientCode",
  },
  {
    label: "ReferedBy",
    value: "ReferedBy",
  },
  {
    label: "VisitNo",
    value: "VisitNo",
  },
  {
    label: "CentreContactNo",
    value: "CentreContactNo",
  },
  {
    label: "CentreAddress",
    value: "CentreAddress",
  },
  {
    label: "CreatedBy",
    value: "CreatedBy",
  },
  {
    label: "Collector",
    value: "Collector",
  },
  {
    label: "Ph.",
    value: "Phone",
  },
  {
    label: "Mail",
    value: "Mail",
  },
  {
    label: "Web",
    value: "web",
  },
  {
    label: "company",
    value: "company",
  },
  {
    label: "Qrcode",
    value: "Qrcode",
  },
];
export const Dynamic = {
  Data: "",
  DynamicReportType: "Text",
  Height: "",
  ImageData: "undefined",
  IsActive: "1",
  PositionLeft: "",
  PositionTop: "",
  Text: "",
  fontSize: 10,
  TypePlaceHolder: "Header",
  Width: "",
};
export const DynamicReportType = [
  {
    label: "Text",
    value: "Text",
  },
  {
    label: "Data",
    value: "Data",
  },
  {
    label: "Barcode",
    value: "Barcode",
  },
  {
    label: "Image",
    value: "Image",
  },
  {
    label: "Line",
    value: "Line",
  },
  {
    label: "Box",
    value: "Box",
  },
  {
    label: "RoundBox",
    value: "RoundBox",
  },
  {
    label: "PrintDateTime",
    value: "PrintDateTime",
  },
  {
    label: "NoOfPages",
    value: "NoOfPages",
  },
  {
    label: "Provisional",
    value: "Provisional",
  },
  {
    label: "Qrcode",
    value: "Qrcode",
  },
];
export const FontFamily = [
  {
    label: "Arial",
    value: "Arial",
  },
  {
    label: "Times New Roman",
    value: "Times New Roman",
  },
  {
    label: "Calibri",
    value: "Calibri",
  },
  {
    label: "Verdana",
    value: "Verdana",
  },
];
export const LableID = [
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Patient NAME ",
    LabelID: "PatientName",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Age/Gender",
    LabelID: "Age",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Patient NAME ",
    LabelID: "PatientName",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Mobile No.",
    LabelID: "Mobile",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "DeliveryMode",
    LabelID: "Bill",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Reg. Date",
    LabelID: "Date",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Patient Address.",
    LabelID: "Address",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Panel Name ",
    LabelID: "Centre",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "PatientCode",
    LabelID: "PatientCode",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Refered By ",
    LabelID: "ReferedBy",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Lab No",
    LabelID: "VisitNo",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Centre Cont No",
    LabelID: "CentreContactNo",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "",
    LabelID: "CentreAddress",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "CreatedBy",
    LabelID: "CreatedBy",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "Collector",
    LabelID: "Collector",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "ICMRID",
    LabelID: "ICMRID",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
  {
    Bold: 1,
    DetailXPosition: "75",
    FontFamily: "",
    FontSize: "10",
    Italic: 1,
    LabelDetail: "SRFID",
    LabelID: "SRFID",
    Left: "8",
    Print: 1,
    Top: "90",
    Underline: 0,
  },
];
export const PageOrientation = [
  {
    label: "Portrait",
    value: "Portrait",
  },
  {
    label: "Landscape",
    value: "Landscape",
  },
];
export const PageSize = [
  {
    value: "A0",
    label: "A0",
  },

  {
    value: "A1",
    label: "A1",
  },

  {
    value: "A2",
    label: "A2",
  },

  {
    value: "A3",
    label: "A3",
  },

  {
    value: "A4",
    label: "A4",
  },

  {
    value: "A5",
    label: "A5",
  },

  {
    value: "A6",
    label: "A6",
  },

  {
    value: "A7",
    label: "A7",
  },

  {
    value: "A8",
    label: "A8",
  },

  {
    value: "A9",
    label: "A9",
  },

  {
    value: "A10",
    label: "A10",
  },

  {
    value: "B0",
    label: "B0",
  },

  {
    value: "B1",
    label: "B1",
  },

  {
    value: "B2",
    label: "B2",
  },

  {
    value: "B3",
    label: "B3",
  },

  {
    value: "B4",
    label: "B4",
  },

  {
    value: "B5",
    label: "B5",
  },
  {
    value: "ArchA",
    label: "ArchA",
  },
  {
    value: "ArchB",
    label: "ArchB",
  },
  {
    value: "ArchC",
    label: "ArchC",
  },
  {
    value: "ArchD",
    label: "ArchD",
  },
  {
    value: "ArchE",
    label: "ArchE",
  },

  {
    value: "Flsa",
    label: "Flsa",
  },
  { value: "HalfLetter", label: "HalfLetter" },
  { value: "Ledger", label: "Ledger" },
  { value: "Legal", label: "Legal" },
  { value: "Letter", label: "Letter" },
  { value: "Letter11x17", label: "Letter11x17" },
  { value: "Note", label: "Note" },
];
export const ReportType = [
  { label: "Lab Report", value: "Lab Report" },
  { label: "Bill", value: "Bill" },
  { label: "TRF", value: "TRF" },
  { label: "Department Slip", value: "Department Slip" },
];
export const TypePlaceHolder = [
  {
    label: "Header",
    value: "Header",
  },
  {
    label: "Page",
    value: "Page",
  },
  {
    label: "Footer",
    value: "Footer",
  },
];
export const RoundUpTo = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },

];

export const NoOfRecord = [
  {
    label: 5,
    value: Number(5),
  },
  {
    label: 10,
    value: Number(10),
  },
  {
    label: 20,
    value: Number(20),
  },
  {
    label: 50,
    value: Number(50),
  },
];


export const InvType = [
  {
    label: "Investigation",
    value: "Investigation",
  },
  {
    label: "InvestigationObservation",
    value: "InvestigationObservation",
  },

  {
    label: "InvestigationRange",
    value: "InvestigationRange",
  },
  {
    label: "InvestigationInterpretation",
    value: "InvestigationInterpretation",
  },
  {
    label: "InvestigationComment",
    value: "InvestigationComment",
  },
  {
    label: "InvestigationProfile",
    value: "InvestigationProfile",
  },
  {
    label: "InvestigationPackage",
    value: "InvestigationPackage",
  },
];
