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
      }, {
        path: "/CentreTypeMaster",
        element: "../Frontend/Master/CentreTypeMaster",
      },{
        path: "/CentrePanel",
        element: "../Frontend/Master/CentrePanel",
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
