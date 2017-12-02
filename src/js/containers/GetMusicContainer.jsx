import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';
import GetMusic from '../components/GetMusic';

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
        }
    };
};

const GetMusicContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GetMusic);

export default GetMusicContainer;