import { SET_SWITCHES } from '../actions/index';

const switchesList = (state = {switches: []}, action) => {
  if(action.type === SET_SWITCHES) {
    return {
      switches: action.switches
    }
  }
  return state;
};

export default switchesList;