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
    Status: number;
    CreatedBy: string;
    EndpointId: number;
    EntryPoint: string;
}

export type PortainerStacksResponse = PortainerStack[];
