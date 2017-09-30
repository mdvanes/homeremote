import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';
import Log from '../components/Log';

const mapStateToProps = state => {
    return {
        loglines: state.loglines
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logInfo: (...messages) => {
            dispatch(logInfo(...messages));
        },
        logError: (...messages) => {
            dispatch(logError(...messages));
        }
    };
};

const LogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Log);

export default LogContainer;