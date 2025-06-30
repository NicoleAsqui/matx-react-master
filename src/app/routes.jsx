import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";
import materialRoutes from "app/views/material-kit/MaterialRoutes";

// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
// DASHBOARD PAGE
const Inventory = Loadable(lazy(() => import("app/views/inventory/AppInventory")));
const NewInventory = Loadable(lazy(() => import("app/views/inventory/NewInventory")));
const EditInventory = Loadable(lazy(() => import("app/views/inventory/EditInventory")));
const NewMovements = Loadable(lazy(() => import("app/views/movements/NewMovements")));
const EditMovements = Loadable(lazy(() => import("app/views/movements/EditMovements")));
const Movements = Loadable(lazy(() => import("app/views/movements/AppMovements")));
const Alerts = Loadable(lazy(() => import("app/views/alerts/AppAlerts")));

const routes = [
  { path: "/", element: <Navigate to="inventory" /> },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      // e-chart route
      { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor },
      // inventory route
      { path: "/inventory", element: <Inventory />, auth: authRoles.editor },
      { path: "/inventory/new", element: <NewInventory />, auth: authRoles.editor },
      { path: "/inventory/edit/:id", element: <EditInventory />, auth: authRoles.editor },
      // movements route
      { path: "/movements", element: <Movements />, auth: authRoles.editor },
      { path: "/movements/new", element: <NewMovements />, auth: authRoles.editor },
      { path: "/movements/edit/:id", element: <EditMovements />, auth: authRoles.editor },
      // alerts route
      { path: "/alerts", element: <Alerts />, auth: authRoles.editor }
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
