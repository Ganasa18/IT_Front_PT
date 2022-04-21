import axios from "axios";
import { pathEndPoint } from "../../../assets/menu";

export const getDataCategory = () => async (dispatch) => {
  await axios
    .get(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/category`
    )
    .then((response) => {
      const DataCategory = response.data.data.category;
      dispatch({ type: "SET_CATEGORY", value: DataCategory });
      const newArrCategory = DataCategory.map((row) => ({
        value: row.id,
        name: row.category_name,
      }));
      dispatch({ type: "SET_OPTION_CATEGORY", value: newArrCategory });
      dispatch({ type: "SET_LOADING", value: false });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getLatestId = () => async (dispatch) => {
  await axios
    .get(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/category`
    )
    .then((response) => {
      const dataCategory = response.data.data.category;
      dispatch({
        type: "SET_LAST_CATEGORY_ID",
        value: dataCategory.shift().id,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

export const filterDataCategory = (categoryData) => async (dispatch) => {
  dispatch({ type: "SET_CATEGORY", value: categoryData });
};
