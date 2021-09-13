import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

export const MyTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#343a40",
    color: "rgb(255, 217, 0)",
    textAlign: "center",
    fontSize: "1rem",
    border: "1px solid lightblue"
  },
}))(Tooltip);