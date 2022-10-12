import { createTheme, PaletteMode, ThemeOptions } from "@mui/material";
import { blue, lightBlue, orange } from "@mui/material/colors";

const darkThemeOptions: ThemeOptions = {
    palette: {
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
};

const lightThemeOptions: ThemeOptions = {
    palette: {
        primary: blue,
        secondary: orange,
        background: {
            default: "#ccc",
        },
    },
};

const createThemeWithMode = (mode: PaletteMode) =>
    createTheme({
        ...(mode === "dark" ? darkThemeOptions : lightThemeOptions),
        palette: {
            mode,
            ...(mode === "dark"
                ? darkThemeOptions.palette
                : lightThemeOptions.palette),
        },
    });

export default createThemeWithMode;
