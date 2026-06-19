import { render } from "@testing-library/react";
import Dashboard from "./Dashboard";

vi.mock("../../Molecules/SwitchBarList/SwitchBarList", () => ({
    default: "mock-switch-bar-list",
}));
vi.mock("../../Molecules/LogCard/LogCard", () => ({
    default: "mock-log-card",
}));
vi.mock("../../Molecules/UrlToMusic/UrlToMusic", () => ({
    default: "mock-url-to-music",
}));
vi.mock("../../Molecules/DownloadList/DownloadList", () => ({
    default: "mock-download-list",
}));
vi.mock("../../Pages/Docker/Docker", () => ({ default: "mock-docker" }));
vi.mock("../../Molecules/DataLora/DataLora", () => ({
    default: "mock-datalora",
}));
vi.mock("../../Molecules/VideoStream/VideoStream", () => ({
    default: "mock-video-stream",
}));
vi.mock("../../Molecules/ServiceLinksBar/ServiceLinksBar", () => ({
    default: "mock-service-links-bar",
}));
vi.mock("../../Molecules/Monit/Monit", () => ({ default: "mock-monit" }));
vi.mock("../../Molecules/Schedule/Schedule", () => ({
    default: "mock-schedule",
}));
vi.mock("../../Molecules/Nextup/Nextup", () => ({ default: "mock-nextup" }));
vi.mock("../../Molecules/GasChart/GasChart", () => ({
    default: "mock-gaschart",
}));
vi.mock("../../Molecules/CarTwin/CarTwinCard", () => ({
    default: "mock-cartwin-card",
    CarTwinCard: "mock-cartwin-card",
}));
vi.mock("../../Molecules/HomeSec/HomeSec", () => ({ default: "mock-homesec" }));
vi.mock("../../Molecules/DockerStackList/DockerStackListCard", () => ({
    default: "mock-dockerstacklist-card",
}));
vi.mock("../../Molecules/SwitchesCard/SwitchesCard", () => ({
    default: "mock-switches-card",
}));
vi.mock("../../Molecules/ClimateSensorsCard/ClimateSensorsCard", () => ({
    default: "mock-climatesensor-card",
}));
vi.mock("../../Molecules/SpeedTestCard/SpeedTestCard", () => ({
    default: "mock-speedtest-card",
}));

describe("Dashboard page", () => {
    it("contains all the control components", () => {
        const { baseElement } = render(<Dashboard />);
        expect(baseElement).toMatchSnapshot();
    });
});
