import { MonitService } from "@homeremote/types";

// export const formatDuration = (s: number) => {
//     const daysDecimal = s / 60 / 60 / 24;
//     const days = Math.floor(daysDecimal);
//     const hoursDecimal = (daysDecimal - days) * 24;
//     const hours = Math.floor(hoursDecimal);
//     const minutesDecimal = (hoursDecimal - hours) * 60;
//     const minutes = Math.floor(minutesDecimal);
//     // Monit only updates once per minute on the backend
//     // const secondsDecimal = (minutesDecimal - minutes) * 60;
//     // const seconds = Math.floor(secondsDecimal);
//     return `${days}d ${hours}h ${minutes}m`;
// };

export const sortByName = (
    service: MonitService,
    otherService: MonitService
): number => {
    if (service.name < otherService.name) {
        return -1;
    }
    if (service.name > otherService.name) {
        return 1;
    }
    return 0;
};
