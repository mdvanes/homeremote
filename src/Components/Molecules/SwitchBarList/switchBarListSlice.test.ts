import switchBarListReducer, {
    initialState,
    toggleExpandScene,
    sendSwitchState,
} from "./switchBarListSlice";
import * as SwitchBarListSlice from "./getSwitchesThunk"; // TODO rename

describe("switchBarListSlice", () => {
    describe("sendSwitchState", () => {
        let getSwitchesSpy: jest.Mock;

        beforeEach(() => {
            getSwitchesSpy = jest.spyOn(
                SwitchBarListSlice,
                "getSwitches"
            ) as jest.Mock;
            getSwitchesSpy.mockReturnValue({
                payload: "mock_getSwitches_payload",
                type: "mock_getSwitches",
            });
        });

        afterEach(() => {
            getSwitchesSpy.mockRestore();
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
            jest.spyOn(window, "fetch");
            (window.fetch as jest.Mock).mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        status: "received",
                    }),
            });
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
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    payload: "mock_getSwitches_payload",
                    type: "mock_getSwitches",
                })
            );
        });

        it("sets dispatches pending and rejected on failed fetch", async () => {
            jest.spyOn(window, "fetch");
            (window.fetch as jest.Mock).mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        status: "some error",
                    }),
            });
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
            jest.spyOn(window, "fetch");
            (window.fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve([]),
            });
            const getSwitchesThunk = SwitchBarListSlice.getSwitches();
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
            jest.spyOn(window, "fetch");
            (window.fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve({ error: "some error" }),
            });
            const getSwitchesThunk = SwitchBarListSlice.getSwitches();
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
                        message: "getSwitches some error",
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
