import React, { useState, useEffect } from "react";

import "../../assets/master.css";
import "../../assets/asset_user.css";
import "../asset/chips.css";
import { authEndPoint, invEndPoint } from "../../assets/menu";
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

const ChatComponent = () => {
  const [chatValue, setChatValue] = useState(null);
  const req_no = localStorage.getItem("req_no");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInput, setIsLoadingInput] = useState(true);
  const [commentData, setCommentData] = useState([]);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [colorIcon, setColorIcon] = useState("#ec9108");
  const [userData, setUserData] = useState([]);
  const [checkInput, setCheckInput] = useState(false);
  const [checkStatusData, setCheckStatusData] = useState([]);

  const props = {
    colorName: colorIcon,
  };
  const classes = useStyles(props);

  useEffect(() => {
    setTimeout(() => {
      getComment();
    }, 10000);
    getUser();
    checkStatus();
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

  const checkStatus = async () => {
    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req`;

    await axios
      .get(act_req)
      .then((response) => {
        const messageData = response.data.data.request_tiket;
        let filterMessage = messageData.filter(
          (item) => item.action_req_code === req_no
        );
        setCheckStatusData(filterMessage);
        setIsLoadingInput(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUser = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    await axios
      .get(user, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const usersData = response.data.data.users;
        let filterUser = usersData.filter(
          (item) => item.id === parseInt(userID)
        );
        filterUser = filterUser.map((row) => ({
          user_id: row.id,
          username: row.username,
        }));
        setUserData(filterUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !chatValue) {
      return;
    }

    const checkFile = document.getElementById("filesImg");

    let message_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/message-req/messagePost`;

    const imageFormData = new FormData();
    if (checkFile.files.length > 0) {
      imageFormData.append("message_pic", file);
    }

    imageFormData.append("action_req_code", `${req_no}`);
    imageFormData.append("id_user", parseInt(userData[0].user_id));
    imageFormData.append("user_name", `${userData[0].username}`);
    imageFormData.append(
      "message_desc",
      `${chatValue === null ? null : chatValue}`
    );

    await axios
      .post(message_req, imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setChatValue("");
        setFile(null);
        setColorIcon("#ec9108");
        setTimeout(() => {
          getComment();
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImage = (row) => {
    setImage(row);
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
    setCheckInput(true);
  }

  const removeImage = () => {
    const checkFile = document.getElementById("filesImg");
    checkFile.value = "";
    setFile(null);
    setColorIcon("#ec9108");
    setCheckInput(false);
  };

  const setInput = (e) => {
    setChatValue(e.target.value);
    // console.log(chatValue.length);
    setCheckInput(true);
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
        {isLoadingInput ? null : checkStatusData[0].status_id === 11 ||
          checkStatusData[0].status_id === 20 ? null : (
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
                    onChange={setInput}
                  />
                </div>
                <div className="col-1">
                  <button
                    className={`${
                      checkInput ? "button-send" : "button-send-disbled"
                    }`}>
                    <i class="iconify" data-icon="fluent:send-16-filled"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
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
