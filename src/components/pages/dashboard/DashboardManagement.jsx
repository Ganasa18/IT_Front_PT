import React, { useState, useEffect } from "react";
import { makeStyles, Grid, Paper } from "@material-ui/core";
import { pathEndPoint, prEndPoint } from "../../../assets/menu";
import "../../../assets/master.css";
import "../../../assets/dashboard.css";
import axios from "axios";

const DashboardManagement = () => {
  const [approvalPRCount, setApprovalPRCount] = useState(0);
  const [approvalDspCount, setApprovalDspCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCountApprov();
  }, []);

  const getCountApprov = async () => {
    let pr = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-req`;

    let disposal = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/disposal`;

    const requestOne = await axios.get(pr);
    const requestTwo = await axios.get(disposal);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          let newDataPR = responseOne.data.data.request_purchase;
          let newDataDisposal = responseTwo.data.data.disposal;

          newDataPR = newDataPR.filter(
            (item) => parseInt(item.status_id) === 10
          );
          newDataDisposal = newDataDisposal.filter(
            (item) => parseInt(item.status_approval) === 10
          );
          setApprovalPRCount(newDataPR.length);
          setApprovalDspCount(newDataDisposal.length);
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
              <p className="title-card">Procurment Approval</p>
              <div className="grow"></div>
              <p>
                <span
                  className="iconify icon-dashboard"
                  data-icon="wpf:approval"></span>
              </p>
            </div>
            <div className="container-body">
              <p className="total-request">{isLoading ? 0 : approvalPRCount}</p>
              <p className="total-title">PR need to approve</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="card-dashboard">
            <div className="container-head">
              <p className="title-card">Disposal Asset Approval</p>
              <div className="grow"></div>
              <p>
                <span
                  className="iconify icon-dashboard"
                  data-icon="wpf:approval"></span>
              </p>
            </div>
            <div className="container-body">
              <p className="total-request">
                {isLoading ? 0 : approvalDspCount}
              </p>
              <p className="total-title">Disposal need to approve</p>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardManagement;
