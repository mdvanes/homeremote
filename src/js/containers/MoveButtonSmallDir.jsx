// Directory listing for the move button for small screens

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logInfo, logError } from '../actions';
import {Card, CardHeader} from 'material-ui/Card';
import {deepPurple200} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const initialDialogActions = [];

class MoveButtonSmallDir extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            dialogActions: initialDialogActions,
            message: ''
        };
        this.handleClose = this.handleClose.bind(this);
        this.confirmMove = this.confirmMove.bind(this);
    }

    handleClose() {
        this.setState({
            open: false,
            dialogActions: initialDialogActions,
            message: ''
        });
    }

    // TODO duplicate code with MoveButton.jsx
    // TODO make more secure by supplying only the ID of the targetLocation and not allow freeform paths
    mvToTargetLocation(filePath, fileName, targetLocation) {
        this.props.logInfo(`Start moving ${fileName}`);
        fetch('/fm/mvToTargetLocation', {
            credentials: 'same-origin',
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
                this.props.logInfo(`Move of ${fileName} completed`);
            } else {
                throw new Error(`Move of ${fileName} failed`);
            }
        })
        .catch(error => this.props.logError('error on fm/mvToTargetLocation: ' + error));
    }

    confirmMove(filePath, fileName, targetLocation) {
        this.setState({
            open: true,
            dialogActions: [
                <FlatButton label="Cancel" onTouchTap={this.handleClose} />,
                <Link onTouchTap={() => {this.mvToTargetLocation(filePath, fileName, targetLocation)}} to="/r/files">
                    <FlatButton label="OK" secondary={true} />
                </Link>
            ],
            message: `Confirm moving ${filePath}/${fileName} to ${targetLocation}`
        });
    }

    render() {
        const rows = this.props.targetLocations.map(entry => {
            return <Card
                key={entry}
                onTouchTap={() => {this.confirmMove(this.props.filePath, this.props.fileName, entry)}}>
                <CardHeader
                    style={{wordBreak: 'break-word'}}
                    title={entry} />
            </Card>;
        });
        return (
            <div>
                <Card style={{backgroundColor: deepPurple200}}>
                    <CardHeader
                        title={this.props.fileName}
                        subtitle="move to"/>
                </Card>
                {rows}
                <Dialog
                    contentStyle={{
                        maxHeight: 'auto',
                        maxWidth: 'auto',
                        wordBreak: 'break-word',
                        width: '95%'
                    }}
                    title='Confirm'
                    modal={false}
                    open={this.state.open}
                    actions={this.state.dialogActions}
                    onRequestClose={this.handleClose}
                >
                    {this.state.message}
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        targetLocations: state.moveParams.targetLocations,
        filePath: state.moveParams.filePath,
        fileName: state.moveParams.fileName
    };
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

export default connect(mapStateToProps, mapDispatchToProps)(MoveButtonSmallDir);