import axios from "axios";
import { FacEndPoint, authEndPoint, invEndPoint } from "../../../assets/menu";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const userid = cookies.get("id");

export const setLoading = (value) => {
  return { type: "SET_LOADING", value };
};

export const getAdminData = () => async (dispatch) => {
  let user = `${authEndPoint[0].url}${
    authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
  }/api/v1/auth/get-back-user`;
  await axios
    .get(user)
    .then((response) => {
      let usersData = response.data.data.users;
      usersData = usersData.filter((item) => item.id === parseInt(userid));
      dispatch({ type: "SET_USER_REQUEST", value: usersData });
    })
    .catch((err) => {
      alert("something wrong ");
    });
};

export const updateTicketResponded =
  (user, comment, reqNum) => async (dispatch) => {
    document.getElementById("overlay").style.display = "block";

    if (comment.length < 5) return alert("comment must fill min 5 character");
    if (!reqNum) return alert("request number undefined");

    let message_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/message-req/messagePost`;

    let update_ticket = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/updated-ticket-status/${reqNum}`;

    const imageFormData = new FormData();
    imageFormData.append("action_req_code", `${reqNum}`);
    imageFormData.append("id_user", parseInt(user[0].id));
    imageFormData.append("user_name", `${user[0].username}`);
    imageFormData.append("message_desc", `${comment}`);

    await axios
      .patch(update_ticket, {
        status_id: 22,
      })
      .then(async (response) => {
        alert("submit responded");
        await axios
          .post(message_req, imageFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            alert("redirect");
            document.getElementById("overlay").style.display = "none";
            window.location.href =
              "/ticket-admin/action-request/detail/information";
          })
          .catch((error) => {
            alert("something wrong");
          });
      })
      .catch((err) => {
        alert("something wrong");
      });
  };

export const updateTicketRespondedFacility =
  (user, comment, reqNum) => async (dispatch) => {
    console.log(user, comment, reqNum);
    // document.getElementById("overlay").style.display = "block";
    // if (comment.length < 5) return alert("comment must fill min 5 character");
    // if (!reqNum) return alert("request number undefined");

    let update_ticket = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/updated-ticket-status/${reqNum}`;
  };
