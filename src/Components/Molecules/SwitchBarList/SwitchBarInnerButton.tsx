// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Icon } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';

const getActiveStyle = (isActive: any) => ({
    backgroundColor: isActive ? deepPurple[500] : 'transparent'
});

const SwitchBarInnerButton = ({
    isReadOnly,
    clickAction,
    icon,
    isActive
}: any) => {
    return (
        <button
            onClick={isReadOnly ? null : clickAction}
            style={getActiveStyle(isActive)}
        >
            {isReadOnly ? (
                <div className="dummy"></div>
            ) : (
                <Icon hoverColor={deepPurple[900]} className="material-icons">
                    {icon}
                </Icon>
            )}
        </button>
    );
};

export default SwitchBarInnerButton;
