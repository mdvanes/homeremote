import { TOGGLE_EXPAND_SCENE } from '../Actions/index';

type Action = {
    type: string;
    sceneIdx: string;
};

type State = {
    expanded: any[];
};

const expandedScenes = (state: State = { expanded: [] }, action: Action) => {
    if (action.type === TOGGLE_EXPAND_SCENE) {
        if (state.expanded.includes(action.sceneIdx)) {
            // Exists already, so toggle to "collapsed" and remove from the expanded array
            return {
                expanded: state.expanded.filter(id => id !== action.sceneIdx)
            };
        }
        // Does not exist yet, so toggle to "expanded" and add to the expanded array
        return {
            expanded: [...state.expanded, action.sceneIdx]
        };
    }
    return state;
};

export default expandedScenes;
