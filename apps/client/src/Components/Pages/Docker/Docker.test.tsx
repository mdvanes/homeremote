import { render, screen } from "@testing-library/react";
import { dockerListApi } from "../../../Services/dockerListApi";
import {
    MockStoreProvider,
    MockStoreProviderApi,
    renderWithProviders,
} from "../../../testHelpers";
import LogCard from "../../Molecules/LogCard/LogCard";
import loglinesReducer, {
    initialState,
} from "../../Molecules/LogCard/logSlice";
import Docker from "./Docker";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { DockerListResponse } from "@homeremote/types";
import userEvent from "@testing-library/user-event";

enableFetchMocks();

const mockDockerListResponse: DockerListResponse = {
    status: "received",
    containers: [
        {
            Id: "123",
            Names: ["/some-name"],
            State: "running",
            Status: "Up 5 days",
        },
        {
            Id: "124",
            Names: ["/some-stopped"],
            State: "stopped",
            Status: "Exited 5 days ago",
        },
    ],
};

const loglinesFakeApi: MockStoreProviderApi = {
    reducerPath: "loglines",
    reducer: loglinesReducer,
};

describe("Docker", () => {
    beforeEach(() => {
        fetchMock.resetMocks();

        fetchMock.mockResponse(JSON.stringify(mockDockerListResponse));
        // const mockResponse: Partial<Response> = {
        //     ok: true,
        //     text: () =>
        //         Promise.resolve(`{
        //         "status": "error"
        //     }`),
        // };
        // fetchSpy.mockResolvedValue(mockResponse as Response);
    });

    it("shows a list of docker containers with their status", async () => {
        render(
            <MockStoreProvider apis={[dockerListApi, loglinesFakeApi]}>
                <Docker />
                <LogCard />
            </MockStoreProvider>
        );
        await screen.findByText(/and 1 running/);
        expect(screen.getByText(/some-stopped/)).toBeVisible();
        expect(screen.queryByText("some-name")).not.toBeInTheDocument();
        const buttonElem = screen.getAllByRole("button")[0];
        await userEvent.click(buttonElem);
        await screen.findByText(/some-name/);
        expect(screen.getByText(/some-name/)).toBeVisible();
        expect(screen.getByText(/some-stopped/)).toBeVisible();
    });

    it("forwards an error to log", async () => {
        fetchMock.mockReject(Error("some error"));
        render(
            <MockStoreProvider apis={[dockerListApi, loglinesFakeApi]}>
                <Docker />
                <LogCard />
            </MockStoreProvider>
        );
        // await screen.findByText(/and 1 running/);
        // expect(screen.getByText(/some-stopped/)).toBeVisible();

        // renderWithProviders(
        //     <>
        //         <Docker />
        //         <LogCard />
        //     </>,
        //     {
        //         initialState: {
        //             loglines: initialState,
        //         },
        //         reducers: {
        //             loglines: loglinesReducer,
        //         },
        //     }
        // );
        const elem = await screen.findByText(
            /ERROR: Dockerlist failure: error in getDockerList Error: Error in response/
        );
        expect(elem).toBeInTheDocument();
        expect(fetchMock).toBeCalledTimes(1);
        expect(fetchMock).toBeCalledWith("http://localhost/api/dockerlist");
    });
});
