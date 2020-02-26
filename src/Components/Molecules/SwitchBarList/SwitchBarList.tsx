// eslint-disable-next-line no-unused-vars
import React, { Fragment, useEffect } from 'react';
import SwitchBar from './SwitchBar';
import SwitchBarInnerButton from './SwitchBarInnerButton';

// TODO improve type
const SELECTOR_STATES: Record<number, string> = {
    0: 'disconnected',
    10: 'disarmed',
    20: 'partarmed',
    30: 'armed'
};

// Type is switchscene or switchlight
const getType = (type: any) => {
    switch (type) {
        case 'Group':
            return 'switchscene';
        case 'Selector':
            return 'selector';
        default:
            return 'switchlight';
    }
};

const getLeftIcon = (label: string) =>
    label === 'Blinds' ? 'arrow_drop_down' : 'radio_button_checked';

const getRightIcon = (label: string) =>
    label === 'Blinds' ? 'arrow_drop_up' : 'radio_button_unchecked';

const getNameAndChildren = (name: string, children: any) =>
    children ? `${name} ⯆` : name;

const getLabel = (name: string, dimLevel: number, type: string) => {
    if (type === 'selector') {
        return `${name}: ${SELECTOR_STATES[dimLevel]}`;
    }
    return dimLevel !== null ? `${name} (${dimLevel}%)` : name;
};

const mapSwitchToSwitchBar = (
    { idx, name, type, dimLevel, readOnly, status, children }: any,
    sendOn: any,
    sendOff: any,
    labelAction: any
) => (
    <SwitchBar
        key={`switch-${idx}`}
        label={getLabel(
            getNameAndChildren(name, children),
            dimLevel,
            getType(type)
        )}
        labelAction={labelAction}
        leftButton={
            <SwitchBarInnerButton
                isReadOnly={readOnly}
                clickAction={() => sendOn(idx, getType(type))}
                icon={getLeftIcon(name)}
                isActive={status === 'On'}
            />
        }
        rightButton={
            <SwitchBarInnerButton
                isReadOnly={readOnly}
                clickAction={() => sendOff(idx, getType(type))}
                icon={getRightIcon(name)}
                isActive={status === 'Off'}
            />
        }
    />
);

const getLabelAction = (
    hasChildren: boolean,
    cbWithChildren: any,
    cbWithoutChildren: any
) => (hasChildren ? cbWithChildren : cbWithoutChildren);

const SwitchBarList = ({
    switches,
    expandedScenes,
    sendOn,
    sendOff,
    toggleExpandScene,
    getSwitches
}: any) => {
    useEffect(() => {
        getSwitches();
    }, [getSwitches]);
    const switchBars = switches.map((dSwitch: any) => {
        const hasChildren = dSwitch.children;
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
                        {hasChildren.map((switchChild: any) =>
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
