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
        path: "/DoctorReferal",
        element: "../Frontend/Master/DoctorMaster",
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
