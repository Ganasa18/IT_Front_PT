import React, { useState, useEffect } from "react";
import { logsEndPoint, authEndPoint } from "../../../../assets/menu";
import { makeStyles, Grid } from "@material-ui/core";
import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../../../asset/chips.css";
import "../../../../assets/timeline.css";
import BreadcrumbComponent from "../../../asset/BreadcrumbComponent";
import axios from "axios";
import Loading from "../../../asset/Loading";
import HistoryInformationInventory from "./HistoryInformationInventory";

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

var isDown = false;
var scrollX;
var scrollLeft;

const HandleMouseUp = () => {
  const scroll = document.querySelector(".scroll");
  isDown = false;
  scroll.classList.remove("active");
};

const HandleMouseLeave = () => {
  const scroll = document.querySelector(".scroll");
  isDown = false;
  scroll.classList.remove("active");
};

const HandleMouseDown = (e) => {
  const scroll = document.querySelector(".scroll");
  e.preventDefault();
  isDown = true;
  scroll.classList.add("active");
  scrollX = e.pageX - scroll.offsetLeft;
  scrollLeft = scroll.scrollLeft;
};

const HandleMouseMove = (e) => {
  const scroll = document.querySelector(".scroll");
  if (!isDown) return;
  e.preventDefault();
  var element = e.pageX - scroll.offsetLeft;
  var scrolling = (element - scrollX) * 2;
  scroll.scrollLeft = scrollLeft - scrolling;
};

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

const HistoryInventoryDetail = () => {
  const classes = useStyles();
  const inv_no = localStorage.getItem("inv_no");
  const [isLoading, setIsLoading] = useState(true);
  const [dateSelect, setDateSelect] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [inventDataDate, setInventDataDate] = useState([]);

  useEffect(() => {
    getDataHistory();
  }, []);

  const getDataHistory = async () => {
    const logs = `${logsEndPoint[0].url}${
      logsEndPoint[0].port !== "" ? ":" + logsEndPoint[0].port : ""
    }/api/v1/logs-login/get-all-history-invent`;

    const requestOne = await axios.get(logs);

    await axios
      .all([requestOne])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];

          let newDataLog = responseOne.data.data.logs_invent;

          newDataLog = newDataLog.filter(
            (item) => item.asset_number === inv_no
          );
          setDateSelect(newDataLog[0].createdAt);
          setActiveLink(newDataLog[0].id);
          setInventDataDate(newDataLog);
          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <BreadcrumbComponent
        Onclick={function () {
          const origin = window.location.origin;
          window.location.href = `${origin}/history/inventory`;
        }}
        textSpan={"Inventory History"}
        typographyText={inv_no}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className="container-timeline">
            <div
              class="scroll"
              onMouseUp={HandleMouseUp}
              onMouseLeave={HandleMouseLeave}
              onMouseDown={HandleMouseDown}
              onMouseMove={HandleMouseMove}>
              {inventDataDate.map((row) => (
                <div
                  className={`card-timeline ${
                    activeLink === row.id ? "active" : ""
                  }`}
                  onClick={function () {
                    setDateSelect(row.createdAt);
                    setActiveLink(row.id);
                  }}>
                  <div className="card-inner">
                    <p className="text-center">
                      <div className="chip-container">
                        {row.status_asset === true ? (
                          <span className="chip-inventory-used">Used</span>
                        ) : (
                          <span className="chip-inventory-available">
                            Available
                          </span>
                        )}
                      </div>
                    </p>
                    <br />
                    <br />
                    <p class="paragraph truncate">{calbill(row.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <HistoryInformationInventory dateNow={dateSelect} />
        </Grid>
      </Grid>
    </>
  );
};

export default HistoryInventoryDetail;
