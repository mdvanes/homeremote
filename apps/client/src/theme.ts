import { createTheme } from "@mui/material";
import { indigo, orange } from "@mui/material/colors";

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
