import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import AppStatusButton from "./AppStatusButton";
import { renderWithProviders } from "../../../testHelpers";
import { RootState } from "../../../Reducers";
import appStatusReducer, { initialState } from "./appStatusSlice";
import * as LogSlice from "../LogCard/logSlice";

const fetchSpy = jest.spyOn(window, "fetch");
let logErrorSpy = jest.spyOn(LogSlice, "logError");

type MockRootState = Pick<RootState, "appStatus">;

const renderAppStatusButton = (initialState: MockRootState) =>
    renderWithProviders(<AppStatusButton />, {
        initialState,
        reducers: { appStatus: appStatusReducer },
    });

describe("AppStatusButton", () => {
    beforeEach(() => {
        const mockResponse: Partial<Response> = {
            ok: true,
            json: () =>
                Promise.resolve({
                    status: "Some Status",
                }),
        };
        fetchSpy.mockResolvedValueOnce(mockResponse as Response);
        logErrorSpy = jest.spyOn(LogSlice, "logError");
    });

    afterEach(() => {
        logErrorSpy.mockRestore();
    });

    it("retrieves and shows the application status on load", async () => {
        const { getByText } = renderAppStatusButton({
            appStatus: initialState,
        });

        await waitFor(() => {
            expect(getByText("Some Status")).toBeInTheDocument();
        });

        expect(fetchSpy).toHaveBeenCalledWith(
            "http://localhost/api/status",
            expect.objectContaining({ method: "GET" })
        );
    });

    it("retrieves and shows the updated application status on click", async () => {
        const { getByText } = renderAppStatusButton({
            appStatus: initialState,
        });

        await waitFor(() => {
            expect(getByText("Some Status")).toBeInTheDocument();
        });

        fetchSpy.mockReset();

        const mockResponse: Partial<Response> = {
            ok: true,
            json: () =>
                Promise.resolve({
                    status: "Some New Status",
                }),
        };
        fetchSpy.mockResolvedValueOnce(mockResponse as Response);

        fireEvent.click(getByText("Some Status"));

        await waitFor(() => {
            expect(getByText("Some New Status")).toBeInTheDocument();
        });

        expect(fetchSpy).toHaveBeenCalledWith(
            "http://localhost/api/status",
            expect.objectContaining({ method: "GET" })
        );
    });

    it("dispatches an error message on json error", async () => {
        fetchSpy.mockReset();

        const mockResponse: Partial<Response> = {
            ok: true,
            json: () =>
                Promise.resolve({
                    error: "Some Error",
                }),
        };
        fetchSpy.mockResolvedValueOnce(mockResponse as Response);

        renderAppStatusButton({
            appStatus: initialState,
        });

        await waitFor(() => {
            expect(logErrorSpy).toHaveBeenCalledWith("/api/status Some Error");
        });

        expect(fetchSpy).toHaveBeenCalledWith(
            "http://localhost/api/status",
            expect.objectContaining({ method: "GET" })
        );
    });

    it("dispatches an error message on response not OK", async () => {
        fetchSpy.mockReset();

        const mockResponse: Partial<Response> = {
            ok: false,
            statusText: "500",
            json: () =>
                Promise.resolve({
                    error: "Some Status",
                }),
        };
        fetchSpy.mockResolvedValueOnce(mockResponse as Response);

        renderAppStatusButton({
            appStatus: initialState,
        });

        await waitFor(() => {
            expect(logErrorSpy).toHaveBeenCalledWith("/api/status 500");
        });

        expect(fetchSpy).toHaveBeenCalledWith(
            "http://localhost/api/status",
            expect.objectContaining({ method: "GET" })
        );
    });
});
