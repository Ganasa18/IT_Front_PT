import axios from "axios";
import { pathEndPoint } from "../../../assets/menu";

export const exportInventory = () => async (dispatch) => {
  const URL_EXP = `${pathEndPoint[0].url}${
    pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
  }/api/v1/inventory/export-inv`;
  await axios
    .get(URL_EXP)
    .then(() => {
      const file = `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/public/file/export/export_inventory.xlsx`;

      const link = document.createElement("a");
      link.href = file;
      link.setAttribute("download", "file.xlsx");
      document.body.appendChild(link);
      link.click();
    })
    .catch((err) => {
      alert("something wrong with download");
    });
};

export const importDataInvent = (files, tag) => async (dispatch) => {
  const URL = `${pathEndPoint[0].url}${
    pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
  }/api/v1/inventory/import-inv`;

  if (tag === "") {
    return alert("tag must be fill");
  }

  const fileFormData = new FormData();
  fileFormData.append("inventory_data", files);
  fileFormData.append("tag_code", tag);
  await axios
    .post(URL, fileFormData)
    .then((response) => {
      alert(response.data.status);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch((err) => {
      alert("something wrong");
    });
};
