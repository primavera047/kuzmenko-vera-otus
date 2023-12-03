import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root, { loader as rootLoader, action as rootAction, } from "./routes/root";
import ErrorPage from "./error-page";
import City, {loader as cityLoader} from "./routes/city"
import EditCity, {action as cityEditAction} from "./routes/edit";
import {action as cityDeleteAction} from "./routes/delete"
import Index from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "city/:cityId",        
        element: <City />,
        loader: cityLoader,
        errorElement: <ErrorPage />,
      },
      ,
      {
        path: "city/:cityId/edit",
        element: <EditCity />,
        loader: cityLoader,
        action: cityEditAction,
        errorElement: <ErrorPage />,
      },
      {
        path: "city/:cityId/delete",
        action: cityDeleteAction,
        errorElement: <ErrorPage />,
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);