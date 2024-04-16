import {
    AllResponse,
    DockerContainerInfo,
    DockerListResponse,
} from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    UseGuards,
} from "@nestjs/common";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

const pickAndMapContainerProps = ({
    Id,
    Names,
    State,
    Status,
    Labels,
}: DockerContainerInfo): DockerContainerInfo => ({
    Id,
    Names,
    State,
    Status,
    Labels: {
        "com.docker.compose.project": Labels["com.docker.compose.project"],
    },
});

// Using Docker Engine API: curl --unix-socket /var/run/docker.sock http://v1.24/containers/json?all=true
// These urls also work: http://localhost/v1.24/containers/json?all=true or v1.24/containers/json?all=true
const ROOT_URL = "http://docker/v1.41/containers";
const SOCKET_PATH = "/var/run/docker.sock";

@Controller("api/dockerlist")
export class DockerlistController {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(DockerlistController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDockerList(): Promise<DockerListResponse> {
        this.logger.verbose("GET to /api/dockerlist");

        try {
            const result = await got(`${ROOT_URL}/json?all=true`, {
                socketPath: SOCKET_PATH,
            }).json<AllResponse>();
            this.logger.verbose(
                result.map((r) => r.Labels["com.docker.compose.project"])
            );
            return {
                status: "received",
                containers: result.map(pickAndMapContainerProps),
            };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("start/:id")
    async startContainer(@Param("id") id: string): Promise<DockerListResponse> {
        this.logger.verbose(`GET to /api/dockerlist/start ${id}`);

        try {
            await got(`${ROOT_URL}/${id}/start`, {
                method: "POST",
                socketPath: SOCKET_PATH,
            }).json<unknown>();
            return {
                status: "received",
            };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("stop/:id")
    async stopContainer(@Param("id") id: string): Promise<DockerListResponse> {
        this.logger.verbose(`GET to /api/dockerlist/stop ${id}`);

        try {
            await got(`${ROOT_URL}/${id}/stop`, {
                method: "POST",
                socketPath: SOCKET_PATH,
            }).json<unknown>();
            return {
                status: "received",
            };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
