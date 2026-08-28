import {
    Notifications as NotificationsIcon,
    NotificationsOff as NotificationsOffIcon,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";

const isNotificationSupported = (): boolean =>
    typeof window !== "undefined" && "Notification" in window;

/**
 * Toggle for opt-out browser notifications on song change (jukebox and
 * radio). Mirrors the style of AddSongToPlaylistButton and lives next to it
 * on the Jukebox page. Persists via HotKeyContext (backed by localStorage).
 */
export const SongNotificationToggle: FC = () => {
    const { songNotificationsEnabled, setSongNotificationsEnabled } =
        useHotKeyContext();
    const [permission, setPermission] = useState<NotificationPermission>(
        isNotificationSupported() ? Notification.permission : "denied"
    );

    const blocked = !isNotificationSupported() || permission === "denied";

    const handleClick = () => {
        if (blocked) {
            return;
        }

        const next = !songNotificationsEnabled;
        if (next && permission === "default") {
            Notification.requestPermission().then((result) => {
                setPermission(result);
            });
        }
        setSongNotificationsEnabled(next);
    };

    const title = blocked
        ? "Song change notifications are blocked in the browser"
        : songNotificationsEnabled
          ? "Disable song change notifications"
          : "Enable song change notifications";

    return (
        <Tooltip title={title}>
            <span>
                <IconButton
                    aria-label="Toggle song change notifications"
                    onClick={handleClick}
                    disabled={blocked}
                    color={
                        songNotificationsEnabled && !blocked
                            ? "primary"
                            : "default"
                    }
                >
                    {songNotificationsEnabled && !blocked ? (
                        <NotificationsIcon />
                    ) : (
                        <NotificationsOffIcon />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default SongNotificationToggle;
