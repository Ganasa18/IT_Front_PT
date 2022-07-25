import axios from "axios";
import { pathEndPoint, authEndPoint } from "../../../assets/menu";

export const getDataUser = (token) => async (dispatch) => {
  let user = `${authEndPoint[0].url}${
    authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
  }/api/v1/auth/`;

  let area = `${pathEndPoint[0].url}${
    pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
  }/api/v1/area`;

  let role = `${authEndPoint[0].url}${
    authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
  }/api/v1/role`;

  let departement = `${pathEndPoint[0].url}${
    pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
  }/api/v1/departement`;

  let subdepartement = `${pathEndPoint[0].url}${
    pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
  }/api/v1/subdepartement`;

  const requestOne = await axios.get(user, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const requestTwo = await axios.get(area);
  const requestThree = await axios.get(role, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const requestFour = await axios.get(departement);

  const requestFive = await axios.get(subdepartement);

  axios
    .all([requestOne, requestTwo, requestThree, requestFour, requestFive])
    .then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];
        const responesThree = responses[2];
        const responesFour = responses[3];
        const responesFive = responses[4];

        let newDataUser = responseOne.data.data.users;
        let newDataArea = responseTwo.data.data.areas;
        let newDataRole = responesThree.data.data.roles;
        let newDataDepartement = responesFour.data.data.departements;
        let newDataSubDepartement = responesFive.data.data.subdepartements;

        newDataUser = newDataUser.filter((data) => data.is_active === true);

        const arr_user = [...newDataUser];
        const arr_area = [...newDataArea];
        const arr_role = [...newDataRole];
        const arr_departement = [...newDataDepartement];
        const arr_subdepartement = [...newDataSubDepartement];

        const newArrDepart = arr_departement.map((row) => ({
          value: row.id,
          name: row.departement_name,
        }));

        const newArrSubDepart = arr_subdepartement.map((row) => ({
          value: row.id,
          name: row.subdepartement_name,
        }));

        var areamap = {};
        arr_area.forEach(function (area_id) {
          areamap[area_id.id] = area_id;
        });
        // now do the "join":
        arr_user.forEach(function (user) {
          user.area_id = areamap[user.area];
        });
        let JoinArea = arr_user;

        var rolemap = {};
        arr_role.forEach(function (role_id) {
          rolemap[role_id.id] = role_id;
        });

        JoinArea.forEach(function (user) {
          user.role_id = rolemap[user.role];
        });
        let JoinRole = JoinArea;

        var departementmap = {};
        newArrDepart.forEach(function (depart_id) {
          departementmap[depart_id.value] = depart_id;
        });

        JoinRole.forEach(function (user) {
          user.depart_id = departementmap[user.departement];
        });

        let JoinDepartement = JoinArea;
        var subdepartementmap = {};
        newArrSubDepart.forEach(function (subdepart_id) {
          subdepartementmap[subdepart_id.value] = subdepart_id;
        });
        JoinDepartement.forEach(function (user) {
          user.subdepart_id = subdepartementmap[user.subdepartement];
        });

        let JoinSubDepartement = JoinDepartement;

        dispatch({ type: "SET_USER", value: JoinSubDepartement });
        dispatch({ type: "SET_LOADING", value: false });
      })
    )
    .catch((errors) => {
      alert("something wrong");
      // react on errors.
      //   console.error(errors);
    });
};

export const openModalExportAct = (token) => async (dispatch) => {
  dispatch({ type: "SET_USER_MODAL_EXPORT", value: true });
  const URL_EXP = `${authEndPoint[0].url}${
    authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
  }/api/v1/auth/export-user`;

  await axios
    .get(URL_EXP, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      const file = `${authEndPoint[0].url}${
        authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
      }/public/file/export/export_user.xlsx`;

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

export const getDataRole = (token) => async (dispatch) => {
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
      const DataRole = response.data.data.roles;

      const arr = [...DataRole];
      const newArr = arr.map((row) => ({
        value: row.id,
        name: row.role_name,
      }));

      dispatch({ type: "SET_USER_ROLE", value: newArr });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getDataDepartementUser = () => async (dispatch) => {
  await axios
    .get(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/departement`
    )
    .then((response) => {
      const DepartementList = response.data.data.departements;
      const arr = [...DepartementList];
      const newArr = arr.map((row) => ({
        value: row.id,
        name: row.departement_name,
      }));
      dispatch({ type: "SET_USER_DEPARTEMENT", value: newArr });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getDataAreaUser = () => async (dispatch) => {
  await axios
    .get(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/area`
    )
    .then((response) => {
      const DataArea = response.data.data.areas;

      const arr = [...DataArea];
      const newArr = arr.map((row) => ({
        value: row.id,
        name: row.area_name,
      }));
      dispatch({ type: "SET_USER_AREA", value: newArr });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const importDataUser = (files, token) => async (dispatch) => {
  const URL = `${authEndPoint[0].url}${
    authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
  }/api/v1/auth/import-user`;
  const fileFormData = new FormData();
  fileFormData.append("user_data", files);

  await axios
    .post(URL, fileFormData, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
