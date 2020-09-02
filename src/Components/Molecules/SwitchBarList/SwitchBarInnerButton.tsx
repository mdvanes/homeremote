import React, { FC } from "react";
import { Icon } from "@material-ui/core";
import { deepPurple, indigo } from "@material-ui/core/colors";
import useStyles from "./SwitchBarInnerButton.styles";

// TODO replace by WithStyles -> palette.color.primary instead of using deepPurple directly
const getActiveStyle = (isActive: boolean): React.CSSProperties => ({
    backgroundColor: isActive ? indigo[500] : "transparent",
});

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
    const classes = useStyles(isActive);
    return (
        <button
            onClick={isReadOnly ? undefined : clickAction}
            // style={getActiveStyle(isActive)}
            className={classes.root}
        >
            {isReadOnly ? (
                <div className="dummy"></div>
            ) : (
                // TODO set hoverColor={deepPurple[900]} on Icon or on button?
                <Icon className="material-icons">{icon}</Icon>
            )}
        </button>
    );
};

export default SwitchBarInnerButton;
