import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { authEndPoint } from "../../assets/menu";
import Routes from "../routes/Routes";
import clsx from "clsx";
import axios from "axios";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  makeStyles,
  Avatar,
  // ListItem,
  // ListItemText,
  // ListItemIcon,
  // Divider,
  // Collapse,
} from "@material-ui/core";

// import InboxIcon from "@material-ui/icons/MoveToInbox";
// import ExpandLess from "@material-ui/icons/ExpandLess";
// import ExpandMore from "@material-ui/icons/ExpandMore";
// import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
// import NotificationsIcon from "@material-ui/icons/Notifications";
import classNames from "classnames";
import logo from "../../assets/new_logo.png";
// import user from "../../assets/img.jpg";
import "../../assets/master.css";
import { menuData, menuDataUser, menuDataUser2 } from "../../assets/menu.js";
import { BrowserRouter } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "#1653A6",
    boxShadow: "none",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    boxShadow: "none",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    width: `100%`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  grow: {
    flexGrow: 1,
  },
  avasmall: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  nested: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(4),
    },
    marginLeft: theme.spacing(0),
  },
  active: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  username: {
    marginLeft: theme.marginAppbar,
    marginRight: theme.marginAppbar,
    fontSize: "12px",
    cursor: "pointer",
    color: "#fff",
    "&:hover": {
      color: "#ffffff9c",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "14px",
    },
  },

  hide: {
    display: "none",
  },
  drawer: {
    boxShadow: "none",
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },

  logo: {
    width: "120px",
    height: "40px",
    [theme.breakpoints.up("sm")]: {
      marginRight: "50px",
    },
    marginRight: "40px",
  },
  drawerOpen: {
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    background: "#fff",
    border: "none",
    zIndex: 1251,
    width: drawerWidth + 30,
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
    },

    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  nestedClose: {
    marginLeft: theme.spacing(0),
  },
  drawerClose: {
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    background: "#fff",
    border: "none",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(0) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(16) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: theme.spacing(0) + 1,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(15) + 1,
    },
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up("sm")]: {
      marginLeft: drawerWidth,
    },
  },

  notifarea: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    position: "relative",
  },
  totnotif: {
    position: "absolute",
    bottom: "20px",
    right: "15px",
    zIndex: 2,
    background: "#000",
    color: "#fff",
    height: "20px",
    width: "20px",
    textAlign: "center",
    borderRadius: "50%",
  },
  drawerButton: {
    marginRight: theme.spacing(-1),
  },
  sideBar: {
    marginTop: theme.spacing(4),
  },

  // collapseStyle: {
  //   position: "absolute",
  //   right: "20px",
  // },
}));

