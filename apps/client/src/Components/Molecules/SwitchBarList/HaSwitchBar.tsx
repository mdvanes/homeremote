import { HomeRemoteHaSwitch } from "@homeremote/types";
import { FC } from "react";
import SwitchBar from "./SwitchBar";
import SwitchBarInnerButton from "./SwitchBarInnerButton";

interface HaSwitchBarProps {
    haSwitch: HomeRemoteHaSwitch;
}

const HaSwitchBar: FC<HaSwitchBarProps> = ({ haSwitch }) => {
    // Implement the HaSwitchBar component logic here

    return (
        <SwitchBar
            label={haSwitch.name}
            leftButton={
                <SwitchBarInnerButton
                    isReadOnly={false}
                    clickAction={() => {
                        /* */
                    }}
                    icon="radio_button_checked"
                    isActive={haSwitch.status === "On"}
                />
            }
            rightButton={
                <SwitchBarInnerButton
                    isReadOnly={false}
                    clickAction={() => {
                        /* */
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
