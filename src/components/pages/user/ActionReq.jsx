import React, { useEffect, useState, useRef } from "react";
import Loader from "react-loader-spinner";
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
import SelectSearch from "react-select-search";
import "../../../assets/select-search.css";
import axios from "axios";
import TableActionReq from "../../table/user/TableActionReq";
import { authEndPoint, pathEndPoint, invEndPoint } from "../../../assets/menu";
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
}));

// const readImg = (file) => {
//   if (file.files && file.files[0]) {
//     var reader = new FileReader();
//     console.log(reader);
//   }
// };

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

  const handleChange = (args) => {
    setAssetId(args);
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
  }, []);

  const getUserList = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    await axios
      .get(user, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const DataUser = response.data.data.users;
        const AllData = DataUser.map((item) => ({
          id: item.id,
          name: item.username,
          role: item.role,
          departement: item.departement,
          subdepartement: item.subdepartement,
          area: item.area,
          email: item.email,
        }));

        setAllDataUser(AllData);

        var getID = DataUser.filter((item) => item.id === parseInt(userID));
        getID = getID.map((item) => ({
          id: item.id,
          name: item.username,
          role: item.role,
          departement: item.departement,
          subdepartement: item.subdepartement,
          area: item.area,
          email: item.email,
        }));
        setUserData(getID);
      })
      .catch((error) => {
        console.log(error);
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

    const getDataAdmin = allDataUser.filter((item) => item.role === 1);

    if (getData.length > 0) {
      setLeadEmail(getData[0].email);
      if (userData[0].role === 3) {
        var arr = [];
        getDataAdmin.forEach((x) => arr.push(x.email));
        setLeadEmail(arr);
      }
    } else {
      setLeadEmail("it@markindo.co.id");
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
        }));
        filterDepartement = filterDepartement.map((item) => ({
          value: item.id,
          name: item.asset_name,
          type_asset: item.type_asset,
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

  const modalClose = () => {
    setModalOpen(false);
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
    imageFormData.append("status_id", userData[0].role === 3 ? 12 : 10);
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
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });

    // console.log(checkFile.files);

    // console.log(files);
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
                    className="input-field"
                    type="text"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="col-4">
                <button className="filter-btn">Filter</button>
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
            <TableActionReq />
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
    </>
  );
};

export default ActionReq;
