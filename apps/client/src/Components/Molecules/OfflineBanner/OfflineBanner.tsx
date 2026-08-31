import WifiOffIcon from "@mui/icons-material/WifiOff";
import { Alert, AlertTitle } from "@mui/material";
import { FC } from "react";
import { useIsOffline } from "../../../Utils/useIsOffline";

/**
 * Offline used to replace the whole app with a dead end. The service worker
 * precaches the app shell and keeps previously seen artwork, so the app is
 * still worth showing - it just can't fetch anything new. Say so, loudly and
 * permanently, instead of pretending everything is fine.
 */
const OfflineBanner: FC = () => {
    const isOffline = useIsOffline();

    if (!isOffline) {
        return null;
    }

    return (
        <Alert
            severity="warning"
            icon={<WifiOffIcon />}
            square
            data-testid="offline-banner"
        >
            <AlertTitle>You are offline</AlertTitle>
            Showing what was cached earlier. Live data and controls stay
            unavailable until the connection is back.
        </Alert>
    );
};

export default OfflineBanner;
