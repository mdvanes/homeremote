import { MonitFilesystemService } from "@homeremote/types";
import { FC } from "react";
import MonitStatusAlert from "./MonitStatusAlert";

const MonitFilesystemServiceInstance: FC<{ item: MonitFilesystemService }> = ({
    item: { status, block, name },
}) => (
    <MonitStatusAlert status={status} name={name}>
        {block?.percent}% {block?.usage}/{block?.total}
    </MonitStatusAlert>
);

export default MonitFilesystemServiceInstance;
