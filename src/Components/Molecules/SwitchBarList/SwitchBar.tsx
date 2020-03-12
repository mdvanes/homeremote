import React, { FC, ReactElement } from 'react';
import { Icon, Card, CardContent } from '@material-ui/core';
import './SwitchBar.scss';

const getIconElem = (icon: string | false): ReactElement => {
    return icon ? (
        <Icon style={{ fontSize: '250%' }} className="material-icons">
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
    labelAction
}) => {
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
