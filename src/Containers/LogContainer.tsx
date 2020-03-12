import { connect } from 'react-redux';
import { logInfo, logError } from '../Actions';
import Log from '../Components/Molecules/Log/Log';

const mapStateToProps = (state: any) => {
    return {
        loglines: state.loglines
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        logInfo: (...messages: any) => {
            dispatch(logInfo(...messages));
        },
        logError: (...messages: any) => {
            dispatch(logError(...messages));
        }
    };
};

const LogContainer = connect(mapStateToProps, mapDispatchToProps)(Log);

export default LogContainer;
