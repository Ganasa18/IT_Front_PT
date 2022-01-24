import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Font,
  Image,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";

import {
  makeStyles,
  Grid,
  Breadcrumbs,
  Typography,
  Divider,
} from "@material-ui/core";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";
import TableDisposal from "./TableDisposal";
import ModalGalery from "../../asset/ModalGalery";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

  cardPadding: {
    marginTop: theme.spacing(5),
  },
}));

function calbill(date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var myDate = new Date(date);
  var d = myDate.getDate();
  var m = myDate.getMonth();
  m += 1;
  var y = myDate.getFullYear();

  var newdate = d + " " + monthNames[myDate.getMonth()] + " " + y;
  return newdate;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const DisposalDetail = () => {
  const classes = useStyles();
  const dataStorage = localStorage.getItem("disposalData");
  const parseObject = JSON.parse(dataStorage);
  const [dataDisposal] = useState(parseObject);
  const [modalGaleryOpen, setModalGaleryOpen] = useState(false);

  // Create styles
  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  const borderColor = "#90e5fc";

  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 20,
      textAlign: "center",
      fontFamily: "Oswald",
    },
    author: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: "Oswald",
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },
    logo: {
      width: 145,
      height: 60,
    },

    LogoContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    header: {
      fontSize: 10,
      marginBottom: 20,
      textAlign: "right",
      color: "grey",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
    page: {
      fontFamily: "Helvetica",
      fontSize: 11,
      paddingTop: 30,
      paddingLeft: 35,
      paddingRight: 35,
      lineHeight: 1.5,
      flexDirection: "column",
    },
    invoiceNoContainer: {
      flexDirection: "row",
      marginTop: 20,
      justifyContent: "flex-end",
    },
    invoiceDateContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginRight: 10,
    },
    invoiceDate: {
      fontSize: 12,
      fontStyle: "bold",
    },
    label: {
      width: 80,
    },

    headerContainer: {
      marginTop: 30,
    },

    billTo: {
      marginTop: 20,
      paddingBottom: 3,
      fontFamily: "Helvetica-Oblique",
    },

    tableContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 24,
      borderWidth: 1,
      borderColor: "#1653A6",
    },

    containerTableHeader: {
      flexDirection: "row",
      borderBottomColor: "#1653A6",
      backgroundColor: "#1653A6",
      borderBottomWidth: 1,
      alignItems: "center",
      height: 24,
      textAlign: "center",
      fontStyle: "bold",
      flexGrow: 1,
      color: "#FFF",
    },

    itemNumber: {
      width: "30%",
      borderRightColor: borderColor,
      borderRightWidth: 1,
    },
    itemName: {
      width: "20%",
      borderRightColor: borderColor,
      borderRightWidth: 1,
    },
    typeAsset: {
      width: "20%",
      borderRightColor: borderColor,
      borderRightWidth: 1,
    },
    areaName: {
      width: "20%",
    },

    rowData: {
      flexDirection: "row",
      borderBottomColor: "#1653A6",
      borderBottomWidth: 1,
      alignItems: "center",
      height: 24,
      fontStyle: "bold",
      flexGrow: 1,
      fontSize: "10px",
    },

    assetRowNo: {
      width: "30%",
      borderRightColor: "#1653A6",
      borderRightWidth: 1,
      textAlign: "center",
    },
    assetRowName: {
      width: "20%",
      borderRightColor: "#1653A6",
      borderRightWidth: 1,
      textAlign: "center",
    },
    assetTypeRow: {
      width: "20%",
      borderRightColor: "#1653A6",
      borderRightWidth: 1,
      textAlign: "center",
    },
    assetAreaRow: {
      width: "20%",
      textAlign: "center",
    },
  });

  // Create Document Component
  const MyDocument = ({ dataDs, listDispos }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header} fixed>
          {calbill(Date.now())}
        </Text>
        <View style={styles.LogoContainer}>
          <Image
            style={styles.logo}
            src="https://i.postimg.cc/WbgxY2jX/new-logo-1.png"
          />
        </View>
        <View style={styles.invoiceNoContainer}>
          <Text style={styles.label}>Disposal No:</Text>
          <Text style={styles.invoiceDate}>{dataDs.disposal_code}</Text>
        </View>
        <View style={styles.invoiceDateContainer}>
          <Text style={styles.label}>Created: </Text>
          <Text>{`${calbill(dataDs.createdAt)}`}</Text>
        </View>

        <View style={styles.headerContainer}>
          <Text>Disposal Name &nbsp;: {dataDisposal.disposal_name}</Text>
          <Text>
            Condition &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :{" "}
            {dataDisposal.status_condition.status_name}
          </Text>
          <Text>
            Reason &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;:{" "}
            {dataDisposal.disposal_desc}
          </Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.containerTableHeader}>
            <Text style={styles.itemNumber}>Item No</Text>
            <Text style={styles.itemName}>Item Name</Text>
            <Text style={styles.typeAsset}>User/Dept</Text>
            <Text style={styles.areaName}>Area</Text>
          </View>

          {listDispos.map((item) => (
            <View style={styles.rowData} key={item.id}>
              <Text style={styles.assetRowNo}>{item.asset_number}</Text>
              <Text style={styles.assetRowName}>{item.asset_name}</Text>
              <Text style={styles.assetTypeRow}>
                {capitalizeFirstLetter(item.type_asset)}
              </Text>
              <Text style={styles.assetAreaRow}>
                {" "}
                {`${item.area_name} - ${item.alias_name}`}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );

  // function generatePDF() {
  //   <PDFDownloadLink document={<MyDocument />} fileName="somename.pdf">
  //     {({ blob, url, loading, error }) =>
  //       loading ? "Loading document..." : "Download now!"
  //     }
  //   </PDFDownloadLink>;
  // }

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Breadcrumbs
        onClick={function () {
          const origin = window.location.origin;
          window.location.href = `${origin}/disposal-assets`;
        }}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span className={"span_crumb"}>Disposal Asset</span>
        <Typography color="textPrimary">
          {dataDisposal.disposal_code}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="row">
              <div className="col-2">
                <p className="label-asset">Request Number</p>
                <p>{dataDisposal.disposal_code}</p>
              </div>
              <div className="col-2">
                <p className="label-asset">Disposal Name</p>
                <p>{dataDisposal.disposal_name}</p>
              </div>
              <div className="col-2">
                <p className="label-asset">Condition</p>
                <p>{dataDisposal.status_condition.status_name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Status</p>
                <p>
                  <span
                    class="chip-action"
                    style={{
                      background: `${dataDisposal.status_id.color_status}4C`,
                      color: `${dataDisposal.status_id.color_status}FF`,
                    }}>
                    {dataDisposal.status_id.status_name}
                  </span>
                </p>
              </div>
              <div className="col-3">
                <PDFDownloadLink
                  document={
                    <MyDocument
                      dataDs={dataDisposal}
                      listDispos={JSON.parse(dataDisposal.item_list)}
                    />
                  }
                  fileName={`${dataDisposal.disposal_code}`}>
                  <button className="btn-download-pdf">
                    <span
                      class="iconify icon-btn"
                      data-icon="fe:download"></span>
                    <span className="name-btn">Download PDF</span>
                  </button>
                </PDFDownloadLink>
              </div>
            </div>

            <br />
            <div className="row">
              <div className="col-2">
                <p className="label-asset">Date</p>
                <p>{`${calbill(dataDisposal.createdAt)}`}</p>
              </div>
              <div className="col-2">
                <p className="label-asset">Reason</p>
                <p>{dataDisposal.disposal_desc}</p>
              </div>
              <div className="col-2">
                <p className="label-asset">PIC</p>
                <p>{dataDisposal.user_name}</p>
              </div>
              {dataDisposal.img_list !== null ? (
                <div className="col-2">
                  <p className="label-asset">Image</p>
                  <p>
                    <button
                      className="attachment-view"
                      onClick={() => setModalGaleryOpen(true)}>
                      view
                    </button>
                    <ModalGalery
                      imgList={dataDisposal.img_list}
                      onClose={() => setModalGaleryOpen(false)}
                      show={modalGaleryOpen}
                    />
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <TableDisposal listData={JSON.parse(dataDisposal.item_list)} />
        </Grid>
      </Grid>
    </>
  );
};

export default DisposalDetail;
