import App from "../App";



export let routeDetails = [    
    {
      path: "/",
      element: "../App",
    },
    {
      path: "/login",
      element: "../Frontend/login/Login",
    },
    {
      path: "/ForgetPassword",
      element: "../Frontend/login/ForgetPassword",
    },
    // {
    //   type: "content",
    //   path: "/content",
    //   element: "../App",
    //   children: [
    //     { index: true, element: "../apps/Calculator" },
    //     { path: "calculator", element: "../apps/Calculator", type: "app" },
    //     { path: "todo", element: "../apps/Todo/Main", type: "app" },
    //   ],
    // },
    // {
    //   path: "/delay",
    //   element: "../apps/DelayComp",
    // },
  ];
  