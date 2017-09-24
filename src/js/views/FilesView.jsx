import React from 'react';
import FileManagerSmallContainer from '../containers/FileManagerSmallContainer';
import LogContainer from '../containers/LogContainer';

export default class FilesView extends React.Component {
    render() {
        return (
            <div>
                <FileManagerSmallContainer/>
                <LogContainer infoUrl="/nowplaying/info"/>
            </div>
        );
    }
}