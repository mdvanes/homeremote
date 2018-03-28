// for small screens, extend fm.jsx and only change rendering.

import React from 'react'; // eslint-disable-line
import FileManager, { getMovePercentage, progressWrapperStyle, progressStyle } from './fm';
import RenameButton from '../containers/RenameButton';
import MoveButtonSmall from '../containers/MoveButtonSmall';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {teal100, teal400, deepPurple200} from 'material-ui/styles/colors';

const progressWrapperStyleGlobal = () => {
    return {
        backgroundColor: teal100,
        height: '1.5em',
        fontFamily: 'Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden'
    }
};

const progressStyleGlobal = movePercentage => {
    return {
        backgroundColor: teal400,
        width: `${Math.round(movePercentage * 100)}%`,
        height: '100%'
    };
};

const progressTextStyleGlobal = () => {
    return {
        position: 'absolute',
        top: 0,
        padding: '0.1em 0.5em',
        wordBreak: 'break-all',
        width: '100vw',
        height: '1.1em',
        overflow: 'hidden'
    }
};

export default class FileManagerSmall extends FileManager {
    render() {
        const rows = this.props.dirIndex.map(entry => {
            if(entry.isDir) {
                return <Card
                    key={entry.name}
                    onTouchTap={() => {this.props.listDir(this.props.dirName, entry.name)}}>
                    <CardHeader
                        title={entry.name}
                        avatar={<FontIcon className="material-icons">folder_open</FontIcon>} />
                </Card>;
            } else {
                const filePath = this.props.dirName ? this.props.dirName + '/' + entry.name : entry.name;
                const movePercentage = getMovePercentage(this.props, entry);
                const wrapperSmallStyle = progressWrapperStyle(movePercentage);
                wrapperSmallStyle.display = 'inline-block';
                const progressSmallStyle = progressStyle(movePercentage);
                return <Card key={entry.name}>
                    <CardHeader title={entry.name} subtitle={entry.size}/>
                    <CardActions>
                        <FlatButton onTouchTap={() => {this.ftpUpload(filePath)}} label="upload"/>
                        <RenameButton path={this.props.dirName} src={entry.name} suggestion={this.props.dirName}/>
                        <div style={wrapperSmallStyle}>
                            <div style={progressSmallStyle}></div>
                            <MoveButtonSmall filePath={this.props.dirName} fileName={entry.name} targetLocations={this.state.targetLocations} />
                        </div>
                    </CardActions>
                    {/*<CardText>Some text</CardText>*/}
                </Card>;
            }
        });
        const nrOfEntries = `${rows.length} entries`;
        let moveElem = null;
        if(this.props.moveProgress &&
            this.props.moveProgress.fileName &&
            this.props.moveProgress.percentage &&
            this.props.moveProgress.percentage !== 1) {
            moveElem = (<div style={progressWrapperStyleGlobal()}>
                    <div style={progressStyleGlobal(this.props.moveProgress.percentage)}></div>
                    <div style={progressTextStyleGlobal()}>
                        Copying {this.props.moveProgress.fileName}
                    </div>
                </div>);
        }
        return (
            <div>
                {moveElem}
                <Card style={{backgroundColor: deepPurple200}}
                      onTouchTap={() => this.props.listDir(this.props.dirName, '')}>
                    <CardHeader
                        title={this.props.dirName}
                        subtitle={nrOfEntries}
                        avatar={<FontIcon className="material-icons">subdirectory_arrow_left</FontIcon>}/>
                </Card>
                {rows}
                <div className="row">
                    <div className="col-xs-6">
                        <FlatButton onTouchTap={this.props.getFtpStatus} primary={true} label="Get FTP status"/>
                        <FlatButton onTouchTap={this.resetFilePermissions} primary={true} label="Fix Permissions"/>
                    </div>
                </div>
            </div>
        );
    }
}