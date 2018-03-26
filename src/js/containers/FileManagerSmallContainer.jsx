import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';
import FileManagerSmall from '../components/fmSmall';
import { getFtpStatus, listDir, setupSocket } from './FileManagerContainer';

const mapStateToProps = state => {
    return {
        moveProgress: state.moveProgress,
        dirIndex: state.fileManager.dirIndex,
        dirName: state.fileManager.dirName
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logInfo: (...messages) => {
            dispatch(logInfo(...messages));
        },
        logError: (...messages) => {
            dispatch(logError(...messages));
        },
        getFtpStatus: dirIndex => dispatch(getFtpStatus(dirIndex)),
        setupSocket: () => dispatch(setupSocket()),
        listDir: (oldDirName, newDirName) => dispatch(listDir(oldDirName, newDirName))
    };
};

const FileManagerSmallContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileManagerSmall);

export default FileManagerSmallContainer;