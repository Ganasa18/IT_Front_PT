import React, { useState, useEffect } from "react";

import "../../assets/master.css";
import "../../assets/asset_user.css";
import "../asset/chips.css";
import { FacEndPoint, invEndPoint } from "../../assets/menu";
import axios from "axios";
import Loading from "./Loading";
import Cookies from "universal-cookie";
import { makeStyles } from "@material-ui/core";

const cookies = new Cookies();
const userID = cookies.get("id");
const token = cookies.get("token");

const useStyles = makeStyles((theme) => ({
  iconAttach: (props) => ({
    fontSize: "25px",
    cursor: "pointer",
    color: props.colorName,
  }),

  iconClose: {
    fontSize: "20px",
    cursor: "pointer",
    color: "#e95d5d",
    marginLeft: "5px",
  },

  paddingImg: {
    position: "relative",
    bottom: "20px",
    left: "12%",
    width: "270px",
    height: "150px",
  },

  btnWrapper: {
    position: "absolute",
    background: "transparent",
    width: "auto",
    padding: "5px 15px 5px 15px",
    height: "40px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",

    [theme.breakpoints.up("xl")]: {
      top: "50%",
      left: "70%",
      transform: "translate(58%, -45%)",
    },

    [theme.breakpoints.down("lg")]: {
      top: "50%",
      left: "70%",
      transform: "translate(-10%, -45%)",
    },
  },
}));

function timeZone(date) {
  // Specifying timeZone is what causes the conversion, the rest is just formatting
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  };
  const formatter = new Intl.DateTimeFormat("sv-SE", options);
  const startingDate = new Date(date);

  const dateInNewTimezone = formatter.format(startingDate);

  return dateInNewTimezone;
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

const ChatHistory = () => {
  const req_no = localStorage.getItem("req_no");
  const [isLoading, setIsLoading] = useState(false);
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    getComment();
  }, []);

  const getComment = async () => {
    let type_req = req_no.replace(/[0-9]/g, "");

    if (type_req === "MKDAR") {
      let act_comment = `${invEndPoint[0].url}${
        invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
      }/api/v1/message-req`;

      await axios
        .get(act_comment)
        .then((response) => {
          const messageData = response.data.data.request_message;
          let filterMessage = messageData.filter(
            (item) => item.action_req_code === req_no
          );
          setCommentData(filterMessage);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
      return;
    }

    let act_comment = `${FacEndPoint[0].url}${
      FacEndPoint[0].port !== "" ? ":" + FacEndPoint[0].port : ""
    }/api/v1/facility-req/message-get`;

    await axios
      .get(act_comment)
      .then((response) => {
        const messageData = response.data.data.request_message;
        let filterMessage = messageData.filter(
          (item) => item.facility_req_code === req_no
        );
        setCommentData(filterMessage);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="card-comment">
        <div className="card-title">
          <h2>Comment</h2>
        </div>

        <div className="card-body">
          <div className="container-chat">
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <div className="body-chat" id="style-2">
                  {commentData.length > 0 ? (
                    commentData.map((row) => (
                      <div
                        key={row.id}
                        className={`${
                          row.id_user !== parseInt(userID)
                            ? "talk-bubble"
                            : "talk-bubble-right"
                        }`}>
                        <span className="user-name">{row.user_name}</span>
                        <div class="talktext">
                          <p>
                            {row.message_desc !== "null"
                              ? row.message_desc
                              : ""}
                          </p>
                        </div>
                        <span className="created">
                          {`${calbill(row.createdAt)}`} |
                          {`${timeZone(row.createdAt)}`}
                        </span>

                        {row.message_pic !== null ? (
                          <img
                            className={`img-message`}
                            src={`${invEndPoint[0].url}${
                              invEndPoint[0].port !== ""
                                ? ":" + invEndPoint[0].port
                                : ""
                            }/${row.message_pic}`}
                            alt="description"
                          />
                        ) : null}
                      </div>
                    ))
                  ) : (
                    //  Empty Chat
                    <div className="empty-chat">
                      <div className="container">
                        <i
                          class="iconify icon-chat"
                          data-icon="bi:chat-left-dots-fill"></i>
                        <p>Waiting for comment</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHistory;
