import React from "react";
import AppSkeleton from "./AppSkeleton";
import { render } from "@testing-library/react";

describe("AppSkeleton", () => {
    it("shows a preview of the application", async () => {
        const { asFragment } = render(<AppSkeleton />);
        expect(asFragment()).toMatchSnapshot();
    });
});
