import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Breadcrumbs, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";

export const Breadcrumb = () => {
  let [breadCrumbItems, setBreadCrumbItems] = useState([
    { to: "/", name: "Cafes" },
  ]);
  let location = useLocation();

  useEffect(() => {
    if (location.pathname == "/") {
      setBreadCrumbItems([{ to: "/", name: "Cafes" }]);
    } else {
      setBreadCrumbItems([{ to: "/", name: "Cafes" }, { name: "Employees" }]);
    }
  }, [location]);

  return (
    <Breadcrumbs aria-label="breadcrumb" style={{ padding: "10px" }}>
      {breadCrumbItems &&
        breadCrumbItems.map((item) => {
          return (
            <Link color="inherit" to={item.to} key={item.name}>
              {item.name}
            </Link>
          );
        })}
    </Breadcrumbs>
  );
};
