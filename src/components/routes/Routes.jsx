import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import Status from "../pages/Status";
import Roles from "../pages/Roles";
import Area from "../pages/Area";
import Departement from "../pages/Departement";
// import NotFound from "../pages/NotFound";
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

// import Cookies from "universal-cookie";

// // const cookies = new Cookies();
// // // const roleUser = cookies.get("role");

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={(props) => <Home {...props} />} />

      <Route
        path="/master/status"
        component={(props) => <Status {...props} />}
      />
      <Route
        path="/master/departement"
        component={(props) => <Departement {...props} />}
      />
      <Route path="/master/area" component={(props) => <Area {...props} />} />
      <Route path="/master/role" component={(props) => <Roles {...props} />} />
      <Route path="/master/user" component={(props) => <User {...props} />} />
      <Route
        path="/user/asset"
        component={(props) => <UserAsset {...props} />}
      />
      <Route
        path="/master/category"
        component={(props) => <Category {...props} />}
      />

      <Route
        path="/master/troubleshoot"
        component={(props) => <Troubleshoot {...props} />}
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
        component={(props) => <ActionApproved {...props} />}
      />
      <Route
        path="/approval/action-request/detail"
        component={(props) => <ActionApproveDetail {...props} />}
      />

      <Route
        exact
        path="/ticket-admin/action-request"
        component={(props) => <ActionTicket {...props} />}
      />

      <Route
        path="/ticket-admin/action-request/detail"
        component={(props) => <ActionReqTicketDetail {...props} />}
      />
    </Switch>
  );
};

export default Routes;
