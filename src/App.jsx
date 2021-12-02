import { ThemeProvider, createTheme, makeStyles } from "@material-ui/core";
import PersistentDrawer from "./components/layout/PersistentDrawer";
import Auth from "./components/pages/Auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const authToken = cookies.get("token");

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
    },
    marginAppbar: "10px",
    theadColor: "#1653A6",
    overrides: {
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
    },
  });

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        {!authToken ? <Auth /> : <PersistentDrawer />}
      </div>
    </ThemeProvider>
  );
};

export default App;
