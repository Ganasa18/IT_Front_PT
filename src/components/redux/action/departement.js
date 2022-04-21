import axios from "axios";
import { pathEndPoint } from "../../../assets/menu";

export const getDataDepartment = () => async (dispatch) => {
  await axios
    .get(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/departement`
    )
    .then((response) => {
      const DataDepartment = response.data.data.departements;
      dispatch({ type: "SET_DEPARTEMENT", value: DataDepartment });
      dispatch({ type: "SET_LOADING", value: false });
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: "SET_LOADING", value: false });
    });
};

export const getLatestIdDepartement = () => async (dispatch) => {
  await axios
    .get(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/departement/latestId`
    )
    .then((response) => {
      const dataDepartement = response.data.data.departement.id;
      dispatch({
        type: "SET_LAST_DEPARTEMENT_ID",
        value: dataDepartement.shift().id,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

export const filterDataDepartement = (departementData) => async (dispatch) => {
  dispatch({ type: "SET_DEPARTEMENT", value: departementData });
};
