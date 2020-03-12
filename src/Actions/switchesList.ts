import { Action, ActionCreator } from 'redux';

export const SET_SWITCHES = 'SET_SWITCHES';

export interface SetSwitchesAction extends Action<string> {
    type: 'SET_SWITCHES';
}

export const setSwitches: ActionCreator<SetSwitchesAction> = (
    switches: any
) => {
    return {
        type: SET_SWITCHES,
        switches
    };
};
