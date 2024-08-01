import { createBrowserRouter } from "react-router-dom";
import { routeDetails } from "./routeDetails";
import { lazy, Suspense } from "react";
import Loading from "../components/Loading/Loading";
import ErrorPage from "../Frontend/Extra/ErrorPage";

function getRouterDetails(data) {
  return data.map((ele) => {
    const LazyElement = lazy(() => import(/* @vite-ignore */ `${ele.element}`));
    if (ele.index) {
      return {
        index: ele.index,
        element: (
          <Suspense fallback={<Loading />}>
            <LazyElement />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      };
    }
    return {
      path: ele.path,
      element: (
        <Suspense fallback={<Loading />}>
          <LazyElement />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
      children: ele.children ? getRouterDetails(ele.children) : [],
    };
  });
}

export const router = createBrowserRouter(getRouterDetails(routeDetails));
