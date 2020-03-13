import { connect } from 'react-redux';
import {
    logInfo,
    logError,
    setSwitches,
    toggleExpandScene,
    LogErrorAction
} from '../Actions';
import SwitchBarList from '../Components/Molecules/SwitchBarList/SwitchBarList';
import { bindActionCreators, Dispatch } from 'redux';

// Fix dispatch types, see https://medium.com/@d.maklygin/redux-typescript-reuse-the-type-of-an-action-creators-return-value-91663a48858f
// example with thunks: https://github.com/reduxjs/redux-thunk/blob/master/test/typescript.ts

// Alternatively use process.env.NODE_ENV that is automatically set to development or production
const getRootUrl = (): string =>
    process.env.REACT_APP_STAGE === 'development'
        ? 'http://localhost:3001'
        : '';

// TODO remove any types, pick types like in LogContainer

// type State = {};
// type SomeActions = { type: 'foo' };
// type ThunkResult<R> = ThunkAction<R, State, undefined, SomeActions>;

export type GetSwitches = () => (
    dispatch: Dispatch
) => Promise<void | LogErrorAction>;

// This is a simple thunk
const getSwitches: GetSwitches = () => dispatch =>
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

type SendState = (
    dispatch: any,
    state: any,
    id: string,
    type: string
) => Promise<void>;
const sendState: SendState = (dispatch, state, id, type) =>
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

// TypeScript does not like passing ...args, at least not when typed with :any
// const sendOn = (...args: any) => (dispatch: any) => {
//     sendState(dispatch, 'on', ...args);
// };

export type SendSomeState = (
    id: string,
    type: string
) => (dispatch: Dispatch) => Promise<void>;

const sendOn: SendSomeState = (id, type) => dispatch =>
    sendState(dispatch, 'on', id, type);

const sendOff: SendSomeState = (id, type) => dispatch =>
    sendState(dispatch, 'off', id, type);

const mapStateToProps = (state: any) => {
    return {
        switches: state.switchesList.switches,
        expandedScenes: state.expandedScenes.expanded
    };
};

// type SwitchBarListActions = SetSwitchesAction; // TODO see https://github.com/piotrwitek/react-redux-typescript-guide/issues/110#issuecomment-456564751
//
// const switchBarListActionCreators: ActionCreatorsMapObject<SwitchBarListActions> = {
//     get,
//     sendOn,
//     sendOff,
//     toggleExpandScene
// };

// type RemapActionCreators<T extends ActionCreatorsMapObject> = {
//     [K in keyof T]: ReplaceReturnType<T[K], ActionCreatorResponse<T[K]>>
// }
// type RemappedDispatchProps = RemapActionCreators<SwitchBarListDispatchProps>;

// const actions = bindActionCreators(
//     {
//         getSwitches
//     },
//     dispatch
// );

// interface ActionDispatchs {
//     getSwitches: typeof getSwitches;
// }

const mapDispatchToProps = (dispatch: Dispatch) => {
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
