import { ThemeProvider, createTheme, makeStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import React, { useEffect } from "react";
import PersistentDrawer from "./components/layout/PersistentDrawer";
import Auth from "./components/pages/Auth";
import Cookies from "universal-cookie";
import { authEndPoint } from "./assets/menu";
import axios from "axios";

const cookies = new Cookies();
const breakpoints = createBreakpoints({});
const authToken = cookies.get("token");
const roleUser = cookies.get("role");
const ID = cookies.get("id");

const checkUser = () => {
  if (roleUser === undefined) {
    const URL = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/logout`;

    (async () => {
      let apiRes = null;
      try {
        apiRes = await axios
          .get(`${URL}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          .then((response) => {
            cookies.remove("token", { path: "/" });
            cookies.remove("uuid", { path: "/" });
            cookies.remove("role", { path: "/" });
          })
          .catch((error) => {
            console.log(error.response.status);
          });
      } catch (err) {
        console.log(err);
        apiRes = err.response;
      } finally {
        console.log(apiRes);
      }
    })();
  }
};

const useStyles = makeStyles({
  root: {
    height: "100vh",
    background: authToken ? "#E5E5E5" : "#1653A6",
  },
});

const App = () => {
  const theme = createTheme({
    spacing: 4,
    palette: {
      primary: {
        main: "#1653A6",
      },
      secondary: {
        main: "#EC9108",
      },
      error: {
        main: "#EB5757",
      },
    },

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xlm: 1440,
        xl: 1700,
      },
    },

    marginAppbar: "10px",
    theadColor: "#1653A6",
    overrides: {
      MuiTableCell: {
        root: {
          [breakpoints.down("lg")]: {
            fontSize: "12px",
          },
        },
      },
      MuiListItem: {
        root: {
          width: "280px",
          minWidth: "280px",
          margin: "30px auto -15px auto",
          cursor: "pointer",

          "&:hover": {
            borderRadius: "10px",
            boxShadow: "0 0 6px hsl(210 14% 90%)",
          },
          "&$selected": {
            borderRadius: "10px",
            boxShadow: "0 0 6px hsl(210 14% 90%)",
          },
        },
      },
      MuiCheckbox: {
        colorSecondary: {
          color: "#C1C1C1",
          // "&$checked": {
          //   color: "#1653A6",
          // },
        },
      },
    },
  });

  const classes = useStyles();

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        {!authToken ? (
          <Auth />
        ) : (
          <PersistentDrawer
            userID={ID}
            userRole={roleUser}
            tokenUser={authToken}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
