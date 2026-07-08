import {
    DockerEngineContainerSummary,
    PortainerApiStack,
    ServicesResponse,
} from "@homeremote/types";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import got, { CancelableRequest, Response } from "got";
import { mockAuthenticatedRequest } from "../util/test-helpers/mockAuthenticatedRequest";
import { ServicesController } from "./services.controller";

vi.mock("got");
const mockGot = vi.mocked(got);

const DOCKER_URL =
    "http://unix:/var/run/docker.sock:/v1.41/containers/json?all=true";
const PORTAINER_URL = "https://portainer.test/api/stacks";

const config: Record<string, string> = {
    DOCKER_SOCKET_PATH: "/var/run/docker.sock",
    DOCKER_BASE_URL: "http://homeserver",
    PORTAINER_BASE_URL: "https://portainer.test",
    PORTAINER_API_KEY: "secret",
    SERVICE_LINKS: "",
    DOCKER_ICONS: "",
};

const container = (
    over: Partial<DockerEngineContainerSummary>
): DockerEngineContainerSummary => ({
    Id: "id",
    Names: ["/name"],
    State: "running",
    Status: "Up 3 hours",
    ...over,
});

const stack = (over: Partial<PortainerApiStack>): PortainerApiStack =>
    ({
        Id: 1,
        Name: "stack",
        Type: 2,
        EndpointId: 1,
        Status: 1,
        ...over,
    }) as PortainerApiStack;

// got is called for docker (function) and portainer (function) with different
// URLs; route the mock by URL so both upstreams can be stubbed independently.
const mockUpstreams = (
    containers: DockerEngineContainerSummary[] | Error,
    stacks: PortainerApiStack[] | Error
) => {
    mockGot.mockImplementation(((url: string) => {
        if (url === DOCKER_URL) {
            return {
                json: () =>
                    containers instanceof Error
                        ? Promise.reject(containers)
                        : Promise.resolve(containers),
            } as CancelableRequest<Response>;
        }
        if (url === PORTAINER_URL) {
            return {
                json: () =>
                    stacks instanceof Error
                        ? Promise.reject(stacks)
                        : Promise.resolve(stacks),
            } as CancelableRequest<Response>;
        }
        throw new Error(`unexpected url ${url}`);
    }) as unknown as typeof got);
};

