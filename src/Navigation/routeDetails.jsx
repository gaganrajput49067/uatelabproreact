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
        path: "dashboard",
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
        element: "../Frontend/Master/SubPageMaster"
      },
      {
        path: "/SampleTypeCreate",
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
      { path: "*", element: "../components/NotFound" },
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
