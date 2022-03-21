import React, { useState, useEffect } from "react";
import { makeStyles, Grid, Paper } from "@material-ui/core";
import { prEndPoint } from "../../../assets/menu";
import "../../../assets/master.css";
import "../../../assets/dashboard.css";
import axios from "axios";

const DashboardPurchase = () => {
  const [purchasePRCount, setPurchasePRCount] = useState(0);
  const [purchaseDoneCount, setPurchaseDoneCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCountApprov();
  }, []);

  const getCountApprov = async () => {
    let pr = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-req`;

    let po = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-order/get-pr`;

    const requestOne = await axios.get(pr);
    const requestTwo = await axios.get(po);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          let newDataPR = responseOne.data.data.request_purchase;
          let newDataPD = responseTwo.data.data.pr_data;

          newDataPR = newDataPR.filter(
            (item) =>
              parseInt(item.status_id) === 7 &&
              item.purchase_order_code_1 === null
          );
          setPurchasePRCount(newDataPR.length);
          setPurchaseDoneCount(newDataPD.length);

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
              <p className="title-card">Incoming PR</p>
              <div className="grow"></div>
              <p>
                <span
                  className="iconify icon-dashboard"
                  data-icon="wpf:approval"></span>
              </p>
            </div>
            <div className="container-body">
              <p className="total-request">{isLoading ? 0 : purchasePRCount}</p>
              <p className="total-title">PR need to Process</p>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="card-dashboard">
            <div className="container-head">
              <p className="title-card">Purchasing Done</p>
              <div className="grow"></div>
              <p>
                <span
                  className="iconify icon-dashboard"
                  data-icon="wpf:approval"></span>
              </p>
            </div>
            <div className="container-body">
              <p className="total-request">
                {isLoading ? 0 : purchaseDoneCount}
              </p>
              <p className="total-title">Purchasing Done</p>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPurchase;
