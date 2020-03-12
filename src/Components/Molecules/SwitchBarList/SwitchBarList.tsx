import React, { FC, Fragment, ReactElement, useEffect } from 'react';
import SwitchBar from './SwitchBar';
import SwitchBarInnerButton from './SwitchBarInnerButton';
import {
    GetSwitches,
    SendSomeState
} from '../../../Containers/SwitchBarListContainer';
import { ActionCreator, Dispatch } from 'redux';
import { ToggleExpandSceneAction } from '../../../Actions';
import { DSwitch } from '../../../Reducers/switchesList';

// TODO improve type
const SELECTOR_STATES: Record<number, string> = {
    0: 'disconnected',
    10: 'disarmed',
    20: 'partarmed',
    30: 'armed'
};

// TODO stronger typing, return type can be only certain strings
// Type is switchscene or switchlight
const getType = (type: string): string => {
    switch (type) {
        case 'Group':
            return 'switchscene';
        case 'Selector':
            return 'selector';
        default:
            return 'switchlight';
    }
};

const getLeftIcon = (label: string): string =>
    label === 'Blinds' ? 'arrow_drop_down' : 'radio_button_checked';

const getRightIcon = (label: string): string =>
    label === 'Blinds' ? 'arrow_drop_up' : 'radio_button_unchecked';

const getNameAndChildren = (
    name: string,
    children: DSwitch[] | false
): string => (children ? `${name} ⯆` : name);

const getLabel = (name: string, dimLevel: number, type: string): string => {
    if (type === 'selector') {
        return `${name}: ${SELECTOR_STATES[dimLevel]}`;
    }
    return dimLevel !== null ? `${name} (${dimLevel}%)` : name;
};

type SendSomeStateDispatch = (dispatch: Dispatch) => void;

const mapSwitchToSwitchBar = (
    { idx, name, type, dimLevel, readOnly, status, children }: DSwitch,
    sendOn: SendSomeState,
    sendOff: SendSomeState,
    labelAction: (() => void) | false
): ReactElement => (
    <SwitchBar
        key={`switch-${idx}`}
        icon={false}
        label={getLabel(
            getNameAndChildren(name, children),
            dimLevel,
            getType(type)
        )}
        labelAction={labelAction}
        leftButton={
            <SwitchBarInnerButton
                isReadOnly={readOnly}
                clickAction={(): SendSomeStateDispatch =>
                    sendOn(idx, getType(type))
                }
                icon={getLeftIcon(name)}
                isActive={status === 'On'}
            />
        }
        rightButton={
            <SwitchBarInnerButton
                isReadOnly={readOnly}
                clickAction={(): SendSomeStateDispatch =>
                    sendOff(idx, getType(type))
                }
                icon={getRightIcon(name)}
                isActive={status === 'Off'}
            />
        }
    />
);

const getLabelAction = (
    hasChildren: boolean,
    cbWithChildren: () => void,
    cbWithoutChildren: () => void
): (() => void) => (hasChildren ? cbWithChildren : cbWithoutChildren);

// TODO this type should be in SwitchBarListContainer
type OuterProps = {
    getSwitches: GetSwitches;
    sendOn: SendSomeState;
    sendOff: SendSomeState;
    toggleExpandScene: ActionCreator<ToggleExpandSceneAction>;
    switches: DSwitch[];
    expandedScenes: string[];
};

const SwitchBarList: FC<OuterProps> = ({
    getSwitches,
    sendOn,
    sendOff,
    toggleExpandScene,
    switches,
    expandedScenes
}) => {
    useEffect(() => {
        getSwitches();
    }, [getSwitches]);
    const switchBars = switches.map((dSwitch: DSwitch) => {
        const hasChildren = Boolean(dSwitch.children);
        const labelAction = getLabelAction(
            hasChildren,
            () => {
                toggleExpandScene(dSwitch.idx);
                getSwitches();
            },
            getSwitches
        );
        const showChildren = expandedScenes.includes(dSwitch.idx);
        return (
            <Fragment key={`frag-${dSwitch.idx}`}>
                {mapSwitchToSwitchBar(dSwitch, sendOn, sendOff, labelAction)}
                {hasChildren && showChildren ? (
                    <div style={{ padding: '0.5em' }}>
                        {dSwitch.children &&
                            dSwitch.children.map((switchChild: DSwitch) =>
                                mapSwitchToSwitchBar(
                                    switchChild,
                                    sendOn,
                                    sendOff,
                                    false
                                )
                            )}
                    </div>
                ) : null}
            </Fragment>
        );
    });
    return <Fragment>{switchBars}</Fragment>;
};

export default SwitchBarList;
