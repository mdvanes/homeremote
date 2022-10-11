import React, { FC } from "react";
import theme from "../../../theme";
import {
    AppBar,
    Box,
    Container,
    Grid,
    IconButton,
    ThemeProvider as MuiThemeProvider,
    StyledEngineProvider,
    Toolbar,
    Typography,
} from "@mui/material";
import { Skeleton } from "@mui/lab";
import MenuIcon from "@mui/icons-material/Menu";

const AppSkeleton: FC = () => (
    <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        size="large"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">HomeRemote</Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl">
                <Box mt={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Skeleton variant="rectangular" height={300} />
                        </Grid>
                        <Grid item xs={12} md>
                            <Skeleton variant="rectangular" height={300} />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Skeleton variant="rectangular" height={300} />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Skeleton variant="rectangular" height={300} />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </MuiThemeProvider>
    </StyledEngineProvider>
);

export default AppSkeleton;
