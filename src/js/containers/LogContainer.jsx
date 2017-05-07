import { connect } from 'react-redux';
import Log from '../components/Log';

const mapStateToProps = state => {
    return {
        loglines: state.loglines
    };
};

const mapDispatchToProps = () => {
    return {};
};

const LogContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Log);

export default LogContainer;