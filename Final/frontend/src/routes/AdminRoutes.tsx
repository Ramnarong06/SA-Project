import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-party/Loadable";
import FullLayout from "../layout/FullLayout";


const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
//const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));
const Employee = Loadable(lazy(() => import("../pages/individual/employee")));
const CreateEmployee = Loadable(lazy(() => import("../pages/individual/employee/create")));
const EditEmployee = Loadable(lazy(() => import("../pages/individual/employee/edit")));

const Patient = Loadable(lazy(() => import("../pages/individual/patient")));
const CreatePatient = Loadable(lazy(() => import("../pages/individual/patient/create")));
const EditPatient = Loadable(lazy(() => import("../pages/individual/patient/edit")));

const ViewSchedule = Loadable(lazy(() => import("../pages/schedule/view/view")));
const ScheduleCreate = Loadable(lazy(() => import("../pages/schedule/create/create")));
const ScheduleEdit = Loadable(lazy(() => import("../pages/schedule/edit/edit")));

const AdminRoutes = (isLoggedIn : boolean): RouteObject => {
  return {
    path: "/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      {
        path: "/",
        element: <MainPages />,
        //element: <div>test</div>,

      },
      {
        path: "/patient",
        children: [
          {
            path: "",
            element: <Patient />,
          },
          {
            path: "create",
            element: <CreatePatient />,
          },
          {
            path: "edit/:id",
            element: <EditPatient />,
          },
        ],
      },
      {
        path: "/employee",
        children: [
          {
            path: "employee",
            element: <Employee/>,
          },
          {
            path: "create",
            element: <CreateEmployee />,
          },
          {
            path: "edit/:id",
            element: <EditEmployee />,
          },
        ],
      },

      {
        path: "/viewschedule",
        children: [
          {
            path: "schedulecreate",
            element: <ScheduleCreate />,
          },
          {
            path: "editschedule/edit/:id",
            element: <ScheduleEdit />,
          },
        ],
      },

     
      

      
    ],
  };
};

export default AdminRoutes