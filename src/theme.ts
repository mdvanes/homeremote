import { createMuiTheme } from "@material-ui/core";
import { indigo, orange } from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: indigo[900],
        },
        secondary: {
            main: orange[400],
        },
        // background: {
        //     // paper: blueGrey[400],
        // },
    },
});

export default theme;
