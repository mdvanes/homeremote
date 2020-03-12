import { Action, ActionCreator } from 'redux';

export const TOGGLE_EXPAND_SCENE = 'TOGGLE_EXPAND_SCENE';

export interface ToggleExpandSceneAction extends Action<string> {
    type: 'TOGGLE_EXPAND_SCENE';
    sceneIdx: string;
}

export const toggleExpandScene: ActionCreator<ToggleExpandSceneAction> = (
    sceneIdx: string
) => ({
    type: TOGGLE_EXPAND_SCENE,
    sceneIdx
});
