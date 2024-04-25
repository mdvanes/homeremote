import { Test, TestingModule } from "@nestjs/testing";
import got, { CancelableRequest, Response } from "got";
import { mocked } from "jest-mock";
import { mockAuthenticatedRequest } from "../util/test-helpers/mockAuthenticatedRequest";
import { DockerlistController } from "./dockerlist.controller";

jest.mock("got");
const mockGot = mocked(got);

describe("DockerList Controller", () => {
    let controller: DockerlistController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DockerlistController],
        }).compile();

        controller = module.get<DockerlistController>(DockerlistController);

        mockGot.mockReset();
    });

    describe("getDockerList GET", () => {
        it("returns a list of running docker containers", async () => {
            mockGot.mockReturnValue({
                json: () => Promise.resolve([]),
            } as CancelableRequest<Response>);
            const result = await controller.getDockerList(
                mockAuthenticatedRequest
            );
            expect(mockGot).toBeCalledWith(
                "http://docker/v1.41/containers/json?all=true",
                {
                    socketPath: "/var/run/docker.sock",
                }
            );
            expect(mockGot).toBeCalledTimes(1);
            expect(result).toEqual({
                status: "received",
                containers: [],
            });
        });

        it("returns an error if the library fails", async () => {
            mockGot.mockReturnValue({
                json: () => Promise.reject("some error"),
            } as CancelableRequest<Response>);

            await expect(
                controller.getDockerList(mockAuthenticatedRequest)
            ).rejects.toThrow("failed to receive downstream data");
            expect(mockGot).toBeCalledWith(
                "http://docker/v1.41/containers/json?all=true",
                {
                    socketPath: "/var/run/docker.sock",
                }
            );
            expect(mockGot).toBeCalledTimes(1);
        });
    });

    describe("startContainer GET", () => {
        it("returns 'received' when succesful", async () => {
            mockGot.mockReturnValue({
                json: () => Promise.resolve(undefined),
            } as CancelableRequest<Response>);
            const result = await controller.startContainer("123");
            expect(mockGot).toBeCalledWith(
                "http://docker/v1.41/containers/123/start",
                { method: "POST", socketPath: "/var/run/docker.sock" }
            );
            expect(mockGot).toBeCalledTimes(1);
            expect(result).toEqual({
                status: "received",
            });
        });
    });

    describe("stopContainer GET", () => {
        it("returns 'received' when succesful", async () => {
            mockGot.mockReturnValue({
                json: () => Promise.resolve(undefined),
            } as CancelableRequest<Response>);
            const result = await controller.stopContainer("123");
            expect(mockGot).toBeCalledWith(
                "http://docker/v1.41/containers/123/stop",
                { method: "POST", socketPath: "/var/run/docker.sock" }
            );
            expect(mockGot).toBeCalledTimes(1);
            expect(result).toEqual({
                status: "received",
            });
        });
    });
});
