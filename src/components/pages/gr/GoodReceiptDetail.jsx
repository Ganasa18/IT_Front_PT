import React, { useState, useEffect } from "react";
import { invEndPoint, logsEndPoint, pathEndPoint } from "../../../assets/menu";
import Loading from "../../asset/Loading";
import { makeStyles, Grid, Breadcrumbs, Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";
import StatusButton from "../../asset/StatusButton";
import axios from "axios";
import GoodReceiveTicket from "../ticket/navigation/GoodReceiveTicket";
import ButtonStatusFacility from "../../asset/ButtonStatusFacility";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

  cardPadding: {
    marginTop: theme.spacing(5),
  },
  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "35%",
    left: "50%",
    width: 650,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 10, 3),
  },
}));

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function calbill(date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var myDate = new Date(date);
  var d = myDate.getDate();
  var m = myDate.getMonth();
  m += 1;
  var y = myDate.getFullYear();

  var newdate = d + " " + monthNames[myDate.getMonth()] + " " + y;
  return newdate;
}

const GoodReceiptDetail = () => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  const grdata = localStorage.getItem("ticketData");
  const [isLoading, setIsLoading] = useState(true);
  const [dataInfo, setDataInfo] = useState([]);
  const [statusBtn, setStatusBtn] = useState([]);
  var gr_check = JSON.parse(grdata);

  useEffect(() => {
    getData();
  }, []);

  const saveStorage = (row) => {
    localStorage.setItem("req_no", row);
  };
  const getData = async () => {
    let status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    const logs = `${logsEndPoint[0].url}${
      logsEndPoint[0].port !== "" ? ":" + logsEndPoint[0].port : ""
    }/api/v1/logs-login/get-latest-fr-history`;

    const requestOne = await axios.get(status);
    const requestTwo = await axios.get(logs);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          let newStatus = responseOne.data.data.statuss;
          let newDataLog = responseTwo.data.data.fr_log;

          setStatusBtn(newStatus);
          var datagr = JSON.parse(grdata);

          var statusmap = {};
          newStatus.forEach(function (status_id) {
            statusmap[status_id.id] = status_id;
          });
          datagr = [datagr];
          datagr.forEach(function (request_id) {
            request_id.status_id = statusmap[request_id.request_id.status_id];
          });

          setDataInfo(datagr);

          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });

    // setDataInfo(datagr);
    // setIsLoading(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={classes.toolbar} />
      <br />

      {gr_check.action_req_code.replace(/[0-9]/g, "") === "MKDFR" ? (
        <Breadcrumbs
          onClick={function () {
            const origin = window.location.origin;
            window.location.href = `${origin}/gr/asset-facility`;
          }}
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb">
          <span className={"span_crumb"}>Goods Receipt</span>
          <Typography color="textPrimary">
            {dataInfo[0].purchase_req_code}
          </Typography>
        </Breadcrumbs>
      ) : (
        <Breadcrumbs
          onClick={function () {
            const origin = window.location.origin;
            window.location.href = `${origin}/gr/asset`;
          }}
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb">
          <span className={"span_crumb"}>Goods Receipt</span>
          <Typography color="textPrimary">
            {dataInfo[0].purchase_req_code}
          </Typography>
        </Breadcrumbs>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Information</h3>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">PR No</p>
                <p>{dataInfo[0].purchase_req_code}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Status</p>
                <p className="">
                  <span
                    class="chip-action"
                    style={{
                      background: `${dataInfo[0].status_id.color_status}4C`,
                      color: `${dataInfo[0].status_id.color_status}FF`,
                    }}>
                    {capitalizeFirstLetter(dataInfo[0].status_id.status_name)}
                  </span>
                </p>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <p className="label-asset">PR Date</p>

                <p>{calbill(dataInfo[0].createdAt)}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Request No</p>

                {gr_check.action_req_code.replace(/[0-9]/g, "") === "MKDFR" ? (
                  <Link
                    onClick={() => saveStorage(dataInfo[0].action_req_code)}
                    to="/ticket-admin/facility-request/detail/information">
                    {dataInfo[0].action_req_code}
                  </Link>
                ) : (
                  <Link
                    onClick={() => saveStorage(dataInfo[0].action_req_code)}
                    to="/ticket-admin/action-request/detail/information">
                    {dataInfo[0].action_req_code}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Profile</h3>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request By</p>
                <p> {capitalizeFirstLetter(dataInfo[0].request_by)}</p>
              </div>
              {gr_check.action_req_code.replace(/[0-9]/g, "") === "MKDFR" ? (
                <div className="col-3">
                  <p className="label-asset">Request For</p>
                  <p> {capitalizeFirstLetter(gr_check.request_id.user_name)}</p>
                </div>
              ) : null}
              <div className="col-3">
                <p className="label-asset">Departement</p>
                <p>
                  {capitalizeFirstLetter(
                    dataInfo[0].id_departement_user.departement_name
                  )}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset">Role</p>
                <p>
                  {capitalizeFirstLetter(dataInfo[0].id_role_user.role_name)}
                </p>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Area</p>
                <p>
                  {capitalizeFirstLetter(dataInfo[0].id_area_user.area_name)}-
                  {dataInfo[0].id_area_user.alias_name}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset">Sub Department </p>
                <p>
                  {`${
                    dataInfo[0].id_sub_departement_user !== undefined
                      ? capitalizeFirstLetter(
                          dataInfo[0].id_sub_departement_user
                            .subdepartement_name
                        )
                      : "none"
                  }`}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset">Status Employee </p>
                <p>{capitalizeFirstLetter(dataInfo[0].id_user.employe)}</p>
              </div>
            </div>
          </div>
        </Grid>
        <GoodReceiveTicket />
        <Grid item xs={4}>
          <div className="card-status">
            <h3>Change Status</h3>
            <br />
            {isLoading ? null : (
              <div className="card-status-item">
                {statusBtn
                  .filter((row) => [13, 14, 15].includes(row.id))
                  .sort((a, b) => (a.id > b.id ? 1 : -1))
                  .map((row) => (
                    <>
                      {gr_check.action_req_code.replace(/[0-9]/g, "") ===
                      "MKDFR" ? (
                        <>
                          <ButtonStatusFacility
                            idStatus={row.id}
                            status={`${
                              dataInfo[0].status_id.status_name ===
                              row.status_name
                                ? dataInfo[0].status_id.status_name
                                : ""
                            }`}
                            nameBtn={row.status_name}
                            colorName={row.color_status}
                            backgroundColor={row.color_status}
                            data={dataInfo[0]}
                          />
                        </>
                      ) : (
                        <>
                          <StatusButton
                            idStatus={row.id}
                            status={`${
                              dataInfo[0].status_id.status_name ===
                              row.status_name
                                ? dataInfo[0].status_id.status_name
                                : ""
                            }`}
                            nameBtn={row.status_name}
                            colorName={row.color_status}
                            backgroundColor={row.color_status}
                            data={dataInfo[0]}
                          />
                        </>
                      )}
                    </>
                  ))}
              </div>
            )}
            <br />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default GoodReceiptDetail;
