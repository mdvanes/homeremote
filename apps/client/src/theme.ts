import { createTheme } from "@material-ui/core/styles";
import { indigo, orange } from "@material-ui/core/colors";

const theme = createTheme({
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
