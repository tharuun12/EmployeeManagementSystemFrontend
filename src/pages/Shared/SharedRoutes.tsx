import { RouteObject } from "react-router-dom";
import Unauthorized from "./Unauthorized"

const SharedRoutes: RouteObject[] = [
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
];

export default SharedRoutes;
