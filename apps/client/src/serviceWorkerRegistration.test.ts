import {
    register,
    SERVICE_WORKER_URL,
    unregister,
} from "./serviceWorkerRegistration";

const { listeners, mockRegister, mockMessageSkipWaiting } = vi.hoisted(() => ({
    listeners: new Map<string, ((event: unknown) => void)[]>(),
    mockRegister: vi.fn(() => Promise.resolve(undefined)),
    mockMessageSkipWaiting: vi.fn(),
}));

vi.mock("workbox-window", () => ({
    Workbox: class {
        addEventListener(type: string, listener: (event: unknown) => void) {
            listeners.set(type, [...(listeners.get(type) ?? []), listener]);
        }
        register = mockRegister;
        messageSkipWaiting = mockMessageSkipWaiting;
    },
}));

const emit = (type: string, event: unknown = {}): void => {
    (listeners.get(type) ?? []).forEach((listener) => listener(event));
};

const mockReload = vi.fn();

const makeWorker = (scriptURL: string): ServiceWorker =>
    ({ scriptURL }) as ServiceWorker;

const makeRegistration = (
    active: ServiceWorker,
    unregisterWorker: () => Promise<boolean>
): ServiceWorkerRegistration =>
    ({
        installing: null,
        waiting: null,
        active,
        unregister: unregisterWorker,
    }) as unknown as ServiceWorkerRegistration;

describe("serviceWorkerRegistration", () => {
    beforeEach(() => {
        listeners.clear();
        vi.clearAllMocks();
        vi.stubEnv("NODE_ENV", "production");
        vi.stubGlobal("location", {
            origin: "https://home.test",
            reload: mockReload,
        });
        vi.stubGlobal("navigator", {
            serviceWorker: {
                controller: null,
                getRegistrations: () => Promise.resolve([]),
            },
        });
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    describe("register", () => {
        it("does nothing outside a production build", () => {
            vi.stubEnv("NODE_ENV", "development");
            register();
            expect(mockRegister).not.toHaveBeenCalled();
        });

        it("registers the service worker", () => {
            register();
            expect(mockRegister).toHaveBeenCalled();
        });

        it("reports a first install as cached for offline use", () => {
            const onSuccess = vi.fn();
            register({ onSuccess });

            emit("installed", { isUpdate: false });

            expect(onSuccess).toHaveBeenCalledWith(
                "Content is cached for offline use."
            );
        });

        it("does not report an update as a first install", () => {
            const onSuccess = vi.fn();
            register({ onSuccess });

            emit("installed", { isUpdate: true });

            expect(onSuccess).not.toHaveBeenCalled();
        });

        it("applies a waiting update and reloads once it takes over", () => {
            const onUpdate = vi.fn();
            register({ onUpdate });

            emit("waiting");
            expect(onUpdate).toHaveBeenCalled();
            expect(mockMessageSkipWaiting).toHaveBeenCalled();

            emit("controlling");
            expect(mockReload).toHaveBeenCalled();
        });

        it("does not reload on the first visit, when clientsClaim takes control", () => {
            register();

            emit("controlling");

            expect(mockReload).not.toHaveBeenCalled();
        });
    });

    describe("unregister", () => {
        const stubRegistrations = (
            registrations: ServiceWorkerRegistration[],
            controller: ServiceWorker | null = null
        ) => {
            vi.stubGlobal("navigator", {
                serviceWorker: {
                    controller,
                    getRegistrations: () => Promise.resolve(registrations),
                },
            });
        };

        it("reports nothing to do when the service worker is not registered", async () => {
            stubRegistrations([]);
            await expect(unregister()).resolves.toBe(false);
        });

        it("leaves the demo mock service worker alone", async () => {
            const mockWorkerUnregister = vi.fn(() => Promise.resolve(true));
            stubRegistrations([
                makeRegistration(
                    makeWorker("https://home.test/mockServiceWorker.js"),
                    mockWorkerUnregister
                ),
            ]);

            await expect(unregister()).resolves.toBe(false);
            expect(mockWorkerUnregister).not.toHaveBeenCalled();
        });

        it("unregisters the pwa service worker", async () => {
            const pwaUnregister = vi.fn(() => Promise.resolve(true));
            stubRegistrations([
                makeRegistration(
                    makeWorker(`https://home.test${SERVICE_WORKER_URL}`),
                    pwaUnregister
                ),
            ]);

            await expect(unregister()).resolves.toBe(false);
            expect(pwaUnregister).toHaveBeenCalled();
        });

        it("reports that a reload is needed when the pwa worker was controlling the page", async () => {
            const controller = makeWorker(
                `https://home.test${SERVICE_WORKER_URL}`
            );
            stubRegistrations(
                [makeRegistration(controller, () => Promise.resolve(true))],
                controller
            );

            await expect(unregister()).resolves.toBe(true);
        });
    });
});
