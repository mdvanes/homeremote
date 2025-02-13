import {
    DomoticzStatus,
    DomoticzType,
    GetHaStatesResponse,
    HomeRemoteHaSwitch,
    HomeRemoteSwitch,
    SwitchesResponse,
} from "@homeremote/types";
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

export interface DomoticzSwitch {
    idx: string;
    Type: DomoticzType;
    Name: string;
    Status: DomoticzStatus;
    SwitchType: DomoticzType;
    Level: number;
    Protected: boolean;
}

type GetIsOnDimmer = (SwitchType: DomoticzType, Status: string) => boolean;
const getIsOnDimmer: GetIsOnDimmer = (SwitchType, Status) =>
    SwitchType === "Dimmer" && Status === "On";

type GetDimLevel = (
    isOnDimmer: boolean,
    isSelector: boolean,
    Level: number
) => number | null;
const getDimLevel: GetDimLevel = (isOnDimmer, isSelector, Level) =>
    isOnDimmer || isSelector ? Level : null;

// For switches included in a scene
type MapIncludedSwitch = (
    SceneStatus: DomoticzStatus
) => ({
    DevID,
    Type,
    Name,
}: {
    DevID: string;
    Type: DomoticzType;
    Name: string;
}) => HomeRemoteSwitch;
const mapIncludedSwitch: MapIncludedSwitch =
    (SceneStatus) =>
    ({ DevID, Type, Name }) => ({
        idx: DevID,
        type: Type,
        name: Name,
        status: SceneStatus,
        dimLevel: null, // NYI, to implement this get each switch detail by DevID on /json.htm?type=command&param=getlightswitches
        readOnly: false, // NYI, to implement this get each switch detail by DevID on /json.htm?type=command&param=getlightswitches
        origin: "domoticz",
    });

type GetChildren = (
    domoticzuri: string,
    SceneIdx: string,
    SceneType: DomoticzType,
    SceneStatus: DomoticzStatus
) => Promise<HomeRemoteSwitch[] | false>;

const getChildren: GetChildren = async (
    domoticzuri,
    SceneIdx,
    SceneType,
    SceneStatus
) => {
    if (SceneType === "Group") {
        const targetUri = `${domoticzuri}/json.htm?type=command&param=getscenedevices&idx=${SceneIdx}&isscene=true`;
        const remoteResponse = await got(targetUri);
        const remoteResponseJson = JSON.parse(remoteResponse.body);
        if (remoteResponseJson.status === "OK") {
            return remoteResponseJson.result.map(
                mapIncludedSwitch(SceneStatus)
            );
        }
        return false;
    }
    return false;
};

const mapSwitch =
    (domoticzuri: string) =>
    async ({
        idx,
        Type,
        Name,
        Status,
        SwitchType,
        Level,
        Protected,
    }: DomoticzSwitch): Promise<HomeRemoteSwitch> => {
        const isSelector = SwitchType === "Selector";
        const isOnDimmer = getIsOnDimmer(SwitchType, Status);
        const children = await getChildren(domoticzuri, idx, Type, Status);
        const switchResult: HomeRemoteSwitch = {
            idx,
            type: isSelector ? SwitchType : Type,
            name: Name,
            status: Status,
            dimLevel: getDimLevel(isOnDimmer, isSelector, Level),
            readOnly: Protected,
            children,
            origin: "domoticz",
        };
        return switchResult;
    };

interface UpdateSwitchMessage {
    state: string;
    type: string;
}

@Controller("api/switches")
export class SwitchesController {
    private readonly logger: Logger;

    private readonly haApiConfig: {
        baseUrl: string;
        token: string;
        entityId: string;
    };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(SwitchesController.name);

