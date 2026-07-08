import { components } from "./generated/dockerEngine";

export type DockerEngineContainerSummary =
    components["schemas"]["ContainerSummary"];

export type DockerEnginePort = components["schemas"]["Port"];

export type DockerEngineContainersResponse = DockerEngineContainerSummary[];
