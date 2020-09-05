import React, { FC } from "react";
import SwitchBarListContainer from "../../../Containers/SwitchBarListContainer";
// import SwitchBarList from '../../Molecules/SwitchBarList/SwitchBarList';

const HomeAutomation: FC = () => {
    return (
        <div style={{ marginTop: "100px" }}>
            <SwitchBarListContainer />
            {/* <SwitchBarList /> */}
        </div>
    );
};

export default HomeAutomation;
