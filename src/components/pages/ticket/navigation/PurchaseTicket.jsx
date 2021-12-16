import { makeStyles, Grid } from "@material-ui/core";

import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../../../asset/chips.css";

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

const PurchaseTicket = () => {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h3>Purchase Information</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">PR No</p>
              <p>412312312</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Po No</p>
              <p> - </p>
            </div>

            <div className="col-3">
              <p className="label-asset">Status</p>
              <p className="">
                <span
                  class="chip-action"
                  style={{
                    background: `#EC91084C`,
                    color: `#EC9108FF`,
                  }}>
                  Waiting
                </span>
              </p>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">PR Date</p>
              <p>10 Dec 2021</p>
            </div>
            <div className="col-3">
              <p className="label-asset">PO Date</p>
              <p> - </p>
            </div>
            <div className="col-3">
              <p className="label-asset">Request No</p>
              <p>43253422</p>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </Grid>
    </>
  );
};

export default PurchaseTicket;
