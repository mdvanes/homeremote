import { fireEvent, render } from "@testing-library/react";
import * as ReactRedux from "react-redux";
import { RootState } from "../../../Reducers";
import * as Store from "../../../store";
import LogCard from "./LogCard";
import { Logline, Severity } from "./logSlice";

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

const mockUseSelectorWith = ({ lines = [] }: { lines?: Logline[] }): void => {
    jest.spyOn(ReactRedux, "useSelector").mockReset();
    jest.spyOn(ReactRedux, "useSelector").mockImplementation((fn) => {
        const mockRootState: Pick<RootState, "loglines"> = {
            loglines: {
                lines,
                urgentMessage: false,
            },
        };
        return fn(mockRootState);
    });
};

describe("LogCard", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.spyOn(Store, "useAppDispatch").mockReturnValue(mockDispatch);
    });

    it("shows the application version", () => {
        mockUseSelectorWith({});
        const { getByText } = render(<LogCard />);
        expect(getByText(/version:/).textContent).toContain("version: ");
    });

    it("shows info logline with icon", () => {
        mockUseSelectorWith({
            lines: [{ message: "my info message", severity: Severity.INFO }],
        });
        const { getByText } = render(<LogCard />);
        expect(getByText(/my info message/)).toMatchSnapshot();
    });

    it("shows error logline with icon", () => {
        mockUseSelectorWith({
            lines: [{ message: "my error message", severity: Severity.ERROR }],
        });
        const { getByText } = render(<LogCard />);
        expect(getByText(/my error message/)).toMatchSnapshot();
    });

    // TODO fireEvent is not handled after migration to mui5
    it.skip("clears log on button click", () => {
        mockUseSelectorWith({});
        const { getByText } = render(<LogCard />);
        const clearButton = getByText("clear").parentElement;
        mockDispatch.mockReset();
        if (clearButton) {
            fireEvent.click(clearButton);
        }
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "loglines/clearLog",
            })
        );
    });
});
