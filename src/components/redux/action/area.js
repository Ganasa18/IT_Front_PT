import axios from "axios";
import { pathEndPoint } from "../../../assets/menu";

export const getDataArea = () => async (dispatch) => {
  await axios
    .get(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/area`
    )
    .then((response) => {
      dispatch({ type: "SET_AREA", value: response.data.data.areas });

      dispatch({ type: "SET_LOADING", value: false });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const filterDataArea = (areaData) => async (dispatch) => {
  dispatch({ type: "SET_AREA", value: areaData });
};
