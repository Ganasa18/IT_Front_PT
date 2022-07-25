import React, { useEffect, useState, useRef } from "react";
import Loader from "react-loader-spinner";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
  Snackbar,
  Divider,
} from "@material-ui/core";
import "../../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../../assets/select-search.css";
import axios from "axios";
import TableActionReq from "../../table/user/TableActionReq";
import {
  authEndPoint,
  pathEndPoint,
  invEndPoint,
  logsEndPoint,
} from "../../../assets/menu";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");
const userID = cookies.get("id");

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

  headerMaster: {
    paddingLeft: "30px",
    paddingRight: "30px",
  },

  buttonAdd: {
    [theme.breakpoints.up("xl")]: {
      width: "150px",
      left: "60%",
      top: "20px",
    },

    [theme.breakpoints.down("lg")]: {
      width: "150px",
      left: "40%",
      top: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "20px",
      width: "120px",
    },
    fontSize: 12,
  },
  cardRoot: {
    fontSize: 12,
  },

  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "50%",
    left: "50%",
    width: 950,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 8, 3),

    [theme.breakpoints.down("lg")]: {
      height: "82%",
    },
  },
  paperFilter: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "30%",
    left: "50%",
    width: 540,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 10, 3),
  },

  alertImage: {
    position: "absolute",
    bottom: 150,
    left: 50,
  },
}));

const handleImage = () => {
  const labelImg = document.getElementById("labelImg");
  labelImg.click();
};

