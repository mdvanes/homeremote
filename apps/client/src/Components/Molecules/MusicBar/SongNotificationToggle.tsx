import {
    Notifications as NotificationsIcon,
    NotificationsOff as NotificationsOffIcon,
    Settings as SettingsIcon,
} from "@mui/icons-material";
import {
    FormControlLabel,
    IconButton,
    Menu,
    MenuItem,
    Switch,
    Tooltip,
} from "@mui/material";
import { FC, MouseEvent, useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";

const isNotificationSupported = (): boolean =>
    typeof window !== "undefined" && "Notification" in window;

/**
 * Controls browser notifications on song change (jukebox and radio), with
 * the less common stopped-playback behavior in an options menu. Persists via
 * HotKeyContext (backed by localStorage).
 */
export const SongNotificationToggle: FC = () => {
    const {
        songNotificationsEnabled,
        setSongNotificationsEnabled,
        songNotificationsWhenStoppedEnabled,
        setSongNotificationsWhenStoppedEnabled,
    } = useHotKeyContext();
    const [permission, setPermission] = useState<NotificationPermission>(
        isNotificationSupported() ? Notification.permission : "denied"
    );
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const blocked = !isNotificationSupported() || permission === "denied";

    const requestPermissionIfNeeded = () => {
        if (permission === "default") {
            Notification.requestPermission().then(setPermission);
        }
    };

    const handleNotificationToggle = () => {
        if (blocked) {
            return;
        }

        const next = !songNotificationsEnabled;
        if (next) {
            requestPermissionIfNeeded();
        }
        setSongNotificationsEnabled(next);
    };

    const handleOptionsClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleStoppedToggle = () => {
        const next = !songNotificationsWhenStoppedEnabled;
        if (next) {
            requestPermissionIfNeeded();
        }
        setSongNotificationsWhenStoppedEnabled(next);
    };

    const title = blocked
        ? "Song change notifications are blocked in the browser"
        : songNotificationsEnabled
          ? "Disable song change notifications (N)"
          : "Enable song change notifications (N)";

    return (
        <>
            <Tooltip title={title}>
                <span>
                    <IconButton
                        aria-label="Toggle song change notifications"
                        onClick={handleNotificationToggle}
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
            <Tooltip title="Song notification options">
                <IconButton
                    aria-label="Song notification options"
                    onClick={handleOptionsClick}
                >
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem
                    onClick={handleStoppedToggle}
                    disabled={blocked || !songNotificationsEnabled}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={songNotificationsWhenStoppedEnabled}
                                onChange={handleStoppedToggle}
                                onClick={(event) => event.stopPropagation()}
                            />
                        }
                        label="Also notify while music is stopped"
                    />
                </MenuItem>
            </Menu>
        </>
    );
};

export default SongNotificationToggle;
