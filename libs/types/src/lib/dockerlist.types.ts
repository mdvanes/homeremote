export interface DockerContainerInfo {
    Id: string;
    Names: string[];
    State: string;
    Status: string;
    Labels: {
        "com.docker.compose.project": string | null;
    };
    Ports?: {
        IP?: "0.0.0.0" | "::";
        PrivatePort?: number;
        PublicPort: number;
        Type?: "tcp" | "udp";
    }[];
}

export interface DockerContainerUIInfo extends DockerContainerInfo {
    url?: string;
    icon?: string;
}

export type AllResponse = DockerContainerInfo[];

export interface DockerListArgs {
    socketPath?: string;
}

export interface DockerListResponse {
    status: "received" | "error";
    containers?: DockerContainerUIInfo[];
}