describe("Services Controller", () => {
    let controller: ServicesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ServicesController],
            providers: [
                {
                    provide: ConfigService,
                    // Provide config values at construction time; the controller
                    // reads all of them in its constructor.
                    useValue: { get: (key: string) => config[key] },
                },
            ],
        }).compile();

        controller = module.get<ServicesController>(ServicesController);
        mockGot.mockReset();
    });

    afterAll(() => {
        mockGot.mockRestore();
    });

    it("correlates containers to their Portainer stack via compose project", async () => {
        mockUpstreams(
            [
                container({
                    Id: "c1",
                    Names: ["/grafana"],
                    Labels: { "com.docker.compose.project": "monitoring" },
                }),
                container({
                    Id: "c2",
                    Names: ["/influxdb"],
                    State: "exited",
                    Status: "Exited (0) 2 hours ago",
                    Labels: { "com.docker.compose.project": "monitoring" },
                }),
            ],
            [stack({ Id: 5, Name: "monitoring", EndpointId: 2, Status: 1 })]
        );

        const result = (await controller.getServices(
            mockAuthenticatedRequest
        )) as Extract<ServicesResponse, { status: "received" }>;

        expect(result.status).toBe("received");
        expect(result.stacks).toHaveLength(1);
        const [monitoring] = result.stacks;
        expect(monitoring).toMatchObject({
            Id: "5",
            Name: "monitoring",
            source: "portainer",
            endpointId: 2,
            portainerStatus: 1,
            // one container stopped -> stack degraded
            health: "degraded",
        });
        expect(monitoring.containers.map((c) => c.Name)).toEqual([
            "grafana",
            "influxdb",
        ]);
        expect(monitoring.containers[0].health).toBe("running");
        expect(monitoring.containers[1].health).toBe("stopped");
    });

    it("marks a running container as degraded when unhealthy", async () => {
        mockUpstreams(
            [
                container({
                    Id: "c1",
                    Names: ["/app"],
                    Status: "Up 3 hours (unhealthy)",
                    Labels: { "com.docker.compose.project": "web" },
                }),
            ],
            [stack({ Id: 1, Name: "web", Status: 1 })]
        );

        const result = (await controller.getServices(
            mockAuthenticatedRequest
        )) as Extract<ServicesResponse, { status: "received" }>;

        expect(result.stacks[0].containers[0].health).toBe("degraded");
        expect(result.stacks[0].health).toBe("degraded");
    });

    it("groups containers without a Portainer stack as standalone", async () => {
        mockUpstreams(
            [
                container({
                    Id: "c1",
                    Names: ["/pihole"],
                    Labels: { "com.docker.compose.project": null as never },
                }),
            ],
            []
        );

        const result = (await controller.getServices(
            mockAuthenticatedRequest
        )) as Extract<ServicesResponse, { status: "received" }>;

        expect(result.stacks).toHaveLength(1);
        expect(result.stacks[0]).toMatchObject({
            Id: "standalone:pihole",
            Name: "pihole",
            source: "standalone",
            health: "running",
        });
    });

    it("keeps a Portainer stack with no live containers as stopped", async () => {
        mockUpstreams([], [stack({ Id: 9, Name: "media", Status: 2 })]);

        const result = (await controller.getServices(
            mockAuthenticatedRequest
        )) as Extract<ServicesResponse, { status: "received" }>;

        expect(result.stacks[0]).toMatchObject({
            Name: "media",
            source: "portainer",
            health: "stopped",
        });
        expect(result.summary).toEqual({
            healthy: 0,
            degraded: 0,
            stopped: 1,
        });
    });

    it("auto-discovers a service link from a published port", async () => {
        mockUpstreams(
            [
                container({
                    Id: "c1",
                    Names: ["/grafana"],
                    Labels: { "com.docker.compose.project": "monitoring" },
                    Ports: [
                        {
                            IP: "0.0.0.0",
                            PrivatePort: 3000,
                            PublicPort: 3000,
                            Type: "tcp",
                        },
                    ],
                }),
            ],
            [stack({ Id: 1, Name: "monitoring", Status: 1 })]
        );

        const result = (await controller.getServices(
            mockAuthenticatedRequest
        )) as Extract<ServicesResponse, { status: "received" }>;

        expect(result.serviceLinks).toEqual([
            {
                label: "monitoring",
                url: "http://homeserver:3000",
                icon: "",
            },
        ]);
        expect(result.stacks[0].link).toMatchObject({
            type: "port",
            port: 3000,
            url: "http://homeserver:3000",
        });
    });

    it("does not expose internal-only ports as links", async () => {
        mockUpstreams(
            [
                container({
                    Id: "c1",
                    Names: ["/postgres"],
                    Labels: { "com.docker.compose.project": "db" },
                    Ports: [{ PrivatePort: 5432, Type: "tcp" }],
                }),
            ],
            [stack({ Id: 1, Name: "db", Status: 1 })]
        );

        const result = (await controller.getServices(
            mockAuthenticatedRequest
        )) as Extract<ServicesResponse, { status: "received" }>;

        expect(result.serviceLinks).toEqual([]);
        expect(result.stacks[0].link).toMatchObject({ type: "none" });
        expect(result.stacks[0].containers[0].ports[0].internal).toBe(true);
    });

    it("throws when both upstreams fail", async () => {
        mockUpstreams(new Error("docker down"), new Error("portainer down"));

        await expect(
            controller.getServices(mockAuthenticatedRequest)
        ).rejects.toThrow("failed to receive downstream data");
    });

    describe("container actions", () => {
        beforeEach(() => {
            mockGot.mockReturnValue({
                json: () => Promise.resolve({}),
            } as CancelableRequest<Response>);
        });

        it.each(["start", "stop", "restart"])(
            "posts %s to the docker socket",
            async (action) => {
                const result = await controller.controlContainer(
                    mockAuthenticatedRequest,
                    action,
                    "abc123"
                );

                expect(result).toEqual({ status: "received" });
                expect(mockGot).toHaveBeenCalledWith(
                    `http://unix:/var/run/docker.sock:/v1.41/containers/abc123/${action}`,
                    { method: "POST", enableUnixSockets: true }
                );
            }
        );

        it("rejects an unknown action", async () => {
            await expect(
                controller.controlContainer(
                    mockAuthenticatedRequest,
                    "delete",
                    "abc123"
                )
            ).rejects.toThrow("unknown action");
            expect(mockGot).not.toHaveBeenCalled();
        });
    });

    describe("stack actions", () => {
        beforeEach(() => {
            mockGot.post = vi.fn().mockReturnValue({
                json: () => Promise.resolve({}),
            }) as unknown as typeof got.post;
        });

        it.each(["start", "stop"])(
            "posts %s to Portainer with the endpoint id",
            async (action) => {
                const result = await controller.controlStack(
                    mockAuthenticatedRequest,
                    action,
                    "5",
                    "2"
                );

                expect(result).toEqual({ status: "received" });
                expect(mockGot.post).toHaveBeenCalledWith(
                    `https://portainer.test/api/stacks/5/${action}?endpointId=2`,
                    { headers: { "X-API-KEY": "secret" } }
                );
            }
        );

        it("restarts a stack by stopping then starting it", async () => {
            const result = await controller.controlStack(
                mockAuthenticatedRequest,
                "restart",
                "5",
                "2"
            );

            expect(result).toEqual({ status: "received" });
            expect(mockGot.post).toHaveBeenNthCalledWith(
                1,
                "https://portainer.test/api/stacks/5/stop?endpointId=2",
                { headers: { "X-API-KEY": "secret" } }
            );
            expect(mockGot.post).toHaveBeenNthCalledWith(
                2,
                "https://portainer.test/api/stacks/5/start?endpointId=2",
                { headers: { "X-API-KEY": "secret" } }
            );
        });

        it("rejects an unknown action", async () => {
            await expect(
                controller.controlStack(
                    mockAuthenticatedRequest,
                    "remove",
                    "5",
                    "2"
                )
            ).rejects.toThrow("unknown action");
        });
    });
});
