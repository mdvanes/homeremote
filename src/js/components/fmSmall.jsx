// for small screens, extend fm.jsx and only change rendering.

import React from 'react'; // eslint-disable-line
import FileManager from './fm';
import RenameButton from './RenameButton';
import MoveButton from '../containers/MoveButton';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {deepPurple200} from 'material-ui/styles/colors';

export default class FileManagerSmall extends FileManager {
    render() {
        const rows = this.state.dirIndex.map(entry => {
            if(entry.isDir) {
                return <Card
                    key={entry.name}
                    onTouchTap={() => {this.listDir(entry.name)}}>
                    <CardHeader
                        title={entry.name}
                        avatar={<FontIcon className="material-icons">folder_open</FontIcon>} />
                </Card>;
            } else {
                const filePath = this.state.dirName ? this.state.dirName + '/' + entry.name : entry.name;
                return <Card key={entry.name}>
                    <CardHeader title={entry.name} subtitle={entry.size}/>
                    <CardActions>
                        <FlatButton onTouchTap={() => {this.ftpUpload(filePath)}} label="upload"/>
                        <RenameButton path={this.state.dirName} src={entry.name} suggestion={this.state.dirName}/>
                        <MoveButton filePath={this.state.dirName} fileName={entry.name} targetLocations={this.state.targetLocations} />
                    </CardActions>
                    {/*<CardText>Some text</CardText>*/}
                </Card>;
            }
        });
        const nrOfEntries = `${rows.length} entries`;
        return (
            <div>
                <Card style={{backgroundColor: deepPurple200}}
                      onTouchTap={() => this.listDir('')}>
                    <CardHeader
                        title={this.state.dirName}
                        subtitle={nrOfEntries}
                        avatar={<FontIcon className="material-icons">subdirectory_arrow_left</FontIcon>}/>
                </Card>
                {rows}
                <div className="row">
                    <div className="col-xs-6">
                        <FlatButton onTouchTap={this.getFtpStatus} primary={true} label="Get FTP status"/>
                        <FlatButton onTouchTap={this.resetFilePermissions} primary={true} label="Fix Permissions"/>
                    </div>
                </div>
            </div>
        );
    }
}