import { connect } from 'react-redux';
import { logInfo, logError, setSwitches, toggleExpandScene } from '../Actions';
import SwitchBarList from '../Components/Molecules/SwitchBarList/SwitchBarList';
import { bindActionCreators } from 'redux';

// Alternatively use process.env.NODE_ENV that is automatically set to development or production
const getRootUrl = (): string =>
    process.env.REACT_APP_STAGE === 'development'
        ? 'http://localhost:3001'
        : '';

// This is a simple thunk
const getSwitches = () => (dispatch: any) =>
    fetch(`${getRootUrl()}/switches`, {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(data => data.json())
        .then(data => {
            dispatch(
                logInfo(
                    `Got switches: ${data.switches
                        .map((aSwitch: any) => aSwitch.name)
                        .join(', ')}`
                )
            );
            dispatch(setSwitches(data.switches));
        })
        .catch(error => dispatch(logError(`error on /switches: ${error}`)));

const sendState = (dispatch: any, state: any, id: any, type: any) => {
    fetch(`${getRootUrl()}/switch/${id}`, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            state,
            type
        })
    })
        .then(data => {
            return data.json();
        })
        .then(data => {
            dispatch(logInfo('some effect'));
            if (data.status !== 'received') {
                dispatch(logError(`error on send-${state}: ${data.status}`));
            } else {
                dispatch(logInfo(`Switch ${id} ${state}`));
                dispatch(getSwitches());
            }
        })
        .catch(error => dispatch(logError(`error on send-${state}: ${error}`)));
};

// TypeScript does not like passing ...args, at least not when typed with :any
// const sendOn = (...args: any) => (dispatch: any) => {
//     sendState(dispatch, 'on', ...args);
// };

const sendOn = (id: any, type: any) => (dispatch: any) => {
    sendState(dispatch, 'on', id, type);
};

const sendOff = (id: any, type: any) => (dispatch: any) => {
    sendState(dispatch, 'off', id, type);
};

const mapStateToProps = (state: any) => {
    return {
        switches: state.switchesList.switches,
        expandedScenes: state.expandedScenes.expanded
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators(
        { getSwitches, sendOn, sendOff, toggleExpandScene },
        dispatch
    );
    // bindActionCreators is shorthand for:
    // return {
    //   getSwitches: () => dispatch(getSwitches()),
    //   sendOn: (...args) => dispatch(sendOn(...args))
    // };
};

const SwitchBarListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SwitchBarList);

export default SwitchBarListContainer;
