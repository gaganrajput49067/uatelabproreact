import { createBrowserRouter } from "react-router-dom";
import { routeDetails } from "./routeDetails";
import { lazy, Suspense } from "react";
import Loading from "../components/Loading/Loading";
import ErrorPage from "../Frontend/Extra/ErrorPage";
import PrivateRoute from "./PrivateRoute";

function getRouterDetails(data) {
  return data.map((ele) => {
    const LazyElement = lazy(() => import(/* @vite-ignore */ `${ele.element}`));
    const protectedRoute = (
      <Suspense fallback={<Loading />}>
        <PrivateRoute element={<LazyElement />} path={ele.path} />
      </Suspense>
    );

    if (ele.index) {
      return {
        index: ele.index,
        element: protectedRoute,
        errorElement: <ErrorPage />,
      };
    }

    return {
      path: ele.path,
      element:
        ele.path === "/login" || ele.path === "/ForgetPassword" ? (
          <Suspense fallback={<Loading />}>
            <LazyElement />
          </Suspense>
        ) : (
          protectedRoute
        ),
      errorElement: <ErrorPage />,
      children: ele.children ? getRouterDetails(ele.children) : [],
    };
  });
}

export const router = createBrowserRouter(getRouterDetails(routeDetails));
