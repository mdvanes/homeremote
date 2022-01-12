import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../testHelpers";
import Docker from "./Docker";
import loglinesReducer, {
    initialState,
} from "../../Molecules/LogCard/logSlice";
import LogCard from "../../Molecules/LogCard/LogCard";

const fetchSpy = jest.spyOn(window, "fetch");

describe("Docker", () => {
    beforeEach(() => {
        const mockResponse: Partial<Response> = {
            ok: true,
            text: () =>
                Promise.resolve(`{
                "status": "error"
            }`),
        };
        fetchSpy.mockResolvedValue(mockResponse as Response);
    });

    it("forwards an error to log", async () => {
        renderWithProviders(
            <>
                <Docker />
                <LogCard />
            </>,
            {
                initialState: {
                    loglines: initialState,
                },
                reducers: {
                    loglines: loglinesReducer,
                },
            }
        );
        const elem = await screen.findByText(
            /ERROR: Dockerlist failure: error in getDockerList Error: Error in response/
        );
        expect(elem).toBeInTheDocument();
        expect(fetchSpy).toBeCalledTimes(1);
        expect(fetchSpy).toBeCalledWith("http://localhost/api/dockerlist");
    });
});
