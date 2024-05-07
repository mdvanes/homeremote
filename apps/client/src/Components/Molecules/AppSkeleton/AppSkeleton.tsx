import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Box,
    Container,
    Grid,
    IconButton,
    ThemeProvider as MuiThemeProvider,
    Skeleton,
    StyledEngineProvider,
    Toolbar,
    Typography,
} from "@mui/material";
import { FC } from "react";
import createThemeWithMode from "../../../theme";

const AppSkeleton: FC = () => (
    <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={createThemeWithMode("dark")}>
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
