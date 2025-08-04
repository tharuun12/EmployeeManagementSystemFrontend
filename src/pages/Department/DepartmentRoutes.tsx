import React from "react";
import Create from "./Create";
import Delete from "./Delete";
import Edit from "./Edit";
import Index from "./Index";

const DepartmentRoutes = [
  {
    path: "/department/create",
    element: <Create />,
  },
  {
    path: "/department/delete/:id",
    element: <Delete />,
  },
  {
    path: "/department/edit/:id",
    element: <Edit />,
  },
  {
    path: "/department/",
    element: <Index />,
  },
];

export default DepartmentRoutes;