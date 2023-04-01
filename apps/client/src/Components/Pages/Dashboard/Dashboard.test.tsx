import React from "react";
import { render } from "@testing-library/react";
import Dashboard from "./Dashboard";

jest.mock(
    "../../Molecules/SwitchBarList/SwitchBarList",
    () => "mock-switch-bar-list"
);
jest.mock("../../Molecules/LogCard/LogCard", () => "mock-log-card");
jest.mock("../../Molecules/UrlToMusic/UrlToMusic", () => "mock-url-to-music");
jest.mock(
    "../../Molecules/DownloadList/DownloadList",
    () => "mock-download-list"
);
jest.mock("@mdworld/homeremote-stream-player", () => "mock-stream-player");
jest.mock("../../Pages/Docker/Docker", () => "mock-docker");
jest.mock("../../Molecules/DataLora/DataLora", () => "mock-datalora");
jest.mock("../../Molecules/VideoStream/VideoStream", () => "mock-video-stream");
jest.mock(
    "../../Molecules/ServiceLinksBar/ServiceLinksBar",
    () => "mock-service-links-bar"
);
jest.mock("../../Molecules/Jukebox/Jukebox", () => "mock-jukebox");
jest.mock("../../Molecules/Monit/Monit", () => "mock-monit");
jest.mock("../../Molecules/Schedule/Schedule", () => "mock-schedule");
jest.mock("../../Molecules/Nextup/Nextup", () => "mock-nextup");
jest.mock("../../Molecules/GasChart/GasChart", () => "mock-gaschart");
jest.mock(
    "../../Molecules/PreviouslyPlayedCard/PreviouslyPlayedCard",
    () => "mock-previously-played-card"
);
jest.mock("../../Molecules/CarTwin/CarTwinCard", () => "mock-cartwin-card");

describe("Dashboard page", () => {
    it("contains all the control components", () => {
        const { baseElement } = render(<Dashboard />);
        expect(baseElement).toMatchSnapshot();
    });
});
