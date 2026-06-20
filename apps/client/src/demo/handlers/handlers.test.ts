import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { handlers } from "./index";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const get = async (path: string) => {
    const response = await fetch(`http://localhost${path}`);
    expect(response.ok).toBe(true);
    return response.json();
};

describe("demo handlers", () => {
    it("auto-authenticates via profile/current", async () => {
        const profile = await get("/api/profile/current");
        expect(profile.displayName).not.toBe("");
    });

    it("returns smart entities with switches and climate sensors", async () => {
        const { entities } = await get("/api/smart-entities");
        expect(Array.isArray(entities)).toBe(true);
        const switches = entities.filter(
            (e: { attributes?: { device_class?: string } }) =>
                typeof e.attributes?.device_class === "undefined"
        );
        const climate = entities.filter(
            (e: { attributes?: { device_class?: string } }) =>
                e.attributes?.device_class === "temperature" ||
                e.attributes?.device_class === "humidity"
        );
        expect(switches.length).toBeGreaterThan(0);
        expect(climate.length).toBeGreaterThan(0);
    });

    it("toggles a switch via the update mutation", async () => {
        const { entities } = await get("/api/smart-entities");
        const target = entities.find(
            (e: {
                entity_id?: string;
                attributes?: { device_class?: string };
            }) => typeof e.attributes?.device_class === "undefined"
        );
        const response = await fetch(
            `http://localhost/api/smart-entities/${target.entity_id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: "on" }),
            }
        );
        expect(response.status).toBe(201);

        const after = await get("/api/smart-entities");
        const updated = after.entities.find(
            (e: { entity_id?: string }) => e.entity_id === target.entity_id
        );
        expect(updated.state).toBe("on");
    });

    it("returns electric time-series as State[][]", async () => {
        const data = await get("/api/energyusage/electric?range=day");
        expect(Array.isArray(data)).toBe(true);
        expect(Array.isArray(data[0])).toBe(true);
        expect(data[0].length).toBeGreaterThan(1);
        expect(typeof data[0][0].state).toBe("string");
    });

    it("returns download, status and tracker data", async () => {
        const downloads = await get("/api/downloadlist");
        expect(downloads.status).toBe("received");

        const status = await get("/api/status");
        expect(status.status).toBe("DEMO");

        const datalora = await get("/api/datalora?type=24h");
        expect(Array.isArray(datalora.data)).toBe(true);
        expect(datalora.data[0][0].loc.length).toBe(2);
    });
});
