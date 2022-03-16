import React, { useState, useEffect } from "react";
// import {
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
// } from "@material-ui/core";
// import InboxIcon from "@material-ui/icons/MoveToInbox";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

// function importAll(r) {
//   let images = {};
//   r.keys().map((item, index) => {
//     images[item.replace("./", "")] = r(item);
//   });
//   return images;
// }

// const images = importAll(
//   require.context("../../assets/svg_icon", false, /\.(png|jpe?g|svg)$/)
// );

// const SidebarItem = (props) => {
//   const { name, subMenus, to, exact, index, id, onClick } = props;
//   const [expand, setExpand] = useState(false);

//   const handleClick = () => {
//     alert("hello");
//   };

//   if (subMenus && subMenus.length > 0) {
//     return (
//       <li></li>
//     );
//   }
//   return (
//     <ListItem button component={Link} exact={exact} to={to}>
//       <ListItemIcon>
//         <InboxIcon />
//       </ListItemIcon>
//       <ListItemText primary={name} />
//     </ListItem>
//   );
// };

const MenuItem = (props) => {
  const { name, subMenus, to, exact, icon } = props;
  const [expand, setExpand] = useState(false);
  // const [pathName] = useState(window.location.pathname);

  // useEffect(() => {
  //   // console.log(pathName);
  // }, []);

  const liRef = React.useRef(null);

  const handler = () => {
    for (const li of document.querySelectorAll("ul.sub-menu.active")) {
      li.classList.remove("active");
    }

    setExpand(!expand);
  };

  const activeItem = subMenus.findIndex(
    (item) => item.to === window.location.pathname
  );

  return (
    <>
      <li className="main-menu">
        <NavLink
          exact={exact}
          to={to || {}}
          className="menu-item"
          onClick={handler}>
          <div className="menu-icon">
            <i className="iconify" data-icon={icon}></i>
          </div>
          <span>{name}</span>

          {subMenus && subMenus.length > 0 ? (
            <>
              {expand ? (
                <ExpandLess className="expand-more" />
              ) : (
                <ExpandMore className="expand-more" />
              )}
            </>
          ) : null}
        </NavLink>
        <ul ref={liRef} className={`sub-menu ${expand ? "active" : ""}`}>
          {subMenus.map((menu, index) => (
            <li key={index}>
              <NavLink to={menu.to || {}}>
                {/* <span
                  data-icon={"mdi:inbox-arrow-down"}
                  className="menu-icon iconify"
                /> */}

                <div className={`menu-icon`}>
                  {/* <img src={images["fluent_database.svg"].default} alt="icon" /> */}
                  <i className="iconify" data-icon={menu.icon}></i>
                </div>

                <span>{menu.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </li>
    </>
  );
};

export default MenuItem;
