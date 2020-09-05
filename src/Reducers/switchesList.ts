// import { SET_SWITCHES, SetSwitchesAction } from '../Actions';

// Domoticz Device Switch
export type DSwitch = {
    idx: string;
    name: string;
    type: string;
    status: string;
    dimLevel: number;
    readOnly: boolean;
    children: DSwitch[] | false;
};

type State = {
    switches: DSwitch[];
};

// const emptyList: DSwitch[] = [];

// type SwitchesListReducer = (state: State, action: SetSwitchesAction) => State;

// const switchesList: SwitchesListReducer = (
//     state = { switches: emptyList },
//     action
// ) => {
//     if (action.type === SET_SWITCHES) {
//         return {
//             switches: action.switches
//         };
//     }
//     return state;
// };

// export default switchesList;