        this.haApiConfig = {
            baseUrl:
                this.configService.get<string>("HOMEASSISTANT_BASE_URL") || "",
            token: this.configService.get<string>("HOMEASSISTANT_TOKEN") || "",
            entityId:
                this.configService.get<string>("HOMEASSISTANT_SWITCHES_ID") ||
                "",
        };
    }

    /** @deprecated */
    getHaLightFavoritesAsSwitches = async (): Promise<HomeRemoteHaSwitch[]> => {
        try {
            // TODO remove. This fetch randomly fails.
            this.logger.warn(
                `Calling curl -H "Authorization: Bearer ${
                    this.haApiConfig.token
                }" ${`${this.haApiConfig.baseUrl}/api/states/light.favorites`}`
            );
            const haFavoritesResponse = await fetch(
                `${this.haApiConfig.baseUrl}/api/states/group.favorites2`,
                {
                    headers: {
                        Authorization: `Bearer ${this.haApiConfig.token}`,
                    },
                }
            );
            const haFavoriteIds =
                (await haFavoritesResponse.json()) as GetHaStatesResponse;

            // @ts-expect-error old function
            const haStatesPromises = haFavoriteIds.attributes.entity_id.map(
                async (entity) => {
                    // TODO remove. This fetch randomly fails. Maybe because of multiple requests at once?
                    this.logger.warn(
                        `Calling curl -H "Authorization: Bearer ${this.haApiConfig.token}" ${this.haApiConfig.baseUrl}/api/states/${entity}`
                    );
                    const haStateResponse = await fetch(
                        `${this.haApiConfig.baseUrl}/api/states/${entity}`,
                        {
                            headers: {
                                Authorization: `Bearer ${this.haApiConfig.token}`,
                            },
                        }
                    );
                    return (await haStateResponse.json()) as GetHaStatesResponse;
                }
            );
            const haStates = await Promise.all(haStatesPromises);

            const haSwitches: HomeRemoteHaSwitch[] = haStates

                .filter((e) => e.message !== "Entity not found.")
                .map<HomeRemoteHaSwitch>((entity) => ({
                    origin: "home-assistant",
                    dimLevel: null,
                    idx: entity.entity_id,
                    name: entity.attributes?.friendly_name ?? entity.entity_id,
                    readOnly: false,
                    status: entity.state === "off" ? "Off" : "On",
                    type: "Light/Switch",
                    children: false,
                }));

            return haSwitches;
        } catch (err) {
            this.logger.error(`Can't get HaLightFavorites ${err}`);
            return [];
        }
    };

    @UseGuards(JwtAuthGuard)
    @Get()
    /** @deprecated */
    async getSwitches(
        @Request() req: AuthenticatedRequest
    ): Promise<SwitchesResponse> {
        const domoticzuri =
            this.configService.get<string>("DOMOTICZ_URI") || "";

        this.logger.verbose(
            `[${req.user.name}] GET to /api/switches domoticzuri: ${domoticzuri}]`
        );
        if (domoticzuri && domoticzuri.length > 0) {
            const targetUri = `${domoticzuri}/json.htm?type=devices&used=true&filter=all&favorite=1`;
            try {
                const remoteResponse = await got(targetUri);
                const remoteResponseJson = JSON.parse(remoteResponse.body);

                const haSwitches = await this.getHaLightFavoritesAsSwitches();

                if (remoteResponseJson.status === "OK") {
                    const switches = await Promise.all(
                        (
                            (remoteResponseJson.result ??
                                []) as DomoticzSwitch[]
                        ).map(mapSwitch(domoticzuri))
                    );
                    // this.logger.verbose(`SWITCHES ${switches} x= ${typeof switches[0]}, z=${JSON.stringify(switches[0])} json=${JSON.stringify(remoteResponseJson)}`);
                    return {
                        status: "received",
                        switches: [...switches, ...haSwitches],
                    };
                } else {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error("remoteResponse failed");
                }
            } catch (err) {
                this.logger.error(`Can't parse response ${err}`);
                return { status: "error" };
            }
        } else {
            this.logger.error("domoticzuri not configured");
            return { status: "error" };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post(":switchId")
    async updateSwitch(
        @Param("switchId") switchId: string,
        @Body() message: UpdateSwitchMessage,
        @Request() req: AuthenticatedRequest
    ): Promise<{ status: "received" | "error" }> {
        const domoticzuri =
            this.configService.get<string>("DOMOTICZ_URI") || "";
        const { state, type: switchType } = message;
        const newState = state === "on" ? "On" : "Off";

        this.logger.verbose(
            `[${req.user.name}] Call to /switch/${switchId} {state: ${newState}, type: ${switchType}} domoticzuri: ${domoticzuri}]`
        );
        if (domoticzuri && domoticzuri.length > 0) {
            const targetUri = `${domoticzuri}/json.htm?type=command&param=${switchType}&idx=${switchId}&switchcmd=${newState}`;
            try {
                const remoteResponse = await got(targetUri);
                const remoteResponseJson = JSON.parse(remoteResponse.body);
                if (remoteResponseJson.status === "OK") {
                    return { status: "received" };
                } else {
                    throw new Error("remoteResponse failed");
                }
            } catch (err) {
                this.logger.error(err);
                return { status: "error" };
            }
        } else {
            this.logger.error("domoticzuri not configured");
            return { status: "error" };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post("/ha/:entityId")
    async updateHaSwitch(
        @Param("entityId") entityId: string,
        @Body() args: any,
        @Request() req: AuthenticatedRequest
    ): Promise<any> {
        this.logger.verbose(
            `[${req.user.name}] Call to /switch/ha/${entityId} state: ${args.state}`
        );

        try {
            const [entityType] = entityId.split(".");
            const pathType = entityType === "light" ? "light" : "switch";
            await fetch(
                `${
                    this.haApiConfig.baseUrl
                }/api/services/${pathType}/turn_${args.state.toLowerCase()}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.haApiConfig.token}`,
                    },
                    body: JSON.stringify({ entity_id: entityId }),
                }
            );
            return "received";
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
