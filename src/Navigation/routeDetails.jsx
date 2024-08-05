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
  {
    path: "/FirstPage",
    element: "../Frontend/Page/FirstPage",
  },
];
