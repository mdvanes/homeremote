import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';
import Gears from '../components/Gears';

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

const GearsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Gears);

export default GearsContainer;