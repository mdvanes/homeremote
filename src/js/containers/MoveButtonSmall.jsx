import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setMoveParams } from '../actions';
import FlatButton from 'material-ui/FlatButton';

class MoveButtonSmall extends React.Component {
    constructor(props) {
        super(props);
        this.goToDir = this.goToDir.bind(this);
    }

    // TODO might be better http://stackoverflow.com/questions/43081961/navigate-in-code-with-react-router-dom-4-0
    goToDir() {
        // dispatch the targetLocations for this entry
        // dispatch this.props.filePath, this.props.fileName
        this.props.setMoveParams(this.props.targetLocations, this.props.filePath, this.props.fileName);
        // redirect to MoveButtonSmallDir -> done by Link
    }

    render() {
        return (
            <Link onTouchTap={this.goToDir} to="/r/movebuttondir">
                <FlatButton label="Move" />
            </Link>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        setMoveParams: (targetLocations, filePath, fileName) => {
            dispatch(setMoveParams(targetLocations, filePath, fileName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveButtonSmall);