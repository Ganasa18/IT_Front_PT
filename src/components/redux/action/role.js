import axios from "axios";
import { authEndPoint } from "../../../assets/menu";

export const getDataRoleOnly = (token) => async (dispatch) => {
  await axios
    .get(
      `${authEndPoint[0].url}${
        authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
      }/api/v1/role`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      dispatch({ type: "SET_ROLES", value: response.data.data.roles });
      dispatch({ type: "SET_LOADING", value: false });
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: "SET_LOADING", value: false });
    });
};
