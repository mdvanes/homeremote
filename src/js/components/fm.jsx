import React from 'react';
import RenameButton from './RenameButton';
import MoveButton from '../containers/MoveButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import './simple-material-table.scss';

class FileManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dirIndex: [{name: 'No files yet'}],
            targetLocations: []
        };
        this.listDir = this.listDir.bind(this);
        this.ftpUpload = this.ftpUpload.bind(this);
        this.getFtpStatus = this.getFtpStatus.bind(this);
        this.getTargetLocations = this.getTargetLocations.bind(this);
        this.resetFilePermissions = this.resetFilePermissions.bind(this);
        this.listDir('');
        this.getTargetLocations();
    }

    // TODO all fetch calls should be done through a (combined) service. See https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#style-y035 and http://stackoverflow.com/questions/35855781/having-services-in-react-application
    listDir(dirName) {
        if(this.state.dirName && this.state.dirName.length > 0 &&
            dirName && dirName.length > 0) {
            dirName = this.state.dirName + '/' + dirName;
        }
        fetch('/fm/list/', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: dirName
            })
        })
        .then(data => data.json())
        .then(data => {
            this.setState({
                dirIndex: data.list,
                dirName: data.dir
            });
        })
        .catch(error => this.props.logError('error on fm/list/path: ' + error));
    }

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

    getFtpStatus() {
        fetch('/fm/ftpstatus', {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => {
            this.props.logInfo(`FTP status: ${data.ftpStatus}`);
        })
        .catch(error => this.props.logError('error on fm/ftpstatus: ' + error));
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
        const rows = this.state.dirIndex.map(entry => {
            if( entry.isDir ) {
                return <tr key={entry.name}>
                    <td><FontIcon className="material-icons">folder_open</FontIcon></td>
                    <td onClick={() => {this.listDir(entry.name)}}>{entry.name}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>;
            } else {
                const filePath = this.state.dirName ? this.state.dirName + '/' + entry.name : entry.name;
                return <tr key={entry.name}>
                    <td>{entry.size}</td>
                    <td>{entry.name}</td>
                    <td>
                        <FlatButton onTouchTap={() => {this.ftpUpload(filePath)}} label="upload"/>
                    </td>
                    <td>
                        <RenameButton path={this.state.dirName} src={entry.name} suggestion={this.state.dirName}/>
                    </td>
                    <td>
                        <MoveButton filePath={this.state.dirName} fileName={entry.name} targetLocations={this.state.targetLocations} />
                    </td>
                </tr>;
            }
        });
        return (
            <div>
                <h1>File Manager $[rootDir]/{this.state.dirName}</h1>
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
                            <td onTouchTap={() => this.listDir('')}>/</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        {rows}
                    </tbody>
                </table>
                <div className="row">
                    <div className="col-xs-6">
                        nr of entries: {rows.length}
                    </div>
                    <div className="col-xs-6">
                        <FlatButton onTouchTap={this.getFtpStatus} primary={true} label="Get FTP status"/>
                        <FlatButton onTouchTap={this.resetFilePermissions} primary={true} label="Fix Permissions"/>
                    </div>
                </div>
            </div>
        );
    }
}
export default FileManager;