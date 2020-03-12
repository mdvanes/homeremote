import React, { FC } from 'react';
import { Icon } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';

// TODO replace by WithStyles -> palette.color.primary instead of using deepPurple directly
const getActiveStyle = (isActive: boolean): React.CSSProperties => ({
    backgroundColor: isActive ? deepPurple[500] : 'transparent'
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
    isActive
}) => {
    return (
        <button
            onClick={isReadOnly ? undefined : clickAction}
            style={getActiveStyle(isActive)}
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
