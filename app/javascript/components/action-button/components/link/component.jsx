// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Link } from "@mui/material";

import { NAME } from "./constants";

function Component({ text, id, ...options }) {
  const { rest, ...remainder } = options;

  if (rest.disabled) {
    return <div className={options.className}>{text}</div>;
  }

  // If no href is provided (e.g., onClick handler), ensure keyboard accessibility
  const linkProps = rest.to || rest.href ? {} : { component: "button", tabIndex: 0 };

  return (
    <Link id={id} underline="hover" {...rest} {...remainder} {...linkProps}>
      {text}
    </Link>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string
};

export default Component;
