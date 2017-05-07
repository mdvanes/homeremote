import React from 'react';
import { connect } from 'react-redux';
import { clearLog } from '../actions/actions';
import FlatButton from 'material-ui/FlatButton';

class ClearLog extends React.Component {
    render() {
        return (
            <FlatButton label="Clear" onTouchTap={this.props.clearLog}/>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        clearLog: () => {
            return dispatch(clearLog());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClearLog);