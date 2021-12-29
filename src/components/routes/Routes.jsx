import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "../pages/Home";
import Status from "../pages/Status";
import Roles from "../pages/Roles";
import Area from "../pages/Area";
import Departement from "../pages/Departement";
import NotFound from "../pages/NotFound";
import User from "../pages/User";
import UserAsset from "../pages/UserAsset";
import Category from "../pages/Category";
import Profile from "../pages/Profile";
import ActionReq from "../pages/user/ActionReq";
import ActionReqDetail from "../pages/user/ActionReqDetail";
import Troubleshoot from "../pages/Troubleshoot";
import ActionApproved from "../pages/lead/ActionApproved";
import ActionApproveDetail from "../pages/lead/ActionApproveDetail";
import ActionTicket from "../pages/ticket/ActionTicket";
import ActionReqTicketDetail from "../pages/ticket/ActionReqTicketDetail";
import Inventory from "../pages/Inventory";

import Cookies from "universal-cookie";
const cookies = new Cookies();
const roleUser = cookies.get("role");

// const ProtectRoute = () => {
//   return()
// }

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={(props) => <Home {...props} />} />

      <Route
        path="/master/status"
        component={(props) =>
          parseInt(roleUser) === 1 ? (
            <Status {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: "Cannot Access",
              }}
            />
          )
        }
      />
      <Route
        path="/master/departement"
        component={(props) =>
          parseInt(roleUser) === 1 ? (
            <Departement {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
      <Route
        path="/master/area"
        component={(props) =>
          parseInt(roleUser) === 1 ? <Area {...props} /> : <Redirect to="/" />
        }
      />
      <Route
        path="/master/role"
        component={(props) =>
          parseInt(roleUser) === 1 ? <Roles {...props} /> : <Redirect to="/" />
        }
      />
      <Route
        path="/master/user"
        component={(props) =>
          parseInt(roleUser) === 1 ? <User {...props} /> : <Redirect to="/" />
        }
      />
      <Route
        path="/user/asset"
        component={(props) =>
          parseInt(roleUser) === 1 ? (
            <UserAsset {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
      <Route
        path="/master/category"
        component={(props) =>
          parseInt(roleUser) === 1 ? (
            <Category {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />

      <Route
        path="/master/troubleshoot"
        component={(props) =>
          parseInt(roleUser) === 1 ? (
            <Troubleshoot {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />

      <Route
        path="/inventory"
        component={(props) =>
          parseInt(roleUser) === 1 ? (
            <Inventory {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />

      <Route path="/profile" component={(props) => <Profile {...props} />} />
      <Route
        exact
        path="/action-request"
        component={(props) => <ActionReq {...props} />}
      />
      <Route
        path="/action-request/detail"
        component={(props) => <ActionReqDetail {...props} />}
      />

      <Route
        exact
        path="/approval/action-request"
        component={(props) =>
          parseInt(roleUser) === 3 ? (
            <ActionApproved {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
      <Route
        path="/approval/action-request/detail"
        component={(props) =>
          parseInt(roleUser) === 3 ? (
            <ActionApproveDetail {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />

      <Route
        exact
        path="/ticket-admin/action-request"
        component={(props) =>
          parseInt(roleUser) === 1 ? (
            <ActionTicket {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />

      <Route
        path="/ticket-admin/action-request/detail"
        component={(props) =>
          parseInt(roleUser) === 1 ? (
            <ActionReqTicketDetail {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
