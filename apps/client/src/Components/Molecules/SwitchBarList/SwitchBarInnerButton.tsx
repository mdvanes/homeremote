import React, { FC } from "react";
import { Icon } from "@mui/material";
import useStyles from "./SwitchBarInnerButton.styles";

type Props = {
    isReadOnly: boolean;
    clickAction: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
    icon: string;
    isActive: boolean;
};

const SwitchBarInnerButton: FC<Props> = ({
    isReadOnly,
    clickAction,
    icon,
    isActive,
}) => {
    const { classes } = useStyles();
    return (
        <button
            onClick={isReadOnly ? undefined : clickAction}
            className={isActive ? classes.active : classes.root}
        >
            {isReadOnly ? (
                <div className="dummy"></div>
            ) : (
                <Icon className="material-icons">{icon}</Icon>
            )}
        </button>
    );
};

export default SwitchBarInnerButton;
