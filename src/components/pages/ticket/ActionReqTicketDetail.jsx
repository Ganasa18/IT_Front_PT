import React from "react";

import {
  makeStyles,
  Grid,
  Breadcrumbs,
  Typography,
  Divider,
} from "@material-ui/core";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";
import { NavLink } from "react-router-dom";
import InformationTicket from "./navigation/InformationTicket";
import InventoryTicket from "./navigation/InventoryTicket";
import PurchaseTicket from "./navigation/PurchaseTicket";

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

const links = [
  {
    url: "/ticket-admin/action-request/detail/information",
    text: " Information",
  },
  { url: "/ticket-admin/action-request/detail/inventory", text: " Inventory" },
  { url: "/ticket-admin/action-request/detail/purchase", text: " Purchase" },
];

const ActionReqTicketDetail = () => {
  const classes = useStyles();

  switch (window.location.pathname) {
    case "/ticket-admin/action-request/detail/information":
      return (
        <>
          <div className={classes.toolbar} />
          <br />
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb">
            <span className={"span_crumb"}>Action Request</span>
            <Typography color="textPrimary">412312312</Typography>
          </Breadcrumbs>
          {links.map(({ url, text }) => (
            <NavLink to={url}>{text}</NavLink>
          ))}

          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <InformationTicket />
            </Grid>

            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <div className="card-comment">
                <div className="card-title">
                  <h2>Comment</h2>
                </div>
                <div className="card-body">
                  <div className="container-chat">
                    {/* <div className="body-chat" id="style-2">
                  <div className="talk-bubble">
                    <span className="user-name">Username</span>
                    <div class="talktext">
                      <p>
                        Tesst asdawdawd awedagjkdawdgaaaaaaaaaaaaaaaaaaaaaaaaaaa
                      </p>
                    </div>
                    <span className="created">2 Okt 2021 | 10:33 </span>
                  </div>
                  <div className="talk-bubble-right">
                    <span className="user-name">Username</span>
                    <div class="talktext">
                      <p>
                        Hello Thereaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa sdawdadw
                      </p>
                    </div>
                    <span className="created">2 Okt 2021 | 10:33 </span>
                  </div>
                </div> */}

                    {/* Empty Chat */}

                    <div className="empty-chat">
                      <div className="container">
                        <i
                          class="iconify icon-chat"
                          data-icon="bi:chat-left-dots-fill"></i>
                        <p>Waiting for comment</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="row">
                    <div className="col-10">
                      <span
                        className="iconify icon-attach"
                        data-icon="akar-icons:attach"></span>
                      <input type="text" className="input-field-comment" />
                    </div>
                    <div className="col-1">
                      <button className="button-send">
                        <i
                          class="iconify"
                          data-icon="fluent:send-16-filled"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </>
      );

    case "/ticket-admin/action-request/detail/inventory":
      return (
        <>
          <div className={classes.toolbar} />
          <br />
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb">
            <span className={"span_crumb"}>Action Request</span>
            <Typography color="textPrimary">412312312</Typography>
          </Breadcrumbs>
          {links.map(({ url, text }) => (
            <NavLink to={url}>{text}</NavLink>
          ))}

          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <InventoryTicket />
            </Grid>

            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <div className="card-comment">
                <div className="card-title">
                  <h2>Comment</h2>
                </div>
                <div className="card-body">
                  <div className="container-chat">
                    {/* <div className="body-chat" id="style-2">
                      <div className="talk-bubble">
                        <span className="user-name">Username</span>
                        <div class="talktext">
                          <p>
                            Tesst asdawdawd awedagjkdawdgaaaaaaaaaaaaaaaaaaaaaaaaaaa
                          </p>
                        </div>
                        <span className="created">2 Okt 2021 | 10:33 </span>
                      </div>
                      <div className="talk-bubble-right">
                        <span className="user-name">Username</span>
                        <div class="talktext">
                          <p>
                            Hello Thereaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa sdawdadw
                          </p>
                        </div>
                        <span className="created">2 Okt 2021 | 10:33 </span>
                      </div>
                    </div> */}

                    {/* Empty Chat */}

                    <div className="empty-chat">
                      <div className="container">
                        <i
                          class="iconify icon-chat"
                          data-icon="bi:chat-left-dots-fill"></i>
                        <p>Waiting for comment</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="row">
                    <div className="col-10">
                      <span
                        className="iconify icon-attach"
                        data-icon="akar-icons:attach"></span>
                      <input type="text" className="input-field-comment" />
                    </div>
                    <div className="col-1">
                      <button className="button-send">
                        <i
                          class="iconify"
                          data-icon="fluent:send-16-filled"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </>
      );

    case "/ticket-admin/action-request/detail/purchase":
      return (
        <>
          <div className={classes.toolbar} />
          <br />
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb">
            <span className={"span_crumb"}>Action Request</span>
            <Typography color="textPrimary">412312312</Typography>
          </Breadcrumbs>
          {links.map(({ url, text }) => (
            <NavLink to={url}>{text}</NavLink>
          ))}

          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <PurchaseTicket />
            </Grid>

            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <div className="card-comment">
                <div className="card-title">
                  <h2>Comment</h2>
                </div>
                <div className="card-body">
                  <div className="container-chat">
                    {/* <div className="body-chat" id="style-2">
                      <div className="talk-bubble">
                        <span className="user-name">Username</span>
                        <div class="talktext">
                          <p>
                            Tesst asdawdawd awedagjkdawdgaaaaaaaaaaaaaaaaaaaaaaaaaaa
                          </p>
                        </div>
                        <span className="created">2 Okt 2021 | 10:33 </span>
                      </div>
                      <div className="talk-bubble-right">
                        <span className="user-name">Username</span>
                        <div class="talktext">
                          <p>
                            Hello Thereaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa sdawdadw
                          </p>
                        </div>
                        <span className="created">2 Okt 2021 | 10:33 </span>
                      </div>
                    </div> */}

                    {/* Empty Chat */}

                    <div className="empty-chat">
                      <div className="container">
                        <i
                          class="iconify icon-chat"
                          data-icon="bi:chat-left-dots-fill"></i>
                        <p>Waiting for comment</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="row">
                    <div className="col-10">
                      <span
                        className="iconify icon-attach"
                        data-icon="akar-icons:attach"></span>
                      <input type="text" className="input-field-comment" />
                    </div>
                    <div className="col-1">
                      <button className="button-send">
                        <i
                          class="iconify"
                          data-icon="fluent:send-16-filled"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </>
      );
    default:
      return "ERROR!";
  }
};

export default ActionReqTicketDetail;
