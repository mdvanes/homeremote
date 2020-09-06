import switchBarListReducer, {
    getSwitches,
    initialState,
    sendSwitchState,
} from "./switchBarListSlice";

describe("switchBarListSlice", () => {
    describe("sendSwitchState", () => {
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
            const mockResponseJson = jest.fn();
            (window.fetch as jest.Mock).mockResolvedValue({
                json: mockResponseJson,
            });
            mockResponseJson
                .mockResolvedValueOnce({ status: "received" })
                .mockResolvedValueOnce([]);
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
                    payload: [],
                    type: "switchesList/sendSwitchState/fulfilled",
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
            // interface GlobalFetch extends NodeJS.Global {

            // }
            // const globalFetch: any = global;
            jest.spyOn(window, "fetch");
            (window.fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve([]),
            });
            const getSwitchesThunk = getSwitches();
            const mockDispatch = jest.fn();
            const mockGetState = jest.fn();
            // const switches =
            await getSwitchesThunk(mockDispatch, mockGetState, {});
            // expect(switches).toEqual(
            //     expect.objectContaining({
            //         payload: [],
            //         type: "switchesList/getSwitches/fulfilled",
            //     })
            // );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    // payload: [],
                    type: "switchesList/getSwitches/pending",
                })
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    payload: [],
                    type: "switchesList/getSwitches/fulfilled",
                })
            );
            // expect(mockGetState).toHaveBeenCalledWith([]);
        });

        // TODO
        // it("calls getSwitches after setState")
    });
});
