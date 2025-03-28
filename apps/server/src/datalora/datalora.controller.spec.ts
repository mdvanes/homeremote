import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { DataloraController } from "./datalora.controller";

enableFetchMocks();

const mockCollectRows = jest.fn().mockResolvedValue([]);

jest.mock("@influxdata/influxdb-client", () => {
    return {
        InfluxDB: jest.fn().mockImplementation(() => ({
            getQueryApi: jest.fn().mockReturnValue({
                collectRows: mockCollectRows,
            }),
        })),
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
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DataloraController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<DataloraController>(DataloraController);

        jest.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "INFLUX_URL") {
                return "some.url";
            }
            if (envName === "INFLUX_TOKEN") {
                return "some.url";
            }
            if (envName === "INFLUX_ORG") {
                return "some.url";
            }
        });

        mockCollectRows.mockReset();
    });

    it("returns coords for /GET with ?type=24h", async () => {
        fetchMock.mockResponse(
            JSON.stringify([
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
