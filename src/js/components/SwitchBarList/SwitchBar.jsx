// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import './SwitchBar.scss';

// TODO needs TS

const getIconElem = (icon) => {
    return icon ? <FontIcon style={{fontSize: '250%'}} className="material-icons">{icon}</FontIcon> : <i></i>;
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
const SwitchBar = ({ leftButton, rightButton, icon, label, labelAction }) => {
    return (<Card className="card">
        <CardText className="button-group">
            {leftButton}
            <span className="label">
                {getIconElem(icon)}
                {labelAction ? <button onTouchTap={labelAction}>{label}</button> : label}
            </span>
            {rightButton}
        </CardText>
    </Card>);
};

export default SwitchBar;
