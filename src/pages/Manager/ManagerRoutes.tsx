import React from "react";
import Index from "./Index";
import Subordinates from "./Subordinates";
// import Approvals from "./Approvals";

const ManagerRoutes = [
  // {
  //   path: "/manager/approvals",
  //   element: <Approvals />,
  // },
  {
    path: "/manager/profile",
    element: <Index />,
  },
  {
    path: "/manager/subordinates",
    element: <Subordinates />,
  },
];

export default ManagerRoutes;