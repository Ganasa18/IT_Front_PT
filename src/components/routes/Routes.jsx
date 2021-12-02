import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import Status from "../pages/Status";
import Roles from "../pages/Roles";
import Area from "../pages/Area";
import Departement from "../pages/Departement";
// import NotFound from "../pages/NotFound";
import User from "../pages/User";

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
    </Switch>
  );
};

export default Routes;
