import { connect } from 'react-redux';
// import { logInfo, logError } from '../Actions';
import Log, { Props } from '../Components/Molecules/Log/Log';
// import { Dispatch } from 'redux';

// type Logline = {
//     message: string;
// };

// type State = {
//     loglines: Logline[];
// };

// // And use this in ../Components/Molecules/Log/Log
// type StateProps = State;

type State = Pick<Props, 'loglines'>;

const mapStateToProps = (state: State): State => {
    return {
        loglines: state.loglines
    };
};

// TODO define all Props in ../Components/Molecules/Log/Log and use Pick to select these properties here
// And use this in ../Components/Molecules/Log/Log
// type ActionProps = {
//     logInfo: (...messages: string[]) => void;
//     logError: (...messages: string[]) => void;
// };
// e.g.

// type ActionProps = Pick<Props, 'logInfo' | 'logError'>;

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
// const mapDispatchToProps = (dispatch: Dispatch): ActionProps => {
//     return {
//         logInfo: (...messages: string[]): void => {
//             dispatch(logInfo(...messages));
//         },
//         logError: (...messages: string[]): void => {
//             dispatch(logError(...messages));
//         }
//     };
// };

// TODO add generic types to connect?
// const LogContainer = connect(mapStateToProps, mapDispatchToProps)(Log);
const LogContainer = connect(mapStateToProps)(Log);

export default LogContainer;
