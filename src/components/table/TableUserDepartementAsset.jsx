import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import axios from "axios";
import { pathEndPoint } from "../../assets/menu";
import AddIcon from "@material-ui/icons/Add";

import Loading from "../asset/Loading";
import {
  Toolbar,
  Checkbox,
  useTheme,
  makeStyles,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  withStyles,
  Typography,
  Button,
  Fade,
  Modal,
  Backdrop,
} from "@material-ui/core";
import "../../assets/master.css";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page">
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page">
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page">
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles((theme) => ({
  table: {
    marginTop: "20px",
    minWidth: 400,
    width: "100%",
    overflowX: "auto",
  },

  posPagination: {
    position: "absolute",
    [theme.breakpoints.up("xl")]: {
      right: "30px",
      marginTop: "20px",
    },
    [theme.breakpoints.down("lg")]: {
      right: "30px",
      marginTop: "20px",
    },
  },

  tableWidth: {
    margin: "auto",
    width: "100%",
  },
  theadDispos: {
    "& th": {
      color: "black",
      backgroundColor: "white",
    },
  },

  paperTble: {
    height: "580px",
  },

  thead: {
    "& th": {
      backgroundColor: theme.theadColor,
    },
    "& th:first-child": {
      borderRadius: "0.5em 0 0 0",
    },
    "& th:last-child": {
      borderRadius: "0 0.5em 0 0",
    },
  },
  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "30%",
    left: "50%",
    width: 550,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
  buttonAdd: {
    [theme.breakpoints.up("xl")]: {
      width: "150px",
      left: "35%",
      top: "8px",
    },

    [theme.breakpoints.down("lg")]: {
      width: "140px",
      height: "38px",
      left: "-18%",
      top: "8px",
      fontSize: 11,
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "20px",
      width: "120px",
    },
    fontSize: 12,
    height: "50px",
  },
}));

const TableUserDepartementAsset = () => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  //   const [dataArea, setDataArea] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState({});

  const dataAssetDepart = [
    {
      id: "1",
      asset_no: "MKD00129",
      asset_name: "Printer",
      unit_part: "part",
      category: "Hardware",
      sub_category: "Laptop",
    },
    {
      id: "2",
      asset_no: "MKD00129",
      asset_name: "Macbook",
      unit_part: "part",
      category: "Hardware",
      sub_category: "Laptop",
    },
    {
      id: "3",
      asset_no: "MKD00129",
      asset_name: "Macbook",
      unit_part: "unit",
      category: "Hardware",
      sub_category: "Laptop",
    },
    {
      id: "4",
      asset_no: "MKD00129",
      asset_name: "Macbook",
      unit_part: "part",
      category: "Hardware",
      sub_category: "Laptop",
    },
    {
      id: "5",
      asset_no: "MKD00129",
      asset_name: "Macbook",
      unit_part: "part",
      category: "Hardware",
      sub_category: "Laptop",
    },
    {
      id: "6",
      asset_no: "MKD00129",
      asset_name: "Macbook",
      unit_part: "part",
      category: "Hardware",
      sub_category: "Laptop",
    },
  ];

  const toggleAllSelected = (e) => {
    const { checked } = e.target;
    setAllSelected(checked);

    dataAssetDepart &&
      setSelected(
        dataAssetDepart.reduce(
          (selected, { id }) => ({
            ...selected,
            [id]: checked,
          }),
          {}
        )
      );
  };

  const toggleSelected = (id) => (e) => {
    if (!e.target.checked) {
      setAllSelected(false);
    }

    setSelected((selected) => ({
      ...selected,
      [id]: !selected[id],
    }));
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const isAllSelected = selectedCount === dataAssetDepart.length;

  const isIndeterminate =
    selectedCount && selectedCount !== dataAssetDepart.length;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, dataAssetDepart.length - page * rowsPerPage);

  return (
    <>
      <TableContainer className={classes.tableWidth}>
        <Paper className={classes.paperTble}>
          <Toolbar>
            <div className="col-10">
              <Typography
                variant="h5"
                component="div"
                style={{ marginTop: "5px" }}>
                Asset Departement
              </Typography>
            </div>
            <div className="col-2">
              <Button
                className={classes.buttonAdd}
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}>
                Create New
              </Button>
            </div>
          </Toolbar>
          <div className="display-disposal">
            {selectedCount > 0 ? (
              <>
                <span style={{ marginRight: "5px" }}>( </span>
                <span className="count">{selectedCount}</span>
                <span className="selected">Selected Item )</span>
              </>
            ) : null}

            <button className="btn-disposal">Disposal</button>
          </div>

          <Table
            className={classes.table}
            size="medium"
            aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell padding="checkbox" style={{ width: 50 }}>
                  <Checkbox
                    checked={allSelected || isAllSelected} // <-- all selected
                    onChange={toggleAllSelected} // <-- toggle state
                    indeterminate={isIndeterminate} // <-- some selected
                  />
                </StyledTableCell>
                <StyledTableCell>Asset No</StyledTableCell>
                <StyledTableCell>Asset Name</StyledTableCell>
                <StyledTableCell>Unit/Parts</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Sub Category</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataAssetDepart.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataAssetDepart
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell padding="checkbox" style={{ width: 50 }}>
                      <Checkbox
                        checked={selected[row.id] || allSelected} // <-- is selected
                        onChange={toggleSelected(row.id)} // <-- toggle state
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_no}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.unit_part}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.category}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.sub_category}
                    </TableCell>
                    <TableCell align="center">
                      <button className="btn-edit" onClick={(e) => {}}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ci:edit"></span>
                        <span className="name-btn">Edit</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 10 * emptyRows }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
            )}

            <TableFooter className={classes.posPagination}>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={dataAssetDepart.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </TableContainer>
    </>
  );
};

export default TableUserDepartementAsset;
