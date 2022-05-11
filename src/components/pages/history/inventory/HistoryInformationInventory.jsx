import { Grid, makeStyles } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import Cookies from "universal-cookie";
import "../../../../assets/asset_user.css";
import "../../../../assets/master.css";
import {
  authEndPoint,
  logsEndPoint,
  pathEndPoint,
} from "../../../../assets/menu";
import "../../../asset/chips.css";

const cookies = new Cookies();
const token = cookies.get("token");

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
}));

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

const HistoryInformationInventory = (props) => {
  const classes = useStyles();
  const inv_no = localStorage.getItem("inv_no");
  const [infoData, setInfoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dateNow } = props;

  useEffect(() => {
    getDataHistory();
  }, [dateNow]);
  const getDataHistory = async () => {
    document.getElementById("overlay").style.display = "block";
    const logs = `${logsEndPoint[0].url}${
      logsEndPoint[0].port !== "" ? ":" + logsEndPoint[0].port : ""
    }/api/v1/logs-login/get-all-history-invent`;

    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    let departement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/departement`;

    let subdepartement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/subdepartement`;

    const requestOne = await axios.get(logs);
    const requestTwo = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const requestThree = await axios.get(departement);
    const requestFour = await axios.get(subdepartement);

    axios
      .all([requestOne, requestTwo, requestThree, requestFour])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];
          const responseFour = responses[3];

          let newDataLog = responseOne.data.data.logs_invent;
          let newDataUser = responseTwo.data.data.users;
          let newDataDepartement = responseThree.data.data.departements;
          let newDataSubDepartement = responseFour.data.data.subdepartements;

          newDataLog = newDataLog.filter(
            (item) => item.asset_number === inv_no
          );

          newDataLog = newDataLog.filter((item) => item.createdAt === dateNow);

          let getUser = newDataUser.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
            employe: item.employe_status,
          }));

          var usermap = {};
          getUser.forEach(function (user_id) {
            usermap[user_id.id] = user_id;
          });

          newDataLog.forEach(function (request_id) {
            request_id.user_id = usermap[request_id.used_by];
          });

          var departementmap = {};
          newDataDepartement.forEach(function (depart_id) {
            departementmap[depart_id.id] = depart_id;
          });

          newDataLog.forEach(function (request_id) {
            if (request_id.user_id !== undefined) {
              request_id.depart_id =
                departementmap[request_id.user_id.departement];
            } else {
              request_id.depart_id = departementmap[request_id.departement];
            }
          });

          var subdepartementmap = {};

          newDataSubDepartement.forEach(function (subdepart_id) {
            subdepartementmap[subdepart_id.id] = subdepart_id;
          });

          newDataLog.forEach(function (request_id) {
            if (request_id.user_id !== undefined) {
              request_id.subdepart_id =
                subdepartementmap[request_id.user_id.subdepartement];
            }
          });

          setInfoData(newDataLog);
          setIsLoading(false);
          document.getElementById("overlay").style.display = "none";
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  if (isLoading) {
    return (
      <div id="overlay">
        <Loader
          className="loading-data"
          type="Rings"
          color="#CECECE"
          height={550}
          width={80}
        />
      </div>
    );
  }

  return (
    <>
      <Grid item xs={12}>
        <div className="card-asset-action">
          <h3>Information</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Asset Number</p>
              <p>{infoData[0].asset_number}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Unit/Part</p>
              <p>{infoData[0].asset_part_or_unit}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Date</p>
              <p>{calbill(infoData[0].createdAsset)}</p>
            </div>
          </div>
          <br />
          <br />
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Asset Name</p>
              <p>{infoData[0].asset_name}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Fisik/Non</p>
              <p>{infoData[0].asset_fisik_or_none}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">User/Dept</p>
              <p>{infoData[0].type_asset}</p>
            </div>
            <div className="col-3">
              <p className="label-asset text-center">Status</p>
              <p className="text-center">
                <div className="chip-container">
                  {infoData[0].status_asset === true ? (
                    <span className="chip-inventory-used">Used</span>
                  ) : (
                    <span className="chip-inventory-available">Available</span>
                  )}
                </div>
              </p>
            </div>
          </div>
          <br />
          <br />
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Area</p>
              <p>{infoData[0].area}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">QTY</p>
              <p>{infoData[0].asset_quantity}</p>
            </div>
          </div>
          <br />
          <br />
        </div>
      </Grid>
      <br />
      <Grid item xs={12}>
        <div className="card-asset-action">
          <h3>Profile</h3>
          <div className="row">
            {infoData[0].user_id === undefined ? (
              <>
                <div className="col-3">
                  <p className="label-asset">Used By</p>
                  <p>departement</p>
                </div>
                <div className="col-3">
                  <p className="label-asset">Department</p>
                  <p>{infoData[0].depart_id.departement_name}</p>
                </div>
              </>
            ) : (
              <>
                <div className="col-3">
                  <p className="label-asset">Used By</p>
                  <p>{infoData[0].user_id.name}</p>
                </div>
                <div className="col-3">
                  <p className="label-asset">Department</p>
                  <p>{infoData[0].depart_id.departement_name}</p>
                </div>
                <div className="col-3">
                  <p className="label-asset">Sub Departement</p>
                  <p>
                    {infoData[0].subdepart_id === undefined
                      ? "none"
                      : infoData[0].subdepart_id.subdepartement_name}
                  </p>
                </div>
              </>
            )}
          </div>
          <br />
        </div>
      </Grid>
      <div id="overlay">
        <Loader
          className="loading-data"
          type="Rings"
          color="#CECECE"
          height={550}
          width={80}
        />
      </div>
    </>
  );
};

export default HistoryInformationInventory;
