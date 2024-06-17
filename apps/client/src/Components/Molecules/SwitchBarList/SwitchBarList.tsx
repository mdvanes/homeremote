import {
    DomoticzSendType,
    DomoticzType,
    HomeRemoteHaSwitch,
    HomeRemoteSwitch,
} from "@homeremote/types";
import { LinearProgress } from "@mui/material";
import { FC, Fragment, ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { useAppDispatch } from "../../../store";
import { logError } from "../LogCard/logSlice";
import HaSwitchBar from "./HaSwitchBar";
import SwitchBar from "./SwitchBar";
import SwitchBarInnerButton from "./SwitchBarInnerButton";
import {
    DOMOTICZ_SELECTOR_STATES_OPTIONS,
    isDomoticzSelectorStateCode,
} from "./SwitchBarList.types";
import { getSwitches } from "./getSwitchesThunk";
import {
    SwitchBarListState,
    sendSwitchState,
    toggleExpandScene,
} from "./switchBarListSlice";

// Type is switchscene or switchlight
const getType = (type: DomoticzType): DomoticzSendType => {
    switch (type) {
        case "Group":
            return "switchscene";
        case "Scene":
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
    children: HomeRemoteSwitch[] | false
): string => (children ? `${name}  \u25BE` : name);

const getLabel = (
    name: string,
    dimLevel: number | null,
    type: string
): string => {
    if (type === "selector" && isDomoticzSelectorStateCode(dimLevel)) {
        return `${name}: ${DOMOTICZ_SELECTOR_STATES_OPTIONS[dimLevel]}`;
    }
    return dimLevel !== null ? `${name} (${dimLevel}%)` : name;
};

type SendSomeState = (id: string, type: string) => void;

const isDomoticzSwitch = (
    dSwitch: HomeRemoteSwitch | HomeRemoteHaSwitch
): dSwitch is HomeRemoteSwitch => dSwitch.origin === "domoticz";

const isHaSwitch = (
    dSwitch: HomeRemoteSwitch | HomeRemoteHaSwitch
): dSwitch is HomeRemoteHaSwitch => dSwitch.origin === "home-assistant";

const mapSwitchToSwitchBar = (
    {
        idx,
        name,
        type,
        dimLevel,
        readOnly,
        status,
        children,
    }: HomeRemoteSwitch | HomeRemoteHaSwitch,
    sendOn: SendSomeState,
    sendOff: SendSomeState,
    labelAction: (() => void) | false
): ReactElement => (
    <SwitchBar
        key={`switch-${idx}`}
        icon={false}
        label={getLabel(
            getNameAndChildren(name, children ?? []),
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
    const dispatch = useAppDispatch();
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

    const switchBars = switches
        .filter(isDomoticzSwitch)
        .map((dSwitch: HomeRemoteSwitch) => {
            const hasChildren = Boolean(dSwitch.children);
            const labelAction = getLabelAction(
                hasChildren,
                () => {
                    dispatch(toggleExpandScene({ sceneIdx: dSwitch.idx }));
                    dispatch(getSwitches());
                },
                () => {
                    dispatch(getSwitches());
                }
            );
            const showChildren = expandedScenes.includes(dSwitch.idx);
            return (
                <Fragment key={`frag-${dSwitch.idx}`}>
                    {mapSwitchToSwitchBar(
                        dSwitch,
                        sendOn,
                        sendOff,
                        labelAction
                    )}
                    {hasChildren && showChildren ? (
                        <div style={{ padding: "0.5em" }}>
                            {dSwitch.children &&
                                dSwitch.children.map(
                                    (switchChild: HomeRemoteSwitch) =>
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

    const haSwitchBars = switches
        .filter(isHaSwitch)
        .map((haSwitch: HomeRemoteHaSwitch) => (
            <HaSwitchBar key={haSwitch.idx} haSwitch={haSwitch} />
        ));

    return (
        <Fragment>
            {switchBars}
            {haSwitchBars}
            {isLoading && <LinearProgress />}
        </Fragment>
    );
};

export default SwitchBarList;
