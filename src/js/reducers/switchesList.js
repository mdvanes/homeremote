import { SET_SWITCHES } from '../actions/index';

const fileManager = (state = {switches: [] }, action) => {
  if(action.type === SET_SWITCHES) {
    return {
      switches: action.switches
    }
  }
  return state;
};

export default fileManager;