import React from 'react';
import RenameButton from '../containers/RenameButton';
import MoveButton from '../containers/MoveButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import './simple-material-table.scss';
import {Card, CardText, CardHeader, CardActions} from 'material-ui/Card';
import {deepPurple900, deepPurple200} from 'material-ui/styles/colors';

// TODO Convert (mostly) to CSS Modules
const progressStyle = movePercentage => {
    return {
        backgroundColor: deepPurple900,
        width: `${Math.round(movePercentage * 100)}%`,
        height: '100%',
        position: 'absolute',
        left: 0,
        bottom: 0
    };
};

const progressWrapperStyle = movePercentage => {
    return {
        position: 'relative',
        backgroundColor: movePercentage ? deepPurple200 : 'transparent'
    }
};

const getMovePercentage = (props, entry) => {
    if(props.moveProgress && props.dirName === props.moveProgress.filePath &&
        entry.name === props.moveProgress.fileName
    ) {
        return props.moveProgress && props.moveProgress.percentage ? props.moveProgress.percentage : 0;
    } else {
        return null;
    }
};

class FileManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //dirIndex: [{name: 'No files yet'}],
            targetLocations: []
        };
        //this.listDir = this.listDir.bind(this);
        this.ftpUpload = this.ftpUpload.bind(this);
        //this.getFtpStatus = this.getFtpStatus.bind(this);
        //this.props.getFtpStatus(this.state.dirIndex);
        this.getTargetLocations = this.getTargetLocations.bind(this);
        this.resetFilePermissions = this.resetFilePermissions.bind(this);
        //this.listDir('');
        this.props.listDir(null, '');
        this.getTargetLocations();
        this.props.setupSocket();
    }

    // TODO all fetch calls should be done through a (combined) service (use thunk). See https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y035 and http://stackoverflow.com/questions/35855781/having-services-in-react-application
    // listDir(dirName) {
    //     if(this.state.dirName && this.state.dirName.length > 0 &&
    //         dirName && dirName.length > 0) {
    //         dirName = this.state.dirName + '/' + dirName;
    //     }
    //     fetch('/fm/list/', {
    //         credentials: 'same-origin',
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             path: dirName
    //         })
    //     })
    //     .then(data => data.json())
    //     .then(data => {
    //         this.setState({
    //             dirName: data.dir
    //         });
    //         this.props.setFileManagerDirIndex(data.list);
    //     })
    //     .catch(error => this.props.logError('error on fm/list/path: ' + error));
    // }

    ftpUpload(filePath) {
        fetch('/fm/ftp/', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: filePath
            })
        })
        .then(data => data.json())
        // .then(data => {
        //     console.log(data);
        // })
        .then(() =>  this.props.logInfo(`Started upload of ${filePath}`))
        .catch(error => this.props.logError('error on fm/ftp: ' + error));
    }

    getTargetLocations() {
        fetch('/fm/getTargetLocations', {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => {
            this.setState({
                targetLocations: data.targetLocations
            });
        })
        .catch(error => this.props.logError('error on fm/getTargetLocations: ' + error));
    }

    resetFilePermissions() {
        const confirmResult = confirm('Confirm resetting file permissions to rwrwrw');
        if(confirmResult) {
            fetch('/fm/resetFilePermissions', {
                credentials: 'same-origin',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(data => data.json())
            .then(data => {
                this.props.logInfo(`Reset file permissions: ${data.status}`);
            })
            .catch(error => this.props.logError('error on fm/resetFilePermissions: ' + error));
        }
    }

    render() {
        // TODO (in many places) better way to supply params to onClick
        // TODO then also move targetLocations outside of "rows"
        //const targetLocations = this.state.targetLocations.map(entry => {
        //    return <MenuItem onClick={() => {this.mvToTargetLocation(filePath, entry)}}>{entry}</MenuItem>
        //});
        const rows = this.props.dirIndex.map(entry => {
            if( entry.isDir ) {
                return <tr key={entry.name}>
                    <td><FontIcon className="material-icons">folder_open</FontIcon></td>
                    <td onClick={() => {this.props.listDir(this.props.dirName, entry.name)}}>{entry.name}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>;
            } else {
                const filePath = this.props.dirName ? this.props.dirName + '/' + entry.name : entry.name;
                let movePercentage = getMovePercentage(this.props, entry);
                return <tr key={entry.name}>
                    <td>
                        {entry.size}
                    </td>
                    <td>{entry.name}</td>
                    <td>
                        <FlatButton onTouchTap={() => {this.ftpUpload(filePath)}} label="upload"/>
                    </td>
                    <td>
                        <RenameButton path={this.props.dirName} src={entry.name} suggestion={this.props.dirName}/>
                    </td>
                    <td style={progressWrapperStyle(movePercentage)}>
                        <div style={progressStyle(movePercentage)}></div>
                        <MoveButton filePath={this.props.dirName} fileName={entry.name} targetLocations={this.state.targetLocations} />
                    </td>
                </tr>;
            }
        });
        const title = 'File Manager $[rootDir]/' + this.props.dirName;
        return (
            <Card style={{marginBottom: '1em', marginTop: '1em'}}>
                <CardHeader title={title}/>
                <CardText>
                    <table className="simple-material-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>FTP</th>
                            <th>Rename</th>
                            <th>Move</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td></td>
                            <td onTouchTap={() => this.props.listDir(this.props.dirName, '')}>/</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        {rows}
                        </tbody>
                    </table>
                </CardText>
                <CardActions>
                    <div className="row">
                        <div className="col-xs-6">
                            nr of entries: {rows.length}
                        </div>
                        <div className="col-xs-6">
                            <FlatButton onTouchTap={this.props.getFtpStatus} primary={true} label="Get FTP status"/>
                            <FlatButton onTouchTap={this.resetFilePermissions} primary={true} label="Fix Permissions"/>
                        </div>
                    </div>
                </CardActions>
            </Card>
        );
    }
}
export default FileManager;