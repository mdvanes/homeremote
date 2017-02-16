import React from 'react';
import $http from '../request';
import logger from '../logger';

class FileManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {dirIndex: [{name: 'No files yet'}]};
        this.listDir = this.listDir.bind(this);
        this.listRootDir = this.listRootDir.bind(this);
        this.ftpUpload = this.ftpUpload.bind(this);
        this.listRootDir();
    }

    listRootDir() {
        $http('/fm/list')
            .then(data => {
                //console.log(data, data.list);
                this.setState({dirIndex: data.list});
            })
            .catch(error => logger.error('error on fm/list: ' + error));
    }

    listDir(dirName) {
        $http('/fm/list/' + dirName)
            .then(data => {
                this.setState({
                    dirIndex: data.list,
                    dirName: data.dir
                });
            })
            .catch(error => logger.error('error on fm/list/path: ' + error));
    }

    ftpUpload(filePath) {
        console.log('ftp upload', filePath);
        $http('/fm/ftp/' + encodeURIComponent(filePath))
            .then(data => {
                console.log(data);
                //this.setState({dirIndex: data.list});
            })
            .catch(error => logger.error('error on fm/ftp: ' + error));
    }

    render() {
        const rows = this.state.dirIndex.map(entry => {
            if( entry.isDir ) {
                return <li><a onClick={() => {this.listDir(entry.name)}}>*{entry.name}</a></li>;
            } else {
                let filePath = entry.name;
                if(this.state.dirName) {
                    filePath = this.state.dirName + '/' + filePath;
                }
                return <li>{entry.name} <button className="btn btn-default btn-lg" onClick={() => {this.ftpUpload(filePath)}}>ftp</button></li>;
            }
        });
        return (
            <div className="col-xs-12">
                <h1>File manager</h1>
                <ul>
                    <li><a onClick={this.listRootDir}>/</a></li>
                    {rows}
                </ul>
                nr of entries: {rows.length}
            </div>
        );
    }
}
export default FileManager;