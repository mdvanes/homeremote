import { act } from "@testing-library/react";
import { RootState } from "../../../Reducers";
import { renderWithProviders } from "../../../testHelpers";
import authenticationReducer, {
    AuthenticationState,
} from "../../Providers/Authentication/authenticationSlice";
import OfflineBanner from "./OfflineBanner";

type MockRootState = Pick<RootState, "authentication">;

const authenticationState: AuthenticationState = {
    id: 1,
    displayName: "John",
    error: false,
    isLoading: false,
    isOffline: false,
    isSignedIn: true,
    loginMethod: null,
    oidcEnabled: false,
};

const setBrowserOnline = (isOnline: boolean): void => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(isOnline);
};

const renderBanner = (isOffline: boolean) => {
    const initialState: MockRootState = {
        authentication: { ...authenticationState, isOffline },
    };
    return renderWithProviders(<OfflineBanner />, {
        initialState,
        reducers: { authentication: authenticationReducer },
    });
};

describe("OfflineBanner", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("stays out of the way while online", () => {
        setBrowserOnline(true);
        const { queryByTestId } = renderBanner(false);
        expect(queryByTestId("offline-banner")).not.toBeInTheDocument();
    });

    it("shows when the service worker reports the server is unreachable", () => {
        setBrowserOnline(true);
        const { getByTestId, getByText } = renderBanner(true);
        expect(getByTestId("offline-banner")).toBeInTheDocument();
        expect(getByText("You are offline")).toBeInTheDocument();
    });

    it("shows when the browser reports no network", () => {
        setBrowserOnline(false);
        const { getByTestId } = renderBanner(false);
        expect(getByTestId("offline-banner")).toBeInTheDocument();
    });

    it("appears and disappears with the browser connectivity events", () => {
        setBrowserOnline(true);
        const { queryByTestId } = renderBanner(false);
        expect(queryByTestId("offline-banner")).not.toBeInTheDocument();

        act(() => {
            setBrowserOnline(false);
            window.dispatchEvent(new Event("offline"));
        });
        expect(queryByTestId("offline-banner")).toBeInTheDocument();

        act(() => {
            setBrowserOnline(true);
            window.dispatchEvent(new Event("online"));
        });
        expect(queryByTestId("offline-banner")).not.toBeInTheDocument();
    });
});
