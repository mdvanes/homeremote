import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';
import FileManagerSmall from '../components/fmSmall';

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        logInfo: (...messages) => {
            dispatch(logInfo(...messages));
        },
        logError: (...messages) => {
            dispatch(logError(...messages));
        },
        getFtpStatus: () => console.log('nyi small getFtpStatus'),
        setupSocket: () => console.log('nyi small setupSocket')
    };
};

const FileManagerSmallContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileManagerSmall);

export default FileManagerSmallContainer;