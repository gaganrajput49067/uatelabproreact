import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import store from "./store/store.jsx";
import { Provider } from "react-redux";
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';  
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <PrimeReactProvider>
    {/* <Provider store={store}> */}
      <App />
    {/* </Provider> */}
  </PrimeReactProvider>
);
