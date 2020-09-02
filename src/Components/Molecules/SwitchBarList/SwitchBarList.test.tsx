import * as ReactRedux from "react-redux";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import SwitchBarList from "./SwitchBarList";
import { RootState } from "../../../Reducers";

describe("SwitchBarList", () => {
    it("loads", () => {
        jest.spyOn(ReactRedux, "useSelector").mockReset();
        jest.spyOn(ReactRedux, "useSelector").mockImplementation(fn => {
            const mockRootState: RootState = {
                slice1: {},
            };
            return fn(mockRootState);
        });
        const { getByText } = render(<SwitchBarList />);
        expect(getByText("hoi")).toBeInTheDocument();
    });
});
