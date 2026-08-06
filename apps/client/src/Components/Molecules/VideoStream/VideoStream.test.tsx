import { render, screen } from "@testing-library/react";
import Hls from "hls.js";
import VideoStream from "./VideoStream";

vi.mock("hls.js", () => {
    // A regular `function` (not an arrow function) is required here: `new
    // Hls()` in the component invokes this as a constructor, and only a
    // regular function can be constructed with `new` and have its explicit
    // `return {...}` override `this`.
    const MockHls = vi.fn().mockImplementation(function mockHlsInstance() {
        return {
            on: vi.fn(),
            loadSource: vi.fn(),
            attachMedia: vi.fn(),
            destroy: vi.fn(),
        };
    });
    return {
        default: Object.assign(MockHls, {
            isSupported: vi.fn(),
            Events: { ERROR: "hlsError" },
        }),
    };
});

const mockedHls = vi.mocked(Hls);

describe("VideoStream", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the video player when hls.js is supported", async () => {
        vi.mocked(Hls.isSupported).mockReturnValue(true);

        render(<VideoStream />);

        expect(await screen.findByTestId("video-stream-player")).toBeVisible();
    });

    it("wires the resolved manifest URL into hls.js", async () => {
        vi.mocked(Hls.isSupported).mockReturnValue(true);

        render(<VideoStream />);
        await screen.findByTestId("video-stream-player");

        const instance = mockedHls.mock.results[0].value;
        expect(instance.loadSource).toHaveBeenCalledWith(
            expect.stringContaining("/api/video-stream/manifest.m3u8")
        );
        expect(instance.attachMedia).toHaveBeenCalled();
    });

    it("shows a failure message when hls.js is not supported and native HLS is unavailable", async () => {
        vi.mocked(Hls.isSupported).mockReturnValue(false);

        render(<VideoStream />);

        const msg = await screen.findByText("VideoStream failed to load");
        expect(msg).toBeVisible();
    });

    it("shows a failure message on a fatal hls.js error", async () => {
        vi.mocked(Hls.isSupported).mockReturnValue(true);
        let errorHandler: ((event: unknown, data: unknown) => void) | null =
            null;
        mockedHls.mockImplementationOnce(function mockHlsInstance() {
            return {
                on: vi.fn((_event, handler) => {
                    errorHandler = handler;
                }),
                loadSource: vi.fn(),
                attachMedia: vi.fn(),
                destroy: vi.fn(),
            } as never;
        });

        render(<VideoStream />);
        await screen.findByTestId("video-stream-player");

        errorHandler?.({}, { fatal: true });

        const msg = await screen.findByText("VideoStream failed to load");
        expect(msg).toBeVisible();
    });
});
