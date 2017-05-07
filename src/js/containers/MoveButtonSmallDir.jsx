// Directory listing for the move button for small screens

import React from 'react';
import { connect } from 'react-redux';

class MoveButtonSmallDir extends React.Component {
    render() {
        return (
            <div>
                <p>some text</p>
                <p>tl {this.props.targetLocations}</p>
                <p>fp {this.props.filePath}</p>
                <p>fn {this.props.fileName}</p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        targetLocations: state.moveParams.targetLocations,
        filePath: state.moveParams.filePath,
        fileName: state.moveParams.fileName
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveButtonSmallDir);