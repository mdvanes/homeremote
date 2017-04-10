import { connect } from 'react-redux';
//import { toggleTodo } from '../actions/actions';
import LogLineList from '../components/LogLineList';

// TODO to ES6 syntax

const mapStateToProps = (state) => {
    return {
        loglines: state.loglines
    };
};

const mapDispatchToProps = () => {
    return {
        // onTodoClick: (id) => {
        //     dispatch(toggleTodo(id))
        // }
    };
};

const VisibleLogLines = connect(
    mapStateToProps,
    mapDispatchToProps
)(LogLineList);

export default VisibleLogLines;