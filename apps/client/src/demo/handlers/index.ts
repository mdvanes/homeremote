import { RequestHandler } from "msw";
import { authHandlers } from "./auth";
import { carTwinHandlers } from "./carTwin";
import { dataloraHandlers } from "./datalora";
import { dockerListHandlers } from "./dockerList";
import { downloadListHandlers } from "./downloadList";
import { energyUsageHandlers } from "./energyUsage";
import { homesecHandlers } from "./homesec";
import { jukeboxHandlers } from "./jukebox";
import { mediaHandlers } from "./media";
import { monitHandlers } from "./monit";
import { nextupHandlers } from "./nextup";
import { nowPlayingHandlers } from "./nowplaying";
import { scheduleHandlers } from "./schedule";
import { serviceLinksHandlers } from "./serviceLinks";
import { smartEntitiesHandlers } from "./smartEntities";
import { speedTestHandlers } from "./speedTest";
import { stacksHandlers } from "./stacks";
import { statusHandlers } from "./status";
import { urlToMusicHandlers } from "./urlToMusic";

export const handlers: RequestHandler[] = [
    ...authHandlers,
    ...smartEntitiesHandlers,
    ...energyUsageHandlers,
    ...nowPlayingHandlers,
    ...speedTestHandlers,
    ...urlToMusicHandlers,
    ...downloadListHandlers,
    ...dockerListHandlers,
    ...stacksHandlers,
    ...monitHandlers,
    ...homesecHandlers,
    ...nextupHandlers,
    ...scheduleHandlers,
    ...serviceLinksHandlers,
    ...dataloraHandlers,
    ...jukeboxHandlers,
    ...carTwinHandlers,
    ...statusHandlers,
    // Media stubs are last so the more specific JSON routes above win.
    ...mediaHandlers,
];