const PersistentDrawer = (props) => {
  const { userID, userRole, tokenUser } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [inactive, setInactive] = useState(false);
  const [menuDatas, setMenuDatas] = useState([]);
  const [userLogin, setUserLogin] = useState([]);

  const roleUser = userRole;
  const userId = userID;
  const token = tokenUser;

  useEffect(() => {
    if (token) {
      getDataUser();
    }
    if (roleUser === "1") {
      setMenuDatas(menuData);
    } else if (roleUser === "2") {
      setMenuDatas(menuDataUser);
    } else {
      setMenuDatas(menuDataUser2);
    }

    // document.addEventListener("contextmenu", (e) => {
    //   e.preventDefault();
    // });
  }, []);

  // const checkUser = () => {
  //   if (roleUser === undefined) {
  //     const URL = `${authEndPoint[0].url}${
  //       authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
  //     }/api/v1/auth/logout`;

  //     (async () => {
  //       let apiRes = null;
  //       try {
  //         apiRes = await axios
  //           .get(`${URL}`, {
  //             headers: { Authorization: `Bearer ${token}` },
  //           })
  //           .then((response) => {
  //             cookies.remove("token", { path: "/" });
  //             cookies.remove("uuid", { path: "/" });
  //             cookies.remove("role", { path: "/" });
  //           })
  //           .catch((error) => {
  //             console.log(error.response.status);
  //           });
  //       } catch (err) {
  //         console.log(err);
  //         apiRes = err.response;
  //       } finally {
  //         console.log(apiRes);
  //       }
  //     })();
  //   }
  // };

  const getDataUser = async () => {
    const URL = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;
    await axios
      .get(URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        let Users = response.data.data.users;
        const UserLogin = Users.find((item) => item.id === parseInt(userId));
        UserLogin.password = undefined;
        setUserLogin(UserLogin);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // const handleClick = () => {
  //   SetCollapse(!collapse);
  // };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function menuToggle() {
    const toggleMenu = document.querySelectorAll(".menu-drop");
    toggleMenu[0].classList.toggle("active");
  }

  const handleLogOut = async () => {
    const URL = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/logout`;

    await axios
      .get(URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        cookies.remove("token", { path: "/" });
        cookies.remove("uuid", { path: "/" });
        cookies.remove("role", { path: "/" });
        setUserLogin([]);
        setTimeout(() => {
          window.location.assign("/");
        }, 1500);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <BrowserRouter>
      <div>
        <AppBar
          color="inherit"
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}>
              <MenuIcon style={{ fill: "white" }} />
            </IconButton>
            <Typography variant="h6" noWrap></Typography>
            <div className={classes.grow} />
            {/* <div className={classes.notifarea}>
              <span className={classes.totnotif}>4</span>
              <NotificationsIcon />
            </div> */}
            <div className="menu-action">
              <div className="profile" onClick={menuToggle}>
                <Avatar className={classes.avasmall}>
                  {userLogin.username
                    ? userLogin.username.substring(0, 1)
                    : null}
                </Avatar>
                {/* <Avatar alt="User" src={user} className={classes.avasmall} /> */}
                <div className={classes.username}>{userLogin.username}</div>
              </div>
              <div className="menu-drop">
                <h3>
                  {userLogin.email}
                  <br />
                  <span>{userLogin.username}</span>
                </h3>
                <ul>
                  <li>
                    <i class="iconify iconMenu" data-icon="gg:profile"></i>
                    <button
                      onClick={() =>
                        (window.location.href = `${
                          window.location.protocol + "//" + window.location.host
                        }/profile`)
                      }>
                      Profile
                    </button>
                  </li>
                  <li>
                    <i class="iconify iconMenu" data-icon="uil:signout"></i>
                    <button onClick={handleLogOut}>Log Out</button>
                  </li>
                </ul>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}>
          <div className={classes.toolbar}>
            <img className={classes.logo} src={logo} alt="" />
            <IconButton onClick={handleDrawerClose}>
              <MenuIcon
                style={{ fill: "#1653A6" }}
                className={classes.drawerButton}
              />
            </IconButton>
          </div>

          <List className={classes.sideBar}>
            {menuDatas.map((menuItems, index) => (
              <MenuItem
                key={index}
                name={menuItems.name}
                exact={menuItems.exact}
                to={menuItems.to}
                id={menuItems.id}
                icon={menuItems.icon}
                subMenus={menuItems.subMenus || []}
                onClick={() => {
                  if (inactive) {
                    setInactive(!inactive);
                  }
                }}
              />
            ))}

            {/* {menuData.map((menuData, index) => {
              return (
                <>
                  <ListItem
                    key={index}
                    button
                    component={Link}
                    to={menuData.to}
                    className={classes.sideBar}
                    onClick={
                      menuData.subMenus && menuData.subMenus.length > 0
                        ? () => SetCollapse(!collapse)
                        : () => {}
                    }>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={menuData.name} />
                    {menuData.subMenus && menuData.subMenus.length > 0 ? (
                      <>
                        {collapse ? (
                          <ExpandLess className={classes.collapseStyle} />
                        ) : (
                          <ExpandMore className={classes.collapseStyle} />
                        )}
                      </>
                    ) : null}
                  </ListItem>

                  
                </>
              );
            })} */}

            {/* <ListItem selected onClick={handleClick}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
              {collapse ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={collapse} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={clsx(classes.nested, {
                    [classes.nestedClose]: !open,
                  })}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dropdown" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button component={Link} to="/status">
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Status"} />
            </ListItem> */}
          </List>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}>
          <Routes />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default PersistentDrawer;
