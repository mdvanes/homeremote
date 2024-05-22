import { HomeRemoteHaSwitch } from "@homeremote/types";
import { FC } from "react";
import { useUpdateHaSwitchMutation } from "../../../Services/generated/switchesApi";
import SwitchBar from "./SwitchBar";
import SwitchBarInnerButton from "./SwitchBarInnerButton";

interface HaSwitchBarProps {
    haSwitch: HomeRemoteHaSwitch;
}

const HaSwitchBar: FC<HaSwitchBarProps> = ({ haSwitch }) => {
    // Implement the HaSwitchBar component logic here
    const [updateHaSwitch] = useUpdateHaSwitchMutation();

    return (
        <SwitchBar
            label={haSwitch.name}
            leftButton={
                <SwitchBarInnerButton
                    isReadOnly={false}
                    clickAction={() => {
                        updateHaSwitch({
                            entityId: haSwitch.idx,
                            body: { state: "On" },
                        });
                    }}
                    icon="radio_button_checked"
                    isActive={haSwitch.status === "On"}
                />
            }
            rightButton={
                <SwitchBarInnerButton
                    isReadOnly={false}
                    clickAction={() => {
                        updateHaSwitch({
                            entityId: haSwitch.idx,
                            body: { state: "Off" },
                        });
                    }}
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
