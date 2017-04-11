import React from 'react';
import FileManagerContainer from '../containers/FileManagerContainer';
import LogContainer from '../containers/LogContainer';

export default class FilesView extends React.Component {
    render() {
        return (
            <div>
                <FileManagerContainer/>
                <LogContainer infoUrl="/radio/info"/>
            </div>
        );
    }
}