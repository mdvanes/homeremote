import { render } from "@testing-library/react";
import AppSkeleton from "./AppSkeleton";

describe("AppSkeleton", () => {
    it("shows a preview of the application", async () => {
        const { asFragment } = render(<AppSkeleton />);
        expect(asFragment()).toMatchSnapshot();
    });
});
