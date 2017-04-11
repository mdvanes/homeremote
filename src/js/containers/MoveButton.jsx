import React from 'react';
import { connect } from 'react-redux';
import { logInfo, logError } from '../actions/actions';
//import logger from '../logger';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
//import Snackbar from 'material-ui/Snackbar';

const initialDialogActions = [];
const initialDialogTitle = 'Move to';

// TODO modify to use the Log.jsx Snackbar

class MoveButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            dialogActions: initialDialogActions,
            dialogTitle: initialDialogTitle,
            //snackBarOpen: false,
            showLocationsList: true,
            //snackBarMessage: ''
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        //this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({
            open: false,
            dialogActions: initialDialogActions,
            dialogTitle: initialDialogTitle,
            showLocationsList: true
        });
    }

    // TODO make more secure by supplying only the ID of the targetLocation and not allow freeform paths
    mvToTargetLocation(filePath, fileName, targetLocation) {
        fetch('/fm/mvToTargetLocation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sourcePath: filePath,
                fileName: fileName,
                targetPath: targetLocation
            })
        })
        .then(data => data.json())
        .then(data => {
            this.handleClose();
            if(data.status === 'ok') {
                // const message = 'Move completed';
                // logger.log(message);
                // this.setState({
                //     snackBarOpen: true,
                //     snackBarMessage: message
                // });
                this.props.logInfo('Move completed');
            } else {
                throw new Error('move failed');
            }
        })
        .catch(error => {
            // const message = 'error on fm/mvToTargetLocation: ' + error;
            // logger.error(message);
            // this.setState({
            //     snackBarOpen: true,
            //     snackBarMessage: message
            // });
            this.props.logError('error on fm/mvToTargetLocation: ' + error);
        });
    }

    confirmMove(filePath, fileName, targetLocation) {
        this.setState({
            dialogActions: [
                <FlatButton label="Cancel" onTouchTap={this.handleClose} />,
                <FlatButton label="OK" secondary={true} onTouchTap={() => {this.mvToTargetLocation(filePath, fileName, targetLocation)}} />
            ],
            dialogTitle: `Confirm moving ${filePath}/${fileName} to ${targetLocation}`,
            showLocationsList: false
        });
        //const confirmResult = confirm(`Confirm moving ${filePath}/${fileName} to ${targetLocation}`);
    }

    // handleSnackbarClose() {
    //     this.setState({
    //         snackBarOpen: false,
    //     });
    // };

    render() {
        const locations = this.props.targetLocations.map(entry => {
            return (
                <li
                    onTouchTap={() => {this.confirmMove(this.props.filePath, this.props.fileName, entry)}}
                    key={entry}>
                    {entry}
                </li>
            );
        });
        let locationsList = <span></span>;
        if(this.state.showLocationsList) {
            locationsList = <ul>{locations}</ul>;
        }
        // TODO dynamically set "actions" to the confirm buttons, so the confirm dialog can be removed
        return (
            <div>
                {/*<Snackbar
                    open={this.state.snackBarOpen}
                    message={this.state.snackBarMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.handleSnackbarClose}
                />*/}
                <FlatButton label="Move" onTouchTap={this.handleOpen} />
                <Dialog
                  title={this.state.dialogTitle}
                  modal={false}
                  open={this.state.open}
                  actions={this.state.dialogActions}
                  onRequestClose={this.handleClose}
                >
                    {locationsList}
                </Dialog>
            </div>
        );
    }
};

const mapStateToProps = () => {
    return {};
}

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

export default connect(mapStateToProps, mapDispatchToProps)(MoveButton);