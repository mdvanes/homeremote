import * as GetSwitchesThunk from "./getSwitchesThunk";
import switchBarListReducer, {
    initialState,
    sendSwitchState,
    toggleExpandScene,
} from "./switchBarListSlice";

describe("switchBarListSlice", () => {
    describe("sendSwitchState", () => {
        const fetchSpy = jest.spyOn(window, "fetch");

        beforeEach(() => {
            const mockResponse: Partial<Response> = {
                ok: true,
                json: () =>
                    Promise.resolve({
                        status: "received",
                    }),
            };
            fetchSpy.mockResolvedValue(mockResponse as Response);
        });

        it("updates fields on fulfilled", () => {
            const state = {
                ...initialState,
                isLoading: true,
            };
            const result = switchBarListReducer(state, {
                payload: {
                    switches: [
                        {
                            idx: "3",
                            type: "Light/Switch",
                            name: "My Normal Light Switch",
                            status: "On",
                            dimLevel: null,
                            readOnly: false,
                            children: false,
                        },
                    ],
                },
                type: "switchesList/sendSwitchState/fulfilled",
            });
            expect(result).toEqual({
                error: false,
                expanded: [],
                isLoading: false,
                switches: [],
            });
        });

        it("updates fields on pending", () => {
            const state = {
                ...initialState,
                error: "some message",
            };
            const result = switchBarListReducer(state, {
                type: "switchesList/sendSwitchState/pending",
            });
            expect(result).toEqual({
                error: false,
                expanded: [],
                isLoading: true,
                switches: [],
            });
        });

        it("updates fields on rejected", () => {
            const state = {
                ...initialState,
                isLoading: true,
            };
            const result = switchBarListReducer(state, {
                error: {
                    message: "some message",
                },
                type: "switchesList/sendSwitchState/rejected",
            });
            expect(result).toEqual({
                error: "some message",
                expanded: [],
                isLoading: false,
                switches: [],
            });
        });

        it("sets dispatches pending and fulfilled on resolved fetch", async () => {
            const sendSwitchStateThunk = sendSwitchState({
                id: "id1",
                state: "on",
                type: "switch",
            });
            const mockDispatch = jest.fn();
            const mockGetState = jest.fn();
            await sendSwitchStateThunk(mockDispatch, mockGetState, {});
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "switchesList/sendSwitchState/pending",
                })
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "switchesList/sendSwitchState/fulfilled",
                })
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    payload: "Switch id1 on",
                    type: "loglines/logInfo",
                })
            );
        });

        it("sets dispatches pending and rejected on failed fetch", async () => {
            const mockResponse: Partial<Response> = {
                ok: true,
                json: () =>
                    Promise.resolve({
                        status: "some error",
                    }),
            };
            fetchSpy.mockResolvedValueOnce(mockResponse as Response);
            const sendSwitchStateThunk = sendSwitchState({
                id: "id1",
                state: "on",
                type: "switch",
            });
            const mockDispatch = jest.fn();
            const mockGetState = jest.fn();
            await sendSwitchStateThunk(mockDispatch, mockGetState, {});
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "switchesList/sendSwitchState/pending",
                })
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: "Can't set on: some error",
                    }),
                    type: "switchesList/sendSwitchState/rejected",
                })
            );
            expect(mockDispatch).not.toHaveBeenCalledWith(
                expect.objectContaining({
                    payload: "Switch id1 on",
                    type: "loglines/logInfo",
                })
            );
            expect(mockDispatch).not.toHaveBeenCalledWith(
                expect.objectContaining({
                    payload: "mock_getSwitches_payload",
                    type: "mock_getSwitches",
                })
            );
        });
    });

    describe("getSwitches", () => {
        const fetchSpy = jest.spyOn(window, "fetch");

        it("updates fields on fulfilled", () => {
            const state = {
                ...initialState,
                isLoading: true,
            };
            const result = switchBarListReducer(state, {
                payload: {
                    switches: [
                        {
                            idx: "3",
                            type: "Light/Switch",
                            name: "My Normal Light Switch",
                            status: "On",
                            dimLevel: null,
                            readOnly: false,
                            children: false,
                        },
                    ],
                },
                type: "switchesList/getSwitches/fulfilled",
            });
            expect(result).toEqual({
                error: false,
                expanded: [],
                isLoading: false,
                switches: [
                    expect.objectContaining({
                        name: "My Normal Light Switch",
                    }),
                ],
            });
        });

        it("updates fields on pending", () => {
            const state = {
                ...initialState,
                error: "some message",
            };
            const result = switchBarListReducer(state, {
                type: "switchesList/getSwitches/pending",
            });
            expect(result).toEqual({
                error: false,
                expanded: [],
                isLoading: true,
                switches: [],
            });
        });

        it("updates fields on rejected", () => {
            const state = {
                ...initialState,
                isLoading: true,
            };
            const result = switchBarListReducer(state, {
                error: {
                    message: "some message",
                },
                type: "switchesList/getSwitches/rejected",
            });
            expect(result).toEqual({
                error: "some message",
                expanded: [],
                isLoading: false,
                switches: [],
            });
        });

        it("sets dispatches pending and fulfilled on resolved fetch", async () => {
            const mockResponse: Partial<Response> = {
                ok: true,
                json: () => Promise.resolve([]),
            };
            fetchSpy.mockResolvedValueOnce(mockResponse as Response);
            const getSwitchesThunk = GetSwitchesThunk.getSwitches();
            const mockDispatch = jest.fn();
            const mockGetState = jest.fn();
            await getSwitchesThunk(mockDispatch, mockGetState, {});
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "switchesList/getSwitches/pending",
                })
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    payload: [],
                    type: "switchesList/getSwitches/fulfilled",
                })
            );
        });

        it("sets dispatches pending and rejected on error in fetch", async () => {
            const mockResponse: Partial<Response> = {
                ok: true,
                json: () => Promise.resolve({ error: "some error" }),
            };
            fetchSpy.mockResolvedValueOnce(mockResponse as Response);
            const getSwitchesThunk = GetSwitchesThunk.getSwitches();
            const mockDispatch = jest.fn();
            const mockGetState = jest.fn();
            await getSwitchesThunk(mockDispatch, mockGetState, {});
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "switchesList/getSwitches/pending",
                })
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: "/api/switches some error",
                    }),
                    type: "switchesList/getSwitches/rejected",
                })
            );
        });
    });

    describe("toggleExpandScene", () => {
        it("adds a scene that has not been expanded yet", () => {
            const state = initialState;
            const result = switchBarListReducer(state, {
                payload: { sceneIdx: "1" },
                type: toggleExpandScene.type,
            });
            expect(result).toEqual(
                expect.objectContaining({
                    expanded: ["1"],
                })
            );
        });

        it("removes a scene that has been expanded", () => {
            const state = { ...initialState, expanded: ["1"] };
            const result = switchBarListReducer(state, {
                payload: { sceneIdx: "1" },
                type: toggleExpandScene.type,
            });
            expect(result).toEqual(
                expect.objectContaining({
                    expanded: [],
                })
            );
        });
    });
});
