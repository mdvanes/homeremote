import { MonitHostService } from "@homeremote/types";
import { FC } from "react";
import MonitStatusAlert from "./MonitStatusAlert";

const MonitHostServiceInstance: FC<{ item: MonitHostService }> = ({
    item: { status, port, name },
}) => (
    <MonitStatusAlert status={status} name={name}>
        [{port.protocol}] {port.portnumber}
    </MonitStatusAlert>
);

export default MonitHostServiceInstance;
