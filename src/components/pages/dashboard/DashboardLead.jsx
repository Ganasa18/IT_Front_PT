import React, { useState, useEffect } from "react";
import { makeStyles, Grid, Paper, Typography, Tab } from "@material-ui/core";
import "../../../assets/master.css";
import "../../../assets/dashboard.css";
import TableActionReq from "../../table/user/TableActionReq";
import FacilityTicketTable from "../../table/user/TableFacilityAcc";
import TableAssetUser from "../../table/user/TableAssetUser";
import { invEndPoint, FacEndPoint } from "../../../assets/menu";
import axios from "axios";
import Cookies from "universal-cookie";
import Loader from "react-loader-spinner";

const cookies = new Cookies();
const token = cookies.get("token");
const userID = cookies.get("id");
const DepartementID = cookies.get("departement");

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

const DashboardLead = () => {
  const classes = useStyles();
  const [approvalCount, setApprovalCount] = useState(0);
  const [approvalFacCount, setApprovalFacCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCountApprov();
  }, []);

  const getCountApprov = async () => {
    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/`;

    let fac_req = `${FacEndPoint[0].url}${
      FacEndPoint[0].port !== "" ? ":" + FacEndPoint[0].port : ""
    }/api/v1/facility-req/`;

    const requestOne = await axios.get(act_req);
    const requestTwo = await axios.get(fac_req);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];

          let newDataRequest = responseOne.data.data.request_tiket;
          let newDataRequest2 = responseTwo.data.data.request_facility;

          var arr_request = [...newDataRequest];
          var arr_request2 = [...newDataRequest2];

          arr_request = arr_request.filter(
            (item) =>
              parseInt(item.departement_id) === parseInt(DepartementID) &&
              parseInt(item.user_id) !== parseInt(userID) &&
              parseInt(item.status_id) === 10
          );

          arr_request2 = arr_request2.filter(
            (item) =>
              parseInt(item.user_departement) === parseInt(DepartementID) &&
              parseInt(item.user_id) !== parseInt(userID) &&
              parseInt(item.status_id) === 10
          );

          setApprovalCount(arr_request.length);
          setApprovalFacCount(arr_request2.length);

          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div className="card-dashboard">
            <div className="container-head">
              <p className="title-card">Action Request Approval</p>
              <div className="grow"></div>
              <p>
                <span
                  className="iconify icon-dashboard"
                  data-icon="wpf:approval"></span>
              </p>
            </div>
            <div className="container-body">
              <p className="total-request">{isLoading ? 0 : approvalCount}</p>
              <p className="total-title">Request need to approve</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="card-dashboard">
            <div className="container-head">
              <p className="title-card">Facility & Access Approval</p>
              <div className="grow"></div>
              <p>
                <span
                  className="iconify icon-dashboard"
                  data-icon="wpf:approval"></span>
              </p>
            </div>
            <div className="container-body">
              <p className="total-request">
                {isLoading ? 0 : approvalFacCount}
              </p>
              <p className="total-title">Request need to approve</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TableAssetUser />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper style={{ padding: "50px" }}>
            <div className="row">
              <Typography variant="h5" style={{ marginLeft: "20px" }}>
                Action Request
              </Typography>
              <TableActionReq />
            </div>
            <br />
            <br />
            <br />
            <div className="row">
              <Typography variant="h5" style={{ marginLeft: "20px" }}>
                Facility & Access
              </Typography>
              <FacilityTicketTable />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardLead;
