import React, { FC } from "react";
import theme from "../../../theme";
import {
    AppBar,
    Box,
    Container,
    Grid,
    IconButton,
    MuiThemeProvider,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MenuIcon from "@material-ui/icons/Menu";

const AppSkeleton: FC = () => (
    <MuiThemeProvider theme={theme}>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6">HomeRemote</Typography>
            </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
            <Box mt={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Skeleton variant="rect" height={300} />
                    </Grid>
                    <Grid item xs={12} md>
                        <Skeleton variant="rect" height={300} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Skeleton variant="rect" height={300} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Skeleton variant="rect" height={300} />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    </MuiThemeProvider>
);

export default AppSkeleton;
