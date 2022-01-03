import React, { useState, useEffect } from "react";

import "../../assets/master.css";
import "../../assets/asset_user.css";
import "../asset/chips.css";
import { pathEndPoint, invEndPoint } from "../../assets/menu";
import axios from "axios";
import Loading from "./Loading";
import Cookies from "universal-cookie";
import { makeStyles } from "@material-ui/core";

const cookies = new Cookies();
const userID = cookies.get("id");

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

const ChatComponent = () => {
  const [chatValue, setChatValue] = useState(null);
  const req_no = localStorage.getItem("req_no");
  const [isLoading, setIsLoading] = useState(true);
  const [commentData, setCommentData] = useState([]);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [colorIcon, setColorIcon] = useState("#ec9108");
  const props = {
    colorName: colorIcon,
  };
  const classes = useStyles(props);

  useEffect(() => {
    // getComment();
    setTimeout(() => {
      getComment();
    }, 10000);
  }, [commentData]);

  const closeImg = () => {
    const pop = document.querySelector(".popimg");
    pop.style.display = "none";
    const popImg = document.querySelector(".pop_upcontent img");
    popImg.style.display = "none";
    const closePop = document.querySelector(".closepop");
    closePop.style.display = "none";
  };

  const getComment = async () => {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(chatValue);
  };

  const handleImage = (row) => {
    setImage(row);
    console.log(image);
    const imagePop = document.querySelector(".popimg");
    imagePop.style.display = "block";
    const popImg = document.querySelector(".pop_upcontent img");
    popImg.style.display = "block";
    popImg.setAttribute(
      "src",
      `${invEndPoint[0].url}${
        invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
      }/${row}`
    );

    const closePop = document.querySelector(".closepop");
    closePop.style.display = "block";
  };

  const ImageInput = () => {
    const imgInput = document.querySelector("#imgFile");
    imgInput.click();
  };

  function handleChangeImg(e) {
    setFile(e.target.files[0]);
    setColorIcon("#219653");
  }

  const removeImage = () => {
    setFile(null);
    setColorIcon("#ec9108");
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
                          <p>{row.message_desc}</p>
                        </div>
                        <span className="created">
                          {`${calbill(row.createdAt)}`} |{" "}
                          {`${timeZone(row.createdAt)}`}
                        </span>

                        {row.message_pic !== null ? (
                          <img
                            className="img-message"
                            src={`${invEndPoint[0].url}${
                              invEndPoint[0].port !== ""
                                ? ":" + invEndPoint[0].port
                                : ""
                            }/${row.message_pic}`}
                            alt="description"
                            onClick={() => handleImage(row.message_pic)}
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
        <div className="card-footer">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-10">
                <div className={classes.btnWrapper}>
                  <div onClick={ImageInput}>
                    <i
                      data-icon="akar-icons:attach"
                      className={`iconify ${classes.iconAttach}`}></i>
                  </div>
                  {file !== null ? (
                    <div onClick={removeImage}>
                      <i
                        data-icon="akar-icons:cross"
                        className={`iconify ${classes.iconClose}`}></i>
                    </div>
                  ) : null}
                </div>

                <label
                  for="filesImg"
                  id="imgFile"
                  style={{ opacity: "0" }}></label>
                <input
                  accept="image/jpg,image/png,image/jpeg"
                  type="file"
                  className="image-req"
                  id="filesImg"
                  onChange={handleChangeImg.bind(this)}
                />

                <input
                  type="text"
                  className="input-field-comment"
                  value={chatValue}
                  onChange={(e) => setChatValue(e.target.value)}
                />
              </div>
              <div className="col-1">
                <button className="button-send">
                  <i class="iconify" data-icon="fluent:send-16-filled"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="popimg"></div>
      <div class="pop_upcontent">
        <img id="idimgcontent" alt="img" />
        <span class="closepop" onClick={closeImg}>
          Close
        </span>
      </div>
    </>
  );
};

export default ChatComponent;
