import { SET_SWITCHES } from '../Actions/switchesList';

const switchesList = (state = { switches: [] }, action: any) => {
    if (action.type === SET_SWITCHES) {
        return {
            switches: action.switches
        };
    }
    return state;
};

export default switchesList;
