import React from "react";
import Approvals from "./Approvals";
import Index from "./Index";
import Subordinates from "./Subordinates";

const ManagerRoutes = [
  {
    path: "/manager/approvals",
    element: <Approvals />,
  },
  {
    path: "/manager/",
    element: <Index />,
  },
  {
    path: "/manager/subordinates",
    element: <Subordinates />,
  },
];

export default ManagerRoutes;