import { components } from "./generated/portainer";

export type PortainerApiStack = components["schemas"]["Stack"];

export type PortainerApiStacksResponse = PortainerApiStack[];
