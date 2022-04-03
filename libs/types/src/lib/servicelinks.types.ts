export interface ServiceLink {
    url: string;
    label: string;
    icon: string;
}

export type ServiceLinksResponse =
    | { status: "received"; servicelinks: ServiceLink[] }
    | { status: "error" };
