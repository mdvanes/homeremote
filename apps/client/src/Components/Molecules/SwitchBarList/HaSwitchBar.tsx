import { HomeRemoteHaSwitch } from "@homeremote/types";
import { FC } from "react";
import { useUpdateHaSwitchMutation } from "../../../Services/generated/switchesApi";
import { useAppDispatch } from "../../../store";
import SwitchBar from "./SwitchBar";
import SwitchBarInnerButton from "./SwitchBarInnerButton";
import { getSwitches } from "./getSwitchesThunk";

interface HaSwitchBarProps {
    haSwitch: HomeRemoteHaSwitch;
}

const HaSwitchBar: FC<HaSwitchBarProps> = ({ haSwitch }) => {
    const [updateHaSwitch] = useUpdateHaSwitchMutation();
    const dispatch = useAppDispatch();

    const toggle = (nextState: "On" | "Off") => async () => {
        await updateHaSwitch({
            entityId: haSwitch.idx,
            body: { state: nextState },
        });
        dispatch(getSwitches());
    };

    return (
        <SwitchBar
            label={haSwitch.name}
            leftButton={
                <SwitchBarInnerButton
                    isReadOnly={false}
                    clickAction={toggle("On")}
                    icon="radio_button_checked"
                    isActive={haSwitch.status === "On"}
                />
            }
            rightButton={
                <SwitchBarInnerButton
                    isReadOnly={false}
                    clickAction={toggle("Off")}
                    icon="radio_button_unchecked"
                    isActive={haSwitch.status === "Off"}
                />
            }
            icon={false}
            labelAction={false}
        />
    );
};

export default HaSwitchBar;
