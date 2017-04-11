import { connect } from 'react-redux';
import { hideShortMessage } from '../actions/actions';
import Log from '../components/Log';

const mapStateToProps = state => {
    return {
        loglines: state.loglines,
        shortMessage: state.short.shortMessage,
        showShortMessage: state.short.showShortMessage
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onShortMessageHide: () => {
            dispatch(hideShortMessage());
        }
    };
};

const LogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Log);

export default LogContainer;