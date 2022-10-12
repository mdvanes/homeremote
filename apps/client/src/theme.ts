import { createTheme } from "@mui/material";
import { lightBlue, orange } from "@mui/material/colors";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: lightBlue,
        secondary: orange,
        background: {
            default: "#0a1829",
            paper: "#001e3c",
        },
        text: {
            primary: "#bdbdbd",
        },
    },
    components: {
        MuiToolbar: {
            styleOverrides: {
                root: {
                    color: lightBlue[200],
                },
            },
        },
    },
});

export default theme;
