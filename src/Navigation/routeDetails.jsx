export let routeDetails = [
  {
    path: "/",
    element: "../App",
    children: [
      {
        index: true,
        element: "../Frontend/DashBoard/DashBoard",
      },
      {
        path: "/dashboard",
        element: "../Frontend/DashBoard/DashBoard",
      },
      {
        path: "/FirstPage",
        element: "../Frontend/Page/FirstPage",
      },
      {
        path: "/PatientRegister",
        element: "../Frontend/Laboratory/PatientRegistration",
      },
      {
        path: "/SampleCollection",
        element: "../Frontend/Laboratory/SampleCollection",
      },
      {
        path: "/DepartmentReceive",
        element: "../Frontend/Laboratory/DepartmentReceive",
      },
      {
        path: "/DispatchReport",
        element: "../Frontend/Laboratory/DispatchReport",
      },
      {
        path: "/ResultEntry",
        element: "../Frontend/Laboratory/ResultEntry",
      },
      {
        path: "/ReceiptReprint",
        element: "../Frontend/Laboratory/ReceiptReprint",
      },
      {
        path: "/EditPatientInfo",
        element: "../Frontend/Laboratory/EditPatientInfo",
      },
      {
        path: "/EditPatientDetails",
        element: "../Frontend/Laboratory/EditPatientDetails",
      },
      {
        path: "/DynamicLabSearch",
        element: "../Frontend/Laboratory/DynamicLabSearch",
      },
      {
        path: "/SendSampleToLab",
        element: "../Frontend/Laboratory/SendSampleToLab",
      },
      {
        path: "/ResultCulture",
        element: "../Frontend/Laboratory/ResultEntryCulture",
      },
      {
        path: "/BulkSettlement",
        element: "../Frontend/Laboratory/BulkSettlement",
      },
      {
        path: "/BulkActivity",
        element: "../Frontend/Laboratory/BulkActivity",
      },
      {
        path: "/MicroLabEntry",
        element: "../Frontend/Laboratory/MicroLabEntry",
      },
      {
        path: "/PrintBarcode",
        element: "../Frontend/Laboratory/PrintBarcode",
      },
      {
        path: "/BulkRegistration",
        element: "../Frontend/Laboratory/BulkRegistration",
      },
      {
        path: "/SingleBulkPanelChange",
        element: "../Frontend/Laboratory/SingleBulkPanelChange",
      },
      {
        path: "/DoctorReferal",
        element: "../Frontend/Master/DoctorMaster",
      },
      {
        path: "/CreateDoctorReferal",
        element: "../Frontend/Master/CreateDoctorMaster",
      },
      {
        path: "/GlobalTypeMaster",
        element: "../Frontend/Master/GlobalTypeMaster",
      },
      {
        path: "/ViewGlobalMaster",
        element: "../Frontend/Master/ViewGlobalMaster",
      },
      {
        path: "/CentreTypeMaster",
        element: "../Frontend/Master/CentreTypeMaster",
      },
      {
        path: "/CentrePanel",
        element: "../Frontend/Master/CentrePanel",
      },
      {
        path: "/Departments",
        element: "../Frontend/Master/Department",
      },
      {
        path: "/MenuMaster",
        element: "../Frontend/Master/MenuMaster",
      },
      {
        path: "/PageMaster",
        element: "../Frontend/Master/PageMaster",
      },
      {
        path: "/SubPageMaster",
        element: "../Frontend/Master/SubPageMaster",
      },
      {
        path: "/SampleType",
        element: "../Frontend/Master/SampleTypeCreate",
      },
      {
        path: "/CentreMaster/:name",
        element: "../Frontend/Master/CentreMaster",
      },
      {
        path: "/CentreMasterList/:name",
        element: "../Frontend/Master/CentreMasterList",
      },
      {
        path: "/Investigations",
        element: "../Frontend/Master/Investigations",
      },
      {
        path: "/InvestigationsList",
        element: "../Frontend/Master/InvestigationsList",
      },
      {
        path: "/InvestigationRange",
        element: "../Frontend/Master/InvestigationRange",
      },
      {
        path: "/InvestigationsInterpretion",
        element: "../Frontend/Master/InvestigationsInterpretion",
      },
      {
        path: "/RequiredFields",
        element: "../Frontend/Master/InvestigationsRequiredField",
      },
      {
        path: "/HelpMenu",
        element: "../Frontend/Master/InvestigationsHelpMenu",
      },
      {
        path: "/EmployeeMaster",
        element: "../Frontend/Master/EmployeeMaster",
      },
      {
        path: "/CreateEmployeeMaster",
        element: "../Frontend/Master/CreateEmployeeMaster",
      },
      {
        path: "/ChangeDeliveryStatus",
        element: "../Frontend/Laboratory/ChangeDeliveryStatus",
      },
      {
        path: "/Designations",
        element: "../Frontend/Master/Designations",
      },
      {
        path: "/DesignationsCreate",
        element: "../Frontend/Master/DesignationsCreate",
      },
      {
        path: "/InvestigationCommentMaster",
        element: "../Frontend/Master/InvestigationCommentMaster",
      },
      {
        path: "/InvestigationCommentMasterList",
        element: "../Frontend/Master/InvestigationCommentMasterList",
      },
      {
        path: "/LedgerStatusAsOnDate",
        element: "../Frontend/Invoicing/LedgerStatusAsOnDate",
      },
      {
        path: "/LedgerTransaction",
        element: "../Frontend/Invoicing/LedgerTransaction",
      },
      {
        path: "/LedgerStatement",
        element: "../Frontend/Invoicing/LedgerStatement",
      },
      {
        path: "/LedgerReport",
        element: "../Frontend/Invoicing/LedgerReport",
      },
      {
        path: "/InvoiceReprint",
        element: "../Frontend/Invoicing/InvoiceReprint",
      },
      {
        path: "/InvoiceCancel",
        element: "../Frontend/Invoicing/InvoiceCancel",
      },
      {
        path: "/InvoiceCreation",
        element: "../Frontend/Invoicing/InvoiceCreation",
      },
      {
        path: "/AdvancePayment",
        element: "../Frontend/Invoicing/AdvancePayment",
      },
      {
        path: "/ValidatePayment",
        element: "../Frontend/Invoicing/ValidatePayment",
      },
      {
        path: "/getReport/:id",
        element: "../Frontend/Reports/Report",
      },
      {
        path: "/OutSourceLabMaster",
        element: "../Frontend/Master/OutSourceLabMaster",
      },
      {
        path: "/CenterAccess",
        element: "../Frontend/Master/CenterAccess",
      },
      {
        path: "/FieldBoyMaster",
        element: "../Frontend/Master/FieldBoyMaster",
      },
      {
        path: "/CreateFieldBoyMaster",
        element: "../Frontend/Master/CreateFieldBoyMaster",
      },
      {
        path: "/ImportExportExcel",
        element: "../Frontend/Master/ImportExportExcel",
      },
      {
        path: "/RateList",
        element: "../Frontend/Master/RateList",
      },
      {
        path: "/ManageFieldMaster",
        element: "../Frontend/Master/ManageFieldMaster",
      },
      {
        path: "/RateTypeShareMaster",
        element: "../Frontend/Master/RateTypeShareMaster",
      },
      {
        path: "/Rate/:id",
        element: "../Frontend/Master/RateTypeCopyShare",
      },
      {
        path: "/FormulaMaster",
        element: "../Frontend/Master/FormulaMaster",
      },
      {
        path: "/InvalidContactNumber",
        element: "../Frontend/Master/InvalidContactNumber",
      },
      {
        path: "/MicroBiologyMaster",
        element: "../Frontend/Master/MicroBiologyMaster",
      },
      {
        path: "/MicroBiologyMasterMapping",
        element: "../Frontend/Master/MicroBiologyMasterMapping",
      },
      {
        path: "/ManageOrdering",
        element: "../Frontend/Master/ManageOrdering",
      },
      {
        path: "/TestMappingCenter",
        element: "../Frontend/Master/TestCentreMapping",
      },
      // {
      //   path: "/Settlement",
      //   element: "../Frontend/Administrator/SettlementPatient",
      // },
      // {
      //   path: "/DiscountMasterEmployeeWise",
      //   element: "../Frontend/Administrator/DiscountMasterEmployeeWise",
      // },
      {
        path: "/OutSourceTagging",
        element: "../Frontend/Master/OutSourceTagging",
      },
      {
        path: "/OutSourceTestMaster",
        element: "../Frontend/Master/OutSourceTestMaster",
      },
      {
        path: "/OutSourceTestToOtherLab",
        element: "../Frontend/Master/OutSourceTestToOtherLab",
      },
      {
        path: "/IDMaster",
        element: "../Frontend/Master/IDMaster",
      },
      // {
      //   path: "/ChangePaymentMode",
      //   element: "../Frontend/Administrator/ChangePaymentMode",
      // },
      {
        path: "/ChangePassword",
        element: "../Frontend/Master/ChangePassword",
      },
      // {
      //   path: "/ChangeSampleStatus",
      //   element: "../Frontend/Administrator/ChangeSampleStatus",
      // },
      // {
      //   path: "/ChangeBarCode",
      //   element: "../Frontend/Administrator/ChangeBarCode",
      // },
      // {
      //   path: "/DiscountApproval",
      //   element: "../Frontend/Administrator/DiscountApproval",
      // },
      {
        path: "/ManageHoliday",
        element: "../Frontend/Master/ManageHoliday",
      },
      // {
      //   path: "/RevertDiscountApprovalStatus",
      //   element: "../Frontend/Administrator/RevertDiscountApprovalStatus",
      // },
      {
        path: "/AgeWiseDiscount",
        element: "../Frontend/Master/AgeWiseDiscount",
      },
      {
        path: "/AgeWiseDiscountList",
        element: "../Frontend/Master/AgeWiseDiscountList",
      },
      // {
      //   path: "/DiscountAfterBill",
      //   element: "../Frontend/Administrator/DiscountAfterBill",
      // },
      // {
      //   path: "/RefundAfterBill",
      //   element: "../Frontend/Administrator/RefundAfterBill",
      // },
      {
        path: "/MacData",
        element: "../Frontend/Master/MacData",
      },
      {
        path: "/MacObservation",
        element: "../Frontend/Master/MacObservation",
      },
      {
        path: "/CriticalCalloutRecord",
        element: "../Frontend/Master/CriticalCalloutRecord",
      },
      {
        path: "/CancelReceipt",
        element: "../Frontend/Master/CancelReceipt",
      },
      {
        path: "/CompanyPaymentDetail",
        element: "../Frontend/CompanyMaster/CompanyPaymentDetail",
      },
      // {
      //   path: "/setDoctor",
      //   element: "../Frontend/Master/SetDoctorShare",
      // },
      // {
      //   path: "/MergeDoctor",
      //   element: "../Frontend/Master/MergeDoctor",
      // },
      // {
      //   path: "/DoctorMisReportPage",
      //   element: "../Frontend/Master/DoctorMisReportPage",
      // },
      // {
      //   path: "/DoctorShareMaster",
      //   element: "../Frontend/Master/DoctorShareMaster",
      // },
      // {
      //   path: "/DoctorTypeCopyShare",
      //   element: "../Frontend/Master/DoctorTypeCopyShare",
      // },
      {
        path: "/MachineMaster",
        element: "../Frontend/Machine/MachineMaster",
      },
      // {
      //   path: "/CompanyKey",
      //   element: "../Frontend/CompanyMaster/CompanyKey",
      // },
      // {
      //   path: "/OnlinePaymentPage",
      //   element: "../Frontend/CompanyMaster/OnlinePaymentPage",
      // },
      {
        path: "/CompanyMaster",
        element: "../Frontend/CompanyMaster/CompanyMaster",
      },
      {
        path: "/CompanyMasterList",
        element: "../Frontend/CompanyMaster/CompanyMasterList",
      },
      {
        path: "/LoadData",
        element: "../Frontend/Master/LoadData",
      },
      {
        path: "/MachineGroup",
        element: "../Frontend/Machine/MachineGroup",
      },
      {
        path: "/MachineReading",
        element: "../Frontend/Machine/MachineReading",
      },
      {
        path: "/MachineParams",
        element: "../Frontend/Machine/MachineParams",
      },
      {
        path: "/BreakpointPage",
        element: "../Frontend/Master/BreakpointPage",
      },
      {
        path: "/MachineReferenceRangeMaster",
        element: "../Frontend/Master/MachineReferenceRangeMaster",
      },
      // {
      //   path: "/ModalityMaster",
      //   element: "../Frontend/Radiology/ModalityMaster",
      // },
      // {
      //   path: "/TokenGenerationMaster",
      //   element: "../Frontend/Radiology/TokenGenerationMaster",
      // },
      // {
      //   path: "/ScRoomMaster",
      //   element: "../Frontend/Radiology/ScRoomMaster",
      // },
      // {
      //   path: "/InvestigationTimeSlotMaster",
      //   element: "../Frontend/Radiology/InvestigationTimeSlotMaster",
      // },
      {
        path: "/ReportBill",
        element: "../Frontend/Reports/ReportBill",
      },
      // {
      //   path: "/MembershipCardMaster",
      //   element: "../Frontend/MembershipCard/MembershipCardMaster",
      // },
      // {
      //   path: "/MembershipCardItemMapping",
      //   element: "../Frontend/MembershipCard/MembershipCardItemMapping",
      // },
      // {
      //   path: "/MembershipCardIssue",
      //   element: "../Frontend/MembershipCard/MembershipCardIssue",
      // },
      // {
      //   path: "/MembershipCardSearch",
      //   element: "../Frontend/MembershipCard/MembershipCardSearch",
      // },
      // {
      //   path: "/MemberShipCardEdit",
      //   element: "../Frontend/MembershipCard/MemberShipCardEdit",
      // },
      {
        path: "/CampConfigurationMaster",
        element: "../Frontend/Camp/CampConfigurationMaster",
      },
      {
        path: "/CampConfigurationApproval",
        element: "../Frontend/Camp/CampConfigurationApproval",
      },
      {
        path: "/CampCreationMaster",
        element: "../Frontend/Camp/CampCreationMaster",
      },
      {
        path: "/CampRequest",
        element: "../Frontend/Camp/CampRequest",
      },
      {
        path: "/WelcomePage",
        element: "../Frontend/Extra/WelcomePage",
      },
      {
        path: "/CampReject",
        element: "../Frontend/Camp/CampReject",
      },
      {
        path: "/CampApprovalRightMaster",
        element: "../Frontend/Camp/CampApprovalRightMaster",
      },
      {
        path: "/CampCreationSearch",
        element: "../Frontend/Camp/CampCreationSearch",
      },
      {
        path: "/CampRequestApproval",
        element: "../Frontend/Camp/CampRequestApproval",
      },
      {
        path: "/ImportExportInvestigations",
        element: "../Frontend/Master/ImportExportInvestigations",
      },
      {
        path: "/ExportInvInterpretation",
        element: "../Frontend/Master/ExportInvInterpretation",
      },
      { path: "*", element: "../Frontend/Extra/BlankPage" },
    ],
  },
  {
    path: "/login",
    element: "../Frontend/login/Login",
  },
  {
    path: "/ForgetPassword",
    element: "../Frontend/login/ForgetPassword",
  },
];
