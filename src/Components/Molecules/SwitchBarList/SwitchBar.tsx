// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Icon, Card, CardContent } from '@material-ui/core';
import './SwitchBar.scss';

// TODO needs TS

const getIconElem = (icon: any) => {
    return icon ? (
        <Icon style={{ fontSize: '250%' }} className="material-icons">
            {icon}
        </Icon>
    ) : (
        <i></i>
    );
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
const SwitchBar = ({
    leftButton,
    rightButton,
    icon,
    label,
    labelAction
}: any) => {
    return (
        <Card className="card">
            <CardContent className="button-group">
                {leftButton}
                <span className="label">
                    {getIconElem(icon)}
                    {labelAction ? (
                        <button onClick={labelAction}>{label}</button>
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
