import { connect } from 'react-redux';
//import { toggleTodo } from '../actions/actions';
import Log from '../components/Log';

const mapStateToProps = (state) => {
    return {
        loglines: state.loglines,
        shortMessage: state.short.shortMessage,
        showShortMessage: state.short.showShortMessage
    };
};

const mapDispatchToProps = () => {
    return {
        // onTodoClick: (id) => {
        //     dispatch(toggleTodo(id))
        // }
    };
};

const LogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Log);

export default LogContainer;