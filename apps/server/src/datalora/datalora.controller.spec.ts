import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { AuthenticatedRequest } from "../login/LoginRequest.types";
import { DataloraController } from "./datalora.controller";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockCollectRows = vi.fn().mockResolvedValue([]);

vi.mock("@influxdata/influxdb-client", () => {
    return {
        InfluxDB: vi.fn().mockImplementation(function () {
            return {
                getQueryApi: vi.fn().mockReturnValue({
                    collectRows: mockCollectRows,
                }),
            };
        }),
    };
});

type MapperFn = (x: unknown, y: unknown) => unknown;

const identity = <T>(x: T): T => x;
const collectRowsCreator =
    (rows: typeof MOCK_ROWS) => (query: string, mapperFn: MapperFn) => {
        return rows.map((x) => mapperFn(x, { toObject: identity }));
    };

const MOCK_ROWS = [
    { _value: "[1,2]", _time: "123" },
    { _value: 111, _time: "123" },
];
const MOCK_DATA = [
    [
        {
            loc: [1, 2],
            time: "123",
            name: "name",
        },
    ],
];

describe("Datalora Controller", () => {
    let controller: DataloraController;
    let configService: ConfigService;

    beforeEach(async () => {
        // The controller reads its Home Assistant base URL in its constructor,
        // so the config mock must already resolve it before `compile()`.
        const configGet = vi.fn((envName: string) =>
            envName === "HOMEASSISTANT_BASE_URL"
                ? "http://homeassistant.test"
                : undefined
        );
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DataloraController],
            providers: [
                { provide: ConfigService, useValue: { get: configGet } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<DataloraController>(DataloraController);

        vi.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "INFLUX_URL") {
                return "some.url";
            }
            if (envName === "INFLUX_TOKEN") {
                return "some.url";
            }
            if (envName === "INFLUX_ORG") {
                return "some.url";
            }
            if (envName === "HOMEASSISTANT_BASE_URL") {
                return "http://homeassistant.test";
            }
        });

        mockCollectRows.mockReset();
    });

    it("returns coords for /GET with ?type=24h", async () => {
        server.use(
            http.all("*", () =>
                HttpResponse.json([
                    [
                        {
                            state: "[2,1]",
                            last_changed: "123",
                            attributes: {
                                friendly_name: "name",
                                latitude: 1,
                                longitude: 2,
                            },
                        },
                    ],
                ])
            )
        );
        // mockCollectRows.mockImplementation(collectRowsCreator(MOCK_ROWS));

        const response = await controller.getCoords(
            { user: { name: "someuser", id: 1 } } as AuthenticatedRequest,
            { type: "24h" }
        );
        expect(response).toEqual({ data: MOCK_DATA });
        // expect(mockCollectRows).toBeCalledWith(
        //     expect.stringContaining("range(start: -24h)"),
        //     expect.anything()
        // );
        // expect(mockCollectRows).toBeCalledTimes(1);
    });

    // it("returns coords for /GET with ?type=24h and falls back to type=all if no results", async () => {
    //     mockCollectRows.mockImplementation(collectRowsCreator(MOCK_ROWS));
    //     mockCollectRows.mockImplementationOnce(collectRowsCreator([]));

    //     const response = await controller.getCoords(
    //         { user: { name: "someuser", id: 1 } } as AuthenticatedRequest,
    //         { type: "24h" }
    //     );
    //     expect(response).toEqual({ data: MOCK_DATA });
    //     expect(mockCollectRows).toBeCalledWith(
    //         expect.stringContaining("range(start: -24h)"),
    //         expect.anything()
    //     );
    //     expect(mockCollectRows).toBeCalledWith(
    //         expect.stringContaining("range(start: 0)"),
    //         expect.anything()
    //     );
    //     expect(mockCollectRows).toBeCalledTimes(2);
    // });

    // it("returns coords for /GET with ?type=all", async () => {
    //     mockCollectRows.mockImplementation(collectRowsCreator(MOCK_ROWS));

    //     const response = await controller.getCoords(
    //         { user: { name: "someuser", id: 1 } } as AuthenticatedRequest,
    //         { type: "all" }
    //     );
    //     expect(response).toEqual({ data: MOCK_DATA });
    //     expect(mockCollectRows).toBeCalledWith(
    //         expect.stringContaining("range(start: 0)"),
    //         expect.anything()
    //     );
    //     expect(mockCollectRows).toBeCalledTimes(1);
    // });

    it.skip("throws error when InfluxDb fails", async () => {
        mockCollectRows.mockImplementation(() => {
            throw new Error("some error");
        });

        await expect(
            controller.getCoords(
                { user: { name: "someuser", id: 1 } } as AuthenticatedRequest,
                { type: "all" }
            )
        ).rejects.toThrow("failed to receive downstream data");
    });
});
