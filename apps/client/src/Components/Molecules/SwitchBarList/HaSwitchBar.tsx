import { HomeRemoteHaSwitch } from "@homeremote/types";
import { FC } from "react";
import { useUpdateSmartEntityMutation } from "../../../Services/generated/smartEntitiesApi";
import { useAppDispatch } from "../../../store";
import SwitchBar from "./SwitchBar";
import SwitchBarInnerButton from "./SwitchBarInnerButton";
import { getSwitches } from "./getSwitchesThunk";

interface HaSwitchBarProps {
    haSwitch: HomeRemoteHaSwitch;
}

const HaSwitchBar: FC<HaSwitchBarProps> = ({ haSwitch }) => {
    const [updateHaSwitch] = useUpdateSmartEntityMutation();
    const dispatch = useAppDispatch();

    const toggle = (nextState: "on" | "off") => async () => {
        await updateHaSwitch({
            entityId: haSwitch.idx,
            updateSmartEntityBody: { state: nextState },
        });
        dispatch(getSwitches());
    };

    return (
        <SwitchBar
            label={haSwitch.name}
            leftButton={
                <SwitchBarInnerButton
                    isReadOnly={false}
                    clickAction={toggle("on")}
                    icon="radio_button_checked"
                    isActive={haSwitch.status === "on"}
                />
            }
            rightButton={
                <SwitchBarInnerButton
                    isReadOnly={false}
                    clickAction={toggle("off")}
                    icon="radio_button_unchecked"
                    isActive={haSwitch.status === "off"}
                />
            }
            icon={false}
            labelAction={false}
        />
    );
};

export default HaSwitchBar;
