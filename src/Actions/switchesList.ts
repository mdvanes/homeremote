import { Action, ActionCreator } from 'redux';
import { DSwitch } from '../Reducers/switchesList';

export const SET_SWITCHES = 'SET_SWITCHES';

export interface SetSwitchesAction extends Action<string> {
    type: typeof SET_SWITCHES;
    switches: DSwitch[];
}

export const setSwitches: ActionCreator<SetSwitchesAction> = (
    switches: DSwitch[]
) => {
    return {
        type: SET_SWITCHES,
        switches
    };
};
