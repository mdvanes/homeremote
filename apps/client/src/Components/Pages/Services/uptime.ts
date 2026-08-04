export const formatUptime = (createdAt?: number): string | undefined => {
    if (!createdAt) {
        return undefined;
    }
    const seconds = Math.floor(Date.now() / 1000) - createdAt;
    if (seconds < 0) {
        return undefined;
    }
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) {
        return `${days}d ${hours}h`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};
