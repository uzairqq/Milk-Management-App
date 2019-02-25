import React from "react";
import { Button } from "reactstrap";

/*Button.jsx */
const ButtonComponent = props => {
  return (
    <Button
      type="submit"
      className={props.class}
      onClick={props.action}
      disabled={props.disable}
      size={props.size}
    >
      {props.title}
    </Button>
  );
};

export default ButtonComponent;
