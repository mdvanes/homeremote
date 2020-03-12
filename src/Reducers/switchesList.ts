import { SET_SWITCHES, SetSwitchesAction } from '../Actions';

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

// TODO return type should not be void but state?
type SwitchesListReducer = (state: State, action: SetSwitchesAction) => void;

const switchesList: SwitchesListReducer = (
    state = { switches: [] },
    action
) => {
    if (action.type === SET_SWITCHES) {
        return {
            switches: action.switches
        };
    }
    return state;
};

export default switchesList;
