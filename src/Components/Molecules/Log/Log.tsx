import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardActions } from '@material-ui/core';
import ClearLogButton from '../containers/ClearLogButton';
import RadioInfoButton from '../containers/RadioInfoButton';
import gitinfo from '../../../../gitinfo.json';
import packageJson from '../../../../package.json';

import './Log.scss';

const Log: FC = () => (
    <Card className="log-card">
        <CardContent className="log-card-text version">
            version: {gitinfo.hash}-{gitinfo.branch}-
            {packageJson.version}
        </CardContent>
        <CardContent className="log-card-text">
            {this.props.loglines.map((logline, index) => (
                <div key={index}>{logline.message}</div>
            ))}
        </CardContent>
        <div className="log"></div>
        <CardActions className="log-card-actions">
            <ClearLogButton />
            <RadioInfoButton />
        </CardActions>
    </Card>
);

Log.propTypes = {
    loglines: PropTypes.arrayOf(
        PropTypes.shape({
            message: PropTypes.string.isRequired
        }).isRequired
    ).isRequired
};

export default Log;
