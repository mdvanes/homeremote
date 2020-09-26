import React, { FC, Fragment, ReactElement, useEffect } from "react";
import SwitchBar from "./SwitchBar";
import SwitchBarInnerButton from "./SwitchBarInnerButton";
import { useDispatch, useSelector } from "react-redux";
import {
    getSwitches,
    sendSwitchState,
    SwitchBarListState,
    toggleExpandScene,
    DSwitch,
} from "./switchBarListSlice";
import { RootState } from "../../../Reducers";
import { logError } from "../LogCard/logSlice";

// TODO improve type
const SELECTOR_STATES: Record<number, string> = {
    0: "disconnected",
    10: "disarmed",
    20: "partarmed",
    30: "armed",
};

// TODO stronger typing, return type can be only certain strings
// Type is switchscene or switchlight
const getType = (type: string): string => {
    switch (type) {
        case "Group":
            return "switchscene";
        case "Selector":
            return "selector";
        default:
            return "switchlight";
    }
};

const getLeftIcon = (label: string): string =>
    label === "Blinds" ? "arrow_drop_down" : "radio_button_checked";

const getRightIcon = (label: string): string =>
    label === "Blinds" ? "arrow_drop_up" : "radio_button_unchecked";

const getNameAndChildren = (
    name: string,
    children: DSwitch[] | false
): string => (children ? `${name} ⯆` : name);

const getLabel = (
    name: string,
    dimLevel: number | null,
    type: string
): string => {
    if (type === "selector" && dimLevel !== null) {
        return `${name}: ${SELECTOR_STATES[dimLevel]}`;
    }
    return dimLevel !== null ? `${name} (${dimLevel}%)` : name;
};

type SendSomeState = (id: string, type: string) => void;

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
                clickAction={(): void => sendOn(idx, getType(type))}
                icon={getLeftIcon(name)}
                isActive={status === "On"}
            />
        }
        rightButton={
            <SwitchBarInnerButton
                isReadOnly={readOnly}
                clickAction={(): void => sendOff(idx, getType(type))}
                icon={getRightIcon(name)}
                isActive={status === "Off"}
            />
        }
    />
);

const getLabelAction = (
    hasChildren: boolean,
    cbWithChildren: () => void,
    cbWithoutChildren: () => void
): (() => void) => (hasChildren ? cbWithChildren : cbWithoutChildren);

const SwitchBarList: FC = () => {
    const dispatch = useDispatch();
    const switches = useSelector<RootState, SwitchBarListState["switches"]>(
        (state: RootState) => state.switchesList.switches
    );
    const isLoading = useSelector<RootState, SwitchBarListState["isLoading"]>(
        (state: RootState) => state.switchesList.isLoading
    );
    const errorMessage = useSelector<RootState, SwitchBarListState["error"]>(
        (state: RootState) => state.switchesList.error
    );
    const expandedScenes = useSelector<
        RootState,
        SwitchBarListState["expanded"]
    >((state: RootState) => state.switchesList.expanded);

    const sendOn = (id: string, type: string): void => {
        dispatch(sendSwitchState({ id, type, state: "on" }));
    };

    const sendOff = (id: string, type: string): void => {
        dispatch(sendSwitchState({ id, type, state: "off" }));
    };

    useEffect(() => {
        dispatch(getSwitches());
    }, [dispatch]);
    useEffect(() => {
        dispatch(logError(errorMessage));
    }, [errorMessage, dispatch]);
    const switchBars = switches.map((dSwitch: DSwitch) => {
        const hasChildren = Boolean(dSwitch.children);
        const labelAction = getLabelAction(
            hasChildren,
            () => {
                dispatch(toggleExpandScene({ sceneIdx: dSwitch.idx }));
                dispatch(getSwitches());
            },
            getSwitches
        );
        const showChildren = expandedScenes.includes(dSwitch.idx);
        return (
            <Fragment key={`frag-${dSwitch.idx}`}>
                {mapSwitchToSwitchBar(dSwitch, sendOn, sendOff, labelAction)}
                {hasChildren && showChildren ? (
                    <div style={{ padding: "0.5em" }}>
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
    return (
        <Fragment>
            {switchBars}
            {isLoading && "loading..."}
        </Fragment>
    );
};

export default SwitchBarList;
