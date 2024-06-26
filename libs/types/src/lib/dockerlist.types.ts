export interface DockerContainerInfo {
    Id: string;
    Names: string[];
    State: string;
    Status: string;
    Labels: {
        "com.docker.compose.project": string | null;
    };
}

export type AllResponse = DockerContainerInfo[];

export interface DockerListArgs {
    socketPath?: string;
}

export interface DockerListResponse {
    status: "received" | "error";
    containers?: DockerContainerInfo[];
}