const ActionReq = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [allDataUser, setAllDataUser] = useState([]);
  const [userData, setUserData] = useState([]);
  const [assetUser, setAssetUser] = useState([]);
  const searchInput = useRef();
  const [files, setFiles] = useState(null);
  const [descriptionValue, setDescriptionValue] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [lastNumber, setLastNumber] = useState("");
  const [leadEmail, setLeadEmail] = useState(null);
  const [searchValue, SetSearchValue] = useState("");
  const [valueStatus, setValueStatus] = useState("");
  const [searchValueFilter, setSearchValueFilter] = useState(null);
  const [modalOpenFilter, setModalOpenFilter] = useState(false);
  const [dataStatus, setDataStatus] = useState([]);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedDate2, handleDateChange2] = useState(new Date());

  const handleChange = (...args) => {
    setAssetId(args[1].value);

    localStorage.setItem("asset_number", args[1].asset_number);
    localStorage.setItem("asset_name", args[1].name);
  };

  const handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return assetUser;
      }
      const updatedItems = items.map((list) => {
        const newItems = list.items.filter((item) => {
          return item.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        return { ...list, items: newItems };
      });
      return updatedItems;
    };
  };

  useEffect(() => {
    getUserList();
    getStatusList();
  }, []);

  const getStatusList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/status`
      )
      .then((response) => {
        console.log(response.data.data.statuss);
        const DataStatus = response.data.data.statuss;

        const arr = [...DataStatus];
        let newArr = arr.map((row) => ({
          value: row.id,
          name: row.status_name,
        }));
        newArr = newArr.filter((row) =>
          [4, 8, 9, 10, 12, 13, 14, 15, 19].includes(row.value)
        );

        setDataStatus(newArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserList = async () => {
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

          const AllData = newDataUser.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
          }));
          setAllDataUser(AllData);

          var getID = newDataUser.filter(
            (item) => item.id === parseInt(userID)
          );
          getID = getID.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
            employe: item.employe_status,
          }));

          var areamap = {};
          newDataArea.forEach(function (area_id) {
            areamap[area_id.id] = area_id;
          });

          getID.forEach(function (user) {
            user.area_id = areamap[user.area];
          });
          var rolemap = {};
          newDataRole.forEach(function (role_id) {
            rolemap[role_id.id] = role_id;
          });

          getID.forEach(function (user) {
            user.role_id = rolemap[user.role];
          });

          var departementmap = {};
          newDataDepartement.forEach(function (depart_id) {
            departementmap[depart_id.id] = depart_id;
          });

          getID.forEach(function (user) {
            user.depart_id = departementmap[user.departement];
          });

          var subdepartementmap = {};
          newDataSubDepartement.forEach(function (subdepart_id) {
            subdepartementmap[subdepart_id.id] = subdepart_id;
          });

          getID.forEach(function (user) {
            user.subdepart_id = subdepartementmap[user.subdepartement];
          });

          console.log(getID);
          setUserData(getID);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  const modalPop = async () => {
    setModalOpen(true);

    // Get Lead Usera
    const getData = allDataUser.filter(
      (item) =>
        (item.departement === userData[0].departement && item.role === 3) ||
        (item.departement === userData[0].departement && item.role === 6)
    );

    // console.log(getData);

    const getDataAdmin = allDataUser.filter(
      (item) => item.role === 1 || item.role === 7
    );

    if (getData.length > 0) {
      setLeadEmail(getData[0].email);
      if (userData[0].role === 3 || userData[0].role === 6) {
        var arr = [];
        getDataAdmin.forEach((x) => arr.push(x.email));
        setLeadEmail(arr);
      }
    } else {
      var newArr = [];
      getDataAdmin.forEach((x) => newArr.push(x.email));
      setLeadEmail(newArr);
    }

    // Get Asset

    let asset = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/getUserAsset/${userData[0].id}/${
      userData[0].departement
    }`;
    await axios
      .get(asset)
      .then((response) => {
        const Asset = response.data.data.inventory;
        var filterUser = Asset.filter(
          (item) => item.type_asset === "user" && item.disposal === false
        );

        // console.log(filterUser);
        var filterDepartement = Asset.filter(
          (item) => item.type_asset === "departement" && item.disposal === false
        );

        filterUser = filterUser.map((item) => ({
          value: item.id,
          name: item.asset_name,
          type_asset: item.type_asset,
          asset_number: item.asset_number,
        }));
        filterDepartement = filterDepartement.map((item) => ({
          value: item.id,
          name: item.asset_name,
          type_asset: item.type_asset,
          asset_number: item.asset_number,
        }));

        const options = [
          {
            type: "group",
            name: "User",
            items: filterUser,
          },
          {
            type: "group",
            name: "Departement",
            items: filterDepartement,
          },
        ];

        setAssetUser(options);
      })
      .catch((error) => {
        console.log(error);
      });

    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/getLatest`;
    // Get Last Id
    await axios
      .get(act_req)
      .then((response) => {
        var text = response.data.data?.act_req[0]?.action_req_code;
        var numb = 0;

        if (text === undefined) {
          numb = parseInt(numb) + 1;
          var str = "" + numb;
          var pad = "000";
          var ans = pad.substring(0, pad.length - str.length) + str;
          setLastNumber(ans);
          return;
        }
        numb = text.match(/\d/g);
        numb = numb.join("");
        numb = parseInt(numb) + 1;
        str = "" + numb;
        pad = "000";
        ans = pad.substring(0, pad.length - str.length) + str;
        setLastNumber(ans);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalPopFilter = () => {
    setModalOpenFilter(true);
  };

  const modalClose = () => {
    setModalOpen(false);
    setModalOpenFilter(false);
  };

  function handleChangeImg(e) {
    const output = document.getElementById("idimg");
    const icon = document.querySelector(".wrapper-img .icon");

    if (e.target.files.length !== 0) {
      icon.style.display = "none";
      output.src = URL.createObjectURL(e.target.files[0]);
      setFiles(e.target.files[0]);
    }

    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkFile = document.getElementById("filesImg");
    const urlHost = window.location.origin;

    if (assetId === null) {
      alert("Please Select 1 Asset");
      return;
    }

    if (checkFile.files.length === 0) {
      alert("Image Must Be Upload");
      return;
    }

    if (descriptionValue === null) {
      alert("Please Fill Description");
      return;
    }

    if (descriptionValue.length < 10) {
      alert("Please Fill Description Min 10 Character");
      return;
    }
    document.getElementById("overlay").style.display = "block";

    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/ticket`;

    const imageFormData = new FormData();
    if (checkFile.files.length > 0) {
      imageFormData.append("picture_req", files);
    }

    imageFormData.append("action_req_code", `MKDAR${lastNumber}`);
    imageFormData.append("action_req_description", descriptionValue);
    imageFormData.append("asset_id", parseInt(assetId));
    imageFormData.append("user_id", parseInt(userData[0].id));
    imageFormData.append("username", userData[0].name);
    imageFormData.append("email", userData[0].email);
    imageFormData.append("departement_id", parseInt(userData[0].departement));
    imageFormData.append(
      "status_id",
      userData[0].role === 3 ? 12 : userData[0].role === 6 ? 12 : 10
    );
    imageFormData.append("lead", leadEmail);
    imageFormData.append("url", urlHost);

    await axios
      .post(act_req, imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert(response.data.status);
        if (userData[0].role === 3 || userData[0].role === 6) {
          const log_data = {
            request_number: `MKDAR${lastNumber}`,
            asset_number: localStorage.getItem("asset_number"),
            asset_name: localStorage.getItem("asset_name"),
            status_ar: 12,
            request_by: userData[0].name,
            status_user: userData[0].employe,
            departement_user: userData[0].depart_id.departement_name,
            subdepartement_user:
              userData[0].subdepart_id !== undefined
                ? userData[0].subdepart_id.subdepartement_name
                : "none",
            role_user: userData[0].role_id.role_name,
            area_user:
              userData[0].area_id.area_name +
              "-" +
              userData[0].area_id.alias_name,
            ticketCreated: Date.now(),
          };

          const Logs = `${logsEndPoint[0].url}${
            logsEndPoint[0].port !== "" ? ":" + logsEndPoint[0].port : ""
          }/api/v1/logs-login/history-ar`;

          axios.post(Logs, log_data);
        }

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = (e) => {
    var typingTimer; //timer identifier
    var doneTypingInterval = 10000;
    clearTimeout(typingTimer);
    var value = e.target.value;
    if (value) {
      typingTimer = setTimeout(doneTyping(value), doneTypingInterval);
    }
  };

  function doneTyping(value) {
    SetSearchValue(value);
  }

  const handleFilterData = (e) => {
    e.preventDefault();
    var arr = [];
    arr.push(valueStatus);
    arr.push(selectedDate);
    arr.push(selectedDate2);
    setSearchValueFilter(arr);
    setTimeout(() => {
      setModalOpenFilter(false);
    }, 2000);
  };

  const handleResetFilter = () => {
    setSearchValueFilter(["reset"]);
    SetSearchValue("");
    setValueStatus("");
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form onSubmit={handleSubmit} enctype="multipart/form-data">
            <div className="row">
              <div className="col-12">
                <h3>Create Action Request</h3>
              </div>
            </div>
            <Divider />
            <br />
            <div className="row margin-top">
              <div className="col-6">
                <label htmlFor="">My Asset</label>
                <SelectSearch
                  ref={searchInput}
                  options={assetUser}
                  filterOptions={handleFilter}
                  name="Asset"
                  placeholder="Choose Asset"
                  search
                  onChange={handleChange}
                />
              </div>
              <div className="col-6">
                <label htmlFor="">Description Of Problem(Chronological)</label>
                <textarea
                  className="form-input-area"
                  value={descriptionValue}
                  onChange={(e) => setDescriptionValue(e.target.value)}
                  cols="30"
                  rows="10"></textarea>
              </div>
            </div>
            <div className="row">
              <div className="col-6 position-image">
                <label htmlFor="filesImg" id="labelImg">
                  Image
                </label>
                <input
                  accept="image/jpg,image/png,image/jpeg"
                  type="file"
                  className="image-req"
                  id="filesImg"
                  onChange={handleChangeImg.bind(this)}
                />
                <div className="wrapper-img" onClick={handleImage}>
                  <div className="image">
                    <img id="idimg" />
                  </div>
                  <div class="icon">
                    <i class="iconify" data-icon="bi:image"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.alertImage}>
              <p>Screenshot problem or Photo the problem is a must</p>
            </div>

            <div className="footer-modal-ar">
              <button className={"btn-cancel"} onClick={modalClose}>
                Cancel
              </button>
              <button className={"btn-submit"} type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Fade>
      <div id="overlay">
        <Loader
          className="loading-data"
          type="Rings"
          color="#CECECE"
          height={550}
          width={80}
        />
      </div>
    </>
  );

  const bodyModalFilter = (
    <>
      <Fade in={modalOpenFilter}>
        <div className={classes.paperFilter}>
          <div className="row">
            <div className="col-8">
              <h2>Filter</h2>
            </div>
            <div className="col-4">
              <a class="close-btn" role="button" onClick={modalClose}>
                &times;
              </a>
            </div>
          </div>
          <form onSubmit={handleFilterData}>
            <div className="row">
              <div className="col-12">
                <label htmlFor="">Status</label>
                <SelectSearch
                  options={dataStatus}
                  value={dataStatus}
                  onChange={(e) => {
                    setValueStatus(e);
                  }}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Status"
                />
              </div>
            </div>
            <div className="row margin-top-2">
              <div className="col-5">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="Date"
                    format="dd/MM/yyyy"
                    value={selectedDate}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={(date) => handleDateChange(date)}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div className="col-2">
                <label
                  htmlFor=""
                  style={{
                    position: "absolute",
                    right: "48%",
                    bottom: "35%",
                    fontSize: "18px",
                    color: "#8b8787",
                  }}>
                  To
                </label>
              </div>
              <div className="col-5">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="Date"
                    format="dd/MM/yyyy"
                    value={selectedDate2}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={(date) => handleDateChange2(date)}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>

            <br />
            <br />
            <div className="footer-modal">
              <button
                type="button"
                className={"btn-reset-filter"}
                onClick={handleResetFilter}>
                Reset
              </button>
              <button className={"btn-filter"} type={"submit"}>
                Filter
              </button>
            </div>
          </form>
          <br />
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <div className={classes.toolbar} />
      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            Action Request
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="card">
            <div className="row">
              <div className="col-4">
                <div className="input-container">
                  <span
                    className="iconify icon"
                    data-icon="bx:bx-search"></span>
                  <input
                    onChange={handleSearch}
                    className="input-field"
                    type="text"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="col-4">
                <button className="filter-btn" onClick={modalPopFilter}>
                  Filter
                </button>
              </div>
              <div className="col-4">
                <Button
                  onClick={modalPop}
                  variant="contained"
                  color="primary"
                  className={classes.buttonAdd}
                  startIcon={<AddIcon />}>
                  Create New
                </Button>
              </div>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={12}>
          <div className="row">
            <TableActionReq
              searchValue={searchValue}
              filterValue={searchValueFilter}
            />
          </div>
        </Grid>
      </Grid>
      <Modal
        open={modalOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModal}
      </Modal>
      <Modal
        open={modalOpenFilter}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModalFilter}
      </Modal>
    </>
  );
};

export default ActionReq;
