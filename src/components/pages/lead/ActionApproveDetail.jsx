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

const ActionApproveDetail = () => {
  const classes = useStyles();
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
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Information</h3>

              <div className="button-approve">
                <button className="approve-btn">Approve</button>
                <button className="deny-btn">Deny</button>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request Number</p>
                <p>412312312</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Asset Number</p>
                <p>MKDLTHO01</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Asset Name</p>
                <p>Laptop hp 123</p>
              </div>
              <div className="col-3">
                <p className="label-asset text-center">Status</p>
                <p className="text-center">
                  <span
                    class="chip-action"
                    style={{
                      background: `#EC91084C`,
                      color: `#EC9108FF`,
                    }}>
                    Need approved
                  </span>
                </p>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request By</p>
                <p>User A</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Date</p>
                <p>10 Dec 2021</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Description Of Problem</p>
                <p>
                  Pada saat nyalain laptop, layar warna biru, ditunggu 5 menit
                  layar langsung mati
                </p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={8}>
          <div className="card-comment">
            <div className="card-title">
              <h2>Comment</h2>
            </div>
            <div className="card-body">
              <div className="container-chat">
                <div className="body-chat" id="style-2">
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
                </div>

                {/* Empty Chat */}

                {/* <div className="empty-chat">
                  <div className="container">
                    <i
                      class="iconify icon-chat"
                      data-icon="bi:chat-left-dots-fill"></i>
                    <p>Waiting for comment</p>
                  </div>
                </div> */}
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
                    <i class="iconify" data-icon="fluent:send-16-filled"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default ActionApproveDetail;
