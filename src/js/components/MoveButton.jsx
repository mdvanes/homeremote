import React from 'react';
import logger from '../logger';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

export default class MoveButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            dialogActions: [],
            dialogTitle: 'Move to',
            snackBarOpen: false
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
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
            this.setState({ snackBarOpen: true }); // TOOD also for failed
            if(data.status === 'ok') {
                logger.log('move completed');
            } else {
                throw new Error('move failed');
            }
        })
        .catch(error => logger.error('error on fm/mvToTargetLocation: ' + error));
    }

    confirmMove(filePath, fileName, targetLocation) {
        this.setState({
            dialogActions: [
                <FlatButton label="Cancel" onTouchTap={this.handleClose} />,
                <FlatButton label="OK" secondary={true} onTouchTap={() => {this.mvToTargetLocation(filePath, fileName, targetLocation)}} />
            ],
            dialogTitle: `Confirm moving ${filePath}/${fileName} to ${targetLocation}`
        });
        //const confirmResult = confirm(`Confirm moving ${filePath}/${fileName} to ${targetLocation}`);
    }

    handleSnackbarClose() {
        this.setState({
            snackBarOpen: false,
        });
    };

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
        // TODO dynamically set "actions" to the confirm buttons, so the confirm dialog can be removed
        return (
            <div>
                <Snackbar
                    open={this.state.snackBarOpen}
                    message="Move completed"
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
                <FlatButton label="Move" onTouchTap={this.handleOpen} />
                <Dialog
                  title={this.state.dialogTitle}
                  modal={false}
                  open={this.state.open}
                  actions={this.state.dialogActions}
                  onRequestClose={this.handleClose}
                >
                    <ul>
                        {locations}
                    </ul>
                </Dialog>
            </div>
        );
    }
};