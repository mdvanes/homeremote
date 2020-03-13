import { connect } from 'react-redux';
import { logInfo, logError } from '../Actions';
import Log from '../Components/Molecules/Log/Log';
import { Dispatch } from 'redux';

type Logline = {
    message: string;
};

type State = {
    loglines: Logline[];
};

// And use this in ../Components/Molecules/Log/Log
type StateProps = State;

const mapStateToProps = (state: State): StateProps => {
    return {
        loglines: state.loglines
    };
};

// And use this in ../Components/Molecules/Log/Log
type ActionProps = {
    logInfo: (...messages: string[]) => void;
    logError: (...messages: string[]) => void;
};

// TODO How to type bindActionCreators?
// const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
//     return bindActionCreators(
//         {
//             logInfo: (...messages: any) => {
//                 dispatch(logInfo(...messages));
//             },
//             logError: (...messages: any) => {
//                 dispatch(logError(...messages));
//             }
//         },
//         dispatch
//     );
// };
const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
    return {
        logInfo: (...messages: string[]): void => {
            dispatch(logInfo(...messages));
        },
        logError: (...messages: string[]): void => {
            dispatch(logError(...messages));
        }
    };
};

// TODO add generic types to connect?
const LogContainer = connect(mapStateToProps, mapDispatchToProps)(Log);

export default LogContainer;
