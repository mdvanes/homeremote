import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hideShortMessage } from '../actions';
import Snackbar from 'material-ui/Snackbar';

class GlobalSnackBar extends React.Component {
    render() {
        return (
            <Snackbar
                open={this.props.showShortMessage}
                message={this.props.shortMessage}
                autoHideDuration={4000}
                onRequestClose={this.props.onShortMessageHide}
            />
        );
    }
}

GlobalSnackBar.propTypes = {
    onShortMessageHide: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
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

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSnackBar);