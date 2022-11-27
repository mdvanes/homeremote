import { Test, TestingModule } from "@nestjs/testing";
import { ScheduleController } from "./schedule.controller";
import { ConfigService } from "@nestjs/config";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import got, { Response, CancelableRequest } from "got";
import { mocked } from "jest-mock";
import { GetScheduleResponse, ScheduleItem } from "@homeremote/types";

jest.mock("got");
const mockGot = mocked(got);

const mockAuthenticatedRequest = {
    user: { name: "someuser", id: 1 },
} as AuthenticatedRequest;

const mockScheduleResponse = {
    data: {
        later: [],
        missed: [
            {
                airdate: "2022-10-01",
                ep_name: "some missed name",
                airs: "",
                episode: 1,
                season: 3,
                show_status: "OK",
                show_name: "Missed",
            } as ScheduleItem,
        ],
        snatched: [],
        soon: [
            {
                airdate: "2022-11-07",
                ep_name: "some soon name",
                airs: "",
                episode: 3,
                season: 2,
                show_status: "OK",
                show_name: "Soon",
            } as ScheduleItem,
        ],
        today: [],
    },
    message: "",
    result: "success",
} as GetScheduleResponse;

describe("ScheduleController", () => {
    let controller: ScheduleController;

    beforeEach(async () => {
        const mockGet = jest.fn().mockReturnValue("http://someurl/api/key");

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ScheduleController],
            providers: [{ provide: ConfigService, useValue: { get: mockGet } }],
        }).compile();
        controller = module.get<ScheduleController>(ScheduleController);
    });

    it("returns schedule on /GET", async () => {
        mockGot.mockReturnValue({
            json: () => Promise.resolve(mockScheduleResponse),
        } as CancelableRequest<Response>);
        const response = await controller.getSchedule(mockAuthenticatedRequest);
        expect(mockGot).toBeCalledTimes(1);
        expect(mockGot).toBeCalledWith("http://someurl/api/key/?cmd=future");
        expect(response).toEqual(mockScheduleResponse);
    });
});
