import React from "react";
import * as ReactRedux from "react-redux";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import SwitchBarList from "./SwitchBarList";
import { RootState } from "../../../Reducers";

describe("SwitchBarList", () => {
    const mockDispatch = jest.fn();
    it("shows a normal light switch", () => {
        jest.spyOn(ReactRedux, "useSelector").mockReset();
        jest.spyOn(ReactRedux, "useSelector").mockImplementation(fn => {
            const mockRootState: RootState = {
                switchesList: {
                    isLoading: false,
                    error: false,
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
                    expanded: [],
                },
            };
            return fn(mockRootState);
        });
        jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(mockDispatch);
        const { getByText } = render(<SwitchBarList />);
        expect(getByText("My Normal Light Switch")).toBeInTheDocument();
    });

    // TODO fix
    // it("?", () => {
    //     jest.spyOn(ReactRedux, "useSelector").mockReset();
    //     jest.spyOn(ReactRedux, "useSelector").mockImplementation(fn => {
    //         const mockRootState: RootState = {
    //             switchesList: {
    //                 isLoading: false,
    //                 error: false,
    //                 switches: [
    //                     {
    //                         idx: "3",
    //                         type: "Light/Switch",
    //                         name: "My Normal Light Switch",
    //                         status: "On",
    //                         dimLevel: null,
    //                         readOnly: false,
    //                         children: false,
    //                     },
    //                 ],
    //                 expanded: [],
    //             },
    //         };
    //         return fn(mockRootState);
    //     });
    //     jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(mockDispatch);
    //     const { getByText, debug, baseElement } = render(<SwitchBarList />);
    //     // debug(baseElement)
    //     // TODO fix MUI class ids (codestar repo?)
    //     const but = baseElement.querySelector("button.makeStyles-root-78");
    //     mockDispatch.mockReset();
    //     fireEvent.click(but);
    //     debug(baseElement);
    //     expect(getByText("My Normal Light Switch")).toBeInTheDocument();
    //     expect(mockDispatch).toHaveBeenCalledWith({});
    // });

    it("shows the loading state", () => {
        jest.spyOn(ReactRedux, "useSelector").mockReset();
        jest.spyOn(ReactRedux, "useSelector").mockImplementation(fn => {
            const mockRootState: RootState = {
                switchesList: {
                    isLoading: true,
                    error: false,
                    switches: [],
                    expanded: [],
                },
            };
            return fn(mockRootState);
        });
        jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(mockDispatch);
        const { getByText } = render(<SwitchBarList />);
        expect(getByText("loading...")).toBeInTheDocument();
    });
});
