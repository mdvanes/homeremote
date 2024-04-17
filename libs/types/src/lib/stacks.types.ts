export interface StackItem {
    Id: number;
    Name: string;
    Status: number;
    EndpointId: number;
}

export type StacksResponse = StackItem[];

export interface PortainerStack {
    Id: number;
    Name: string;
    Type: number;
    EndpointId: number;
    SwarmId: string;
    EntryPoint: string;
    Env: [];
    ResourceControl: null;
    Status: number;
    ProjectPath: string;
    CreationDate: number;
    CreatedBy: string;
    UpdateDate: number;
    UpdatedBy: string;
    AdditionalFiles: null;
    AutoUpdate: null;
    Option: null;
    GitConfig: null;
    FromAppTemplate: boolean;
    Namespace: string;
    IsComposeFormat: boolean;
}

export type PortainerStacksResponse = PortainerStack[];
