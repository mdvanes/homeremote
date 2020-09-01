import React, { FC } from 'react';
import { Card, CardContent, CardActions, Typography } from '@material-ui/core';
// TODO
// import ClearLogButton from '../containers/ClearLogButton';
// import RadioInfoButton from '../containers/RadioInfoButton';
import gitinfoJson from '../../../gitinfo.json';
import packageJson from '../../../../package.json';

import './Log.scss';

type Logline = {
    message: string;
};

export type Props = {
    loglines: Logline[];
};

const Log: FC<Props> = ({ loglines }) => (
    <Card className="log-card">
        <CardContent className="log-card-text version">
            <Typography>
                version: {gitinfoJson.hash}-{gitinfoJson.branch}-
                {packageJson.version}
            </Typography>
        </CardContent>
        <CardContent className="log-card-text">
            {loglines &&
                loglines.map((logline, index) => (
                    <div key={index}>{logline.message}</div>
                ))}
        </CardContent>
        <div className="log"></div>
        <CardActions className="log-card-actions">
            {/*<ClearLogButton />
            <RadioInfoButton />*/}
        </CardActions>
    </Card>
);

export default Log;
