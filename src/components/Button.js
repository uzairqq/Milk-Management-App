import React from "react";
import { Button } from "reactstrap";

/*Button.jsx */
const ButtonComponent = props => {
  return (
    <Button
      type="submit"
      className={props.class}
      onClick={props.action}
      className={props.class}
      disabled={props.disable}
    >
      {props.title}
    </Button>
  );
};

export default ButtonComponent;
