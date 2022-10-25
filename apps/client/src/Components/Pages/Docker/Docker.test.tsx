import { DockerListResponse } from "@homeremote/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { dockerListApi } from "../../../Services/dockerListApi";
import {
    createGetCalledUrl,
    MockStoreProvider,
    MockStoreProviderApi,
} from "../../../testHelpers";
import LogCard from "../../Molecules/LogCard/LogCard";
import loglinesReducer from "../../Molecules/LogCard/logSlice";
import Docker from "./Docker";

enableFetchMocks();

const getCalledUrl = (callNr: number) => createGetCalledUrl(fetchMock)(callNr);

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
        userEvent.click(buttonElem);
        await screen.findByText(/some-name/);
        expect(screen.getByText(/some-name/)).toBeVisible();
        expect(screen.getByText(/some-stopped/)).toBeVisible();
    });

    it("forwards an error to log", async () => {
        fetchMock.mockReject(Error("getDockerList rejected"));

        render(
            <MockStoreProvider apis={[dockerListApi, loglinesFakeApi]}>
                <Docker />
                <LogCard />
            </MockStoreProvider>
        );

        const elem = await screen.findByText(
            /ERROR: Dockerlist failure: \[FETCH_ERROR\] Error: getDockerList rejected/
        );
        expect(elem).toBeInTheDocument();
        expect(fetchMock).toBeCalledTimes(1);
        expect(getCalledUrl(0)).toBe("http://localhost/api/dockerlist");
    });
});
