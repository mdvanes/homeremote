import MenuIcon from "@mui/icons-material/Menu";
import {
    Chip,
    IconButton,
    AppBar as MuiAppBar,
    Toolbar,
    Typography,
} from "@mui/material";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { AuthenticationState } from "../../Providers/Authentication/authenticationSlice";
import AppStatusButton from "../AppStatusButton/AppStatusButton";
import useStyles from "./AppBar.styles";

interface Props {
    toggleDrawer: () => void;
}

const AppBar: FC<Props> = ({ toggleDrawer }) => {
    const { classes } = useStyles();
    const { greeting, loginMethod } = useSelector<
        RootState,
        { greeting: string; loginMethod: AuthenticationState["loginMethod"] }
    >((state: RootState) => ({
        greeting: state.authentication.displayName
            ? `Hi, ${state.authentication.displayName}!`
            : "",
        loginMethod: state.authentication.loginMethod,
    }));
    return (
        <div className={classes.root}>
            <MuiAppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                        size="large"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        className={classes.title}
                        sx={{ display: { xs: "block", sm: "none" } }}
                    >
                        HR
                    </Typography>
                    <Typography
                        variant="h6"
                        className={classes.title}
                        sx={{ display: { xs: "none", sm: "block" } }}
                    >
                        HomeRemote
                    </Typography>
                    <Typography
                        variant="body2"
                        className={classes.currentUser}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        {greeting}
                        {loginMethod === "oidc" && (
                            <Chip
                                label="SSO"
                                size="small"
                                color="secondary"
                                variant="outlined"
                                sx={{
                                    color: "inherit",
                                    borderColor: "currentcolor",
                                }}
                            />
                        )}
                    </Typography>
                    <AppStatusButton />
                </Toolbar>
            </MuiAppBar>
        </div>
    );
};

export default AppBar;
