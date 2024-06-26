import { Card, CardContent, Icon, Typography } from "@mui/material";
import { FC, ReactElement } from "react";
import useStyles from "./SwitchBar.styles";

const getIconElem = (icon: string | false): ReactElement => {
    return icon ? (
        <Icon style={{ fontSize: "250%" }} className="material-icons">
            {icon}
        </Icon>
    ) : (
        <i></i>
    );
};

type Props = {
    leftButton: ReactElement;
    rightButton: ReactElement;
    icon: string | false;
    label: string;
    labelAction: (() => void) | false;
};

/**
 * Bar with a left and right button to switch states
 * @param leftButton
 * @param rightButton
 * @param iconElem
 * @param label
 * @returns {*}
 * @constructor
 */
const SwitchBar: FC<Props> = ({
    leftButton,
    rightButton,
    icon,
    label,
    labelAction,
}) => {
    const { classes } = useStyles();
    return (
        <Card className={classes.card}>
            <CardContent
                className={classes.buttonGroup}
                data-testid={`switchbar-${label}`}
            >
                {leftButton}
                <span className={classes.label}>
                    {getIconElem(icon)}
                    {labelAction ? (
                        <Typography onClick={labelAction}>{label}</Typography>
                    ) : (
                        label
                    )}
                </span>
                {rightButton}
            </CardContent>
        </Card>
    );
};

export default SwitchBar;
