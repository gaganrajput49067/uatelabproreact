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
        path: "/DoctorReferal",
        element: "../Frontend/Master/DoctorMaster",
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
      },{
        path: "/SampleTypeCreate",
        element: "../Frontend/Master/SampleTypeCreate",
      },
      {
        path: "/getReport/:id",
        element: "../Frontend/Reports/Report",
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
