import {
    Icon,
    IconButton,
    ListItemButton,
    ListItemIcon,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { makeStyles } from "tss-react/mui";
import { customIconMap } from "./customIcons";

const useStyles = makeStyles()(({ palette }) => ({
    icon: {
        color: palette.primary.main,
    },
}));

interface Props {
    label: string;
    iconName: string;
    url: string;
    children?: ReactNode;
}

export const ServiceLink: FC<Props> = ({ label, iconName, url, children }) => {
    const { classes: buttonClasses } = useStyles();
    const customIcon = customIconMap[iconName];
    const isBig = useMediaQuery<Theme>((theme) => theme.breakpoints.up("md"));
    const iconResult = (
        <>{children || customIcon || <Icon>{iconName}</Icon>} </>
    );
    return (
        <Tooltip title={label} aria-label={label.toLowerCase()}>
            {isBig ? (
                <IconButton
                    className={buttonClasses.icon}
                    component="a"
                    href={url}
                    size="large"
                >
                    {iconResult}
                </IconButton>
            ) : (
                <ListItemButton component="a" href={url}>
                    <ListItemIcon className={buttonClasses.icon}>
                        {iconResult}
                    </ListItemIcon>
                    <Typography>{label}</Typography>
                </ListItemButton>
            )}
        </Tooltip>
    );
};
