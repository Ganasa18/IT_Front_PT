import React from "react";

import { Breadcrumbs, Typography } from "@material-ui/core";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import "../../assets/master.css";
import "../../assets/asset_user.css";

const BreadcrumbComponent = ({ textSpan, typographyText, Onclick }) => {
  return (
    <>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span onClick={Onclick} className={"span_crumb"}>
          {textSpan}
        </span>
        <Typography color="textPrimary">{typographyText}</Typography>
      </Breadcrumbs>
    </>
  );
};

export default BreadcrumbComponent;
