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
        path: "/PatientRegistration",
        element: "../Frontend/Laboratory/PatientRegistration",
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
