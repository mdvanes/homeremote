import React from 'react';
import { connect } from 'react-redux';
//import { Router as BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
//import createHistory from 'history/createBrowserHistory'
import { logInfo, logError, setMoveParams } from '../actions/actions';
//import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
//import Divider from 'material-ui/Divider';
//import MoveButton from './MoveButton';

//import './MoveButton.scss';

//const history = createHistory();
// const initialDialogActions = [];
// const initialDialogTitle = 'Move to';


class MoveButtonSmall extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     open: false,
        //     dialogActions: initialDialogActions,
        //     dialogTitle: initialDialogTitle,
        //     showLocationsList: true,
        //     message: ''
        // };
        this.goToDir = this.goToDir.bind(this);
        //this.handleClose = this.handleClose.bind(this);
    }

    // TODO might be better http://stackoverflow.com/questions/43081961/navigate-in-code-with-react-router-dom-4-0
    goToDir() {
        //this.setState({open: true});
        // TODO
        // dispatch the targetLocations for this entry
        // dispatch this.props.filePath, this.props.fileName
        // redirect to MoveButtonSmallDir
        //console.log(browserHistory);
        //browserHistory.push('/r/movebuttondir');
        //console.log('history', this.context, this.context.router, this.context.router.history);
        // history.push('/r/movebuttondir');
        this.props.setMoveParams(this.props.targetLocations, this.props.fileName);
        //window.location = '/r/movebuttondir';
    }

    render() {
        /*const locations = this.props.targetLocations.map(entry => {
            return (
                <div
                    className="modal-line"
                    onTouchTap={() => {this.confirmMove(this.props.filePath, this.props.fileName, entry)}}
                    key={entry}>
                    <Divider/>
                    {entry}
                </div>
            );
        });
        let locationsList = <span></span>;
        if(this.state.showLocationsList) {
            locationsList = <div><Divider/>{locations}</div>;
        }*/
        return (
            <span>
                <Link onTouchTap={this.goToDir} to="/r/movebuttondir"><FlatButton label="debugSmallMove" /></Link>
                <FlatButton label="sMove" onTouchTap={this.goToDir} />
                {/*<Dialog
                    contentStyle={{
                        maxWidth: 'auto',
                        width: '95%'
                    }}
                    title={this.state.dialogTitle}
                    modal={false}
                    open={this.state.open}
                    actions={this.state.dialogActions}
                    onRequestClose={this.handleClose}
                >
                    {this.state.message}
                    {locationsList}
                </Dialog>*/}
            </span>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        logInfo: (...messages) => {
            dispatch(logInfo(...messages));
        },
        logError: (...messages) => {
            dispatch(logError(...messages));
        },
        setMoveParams: (targetLocations, fileName) => {
            dispatch(setMoveParams(targetLocations, fileName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveButtonSmall);