import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

it("shows the username field of the login screen", () => {
    const { getAllByText } = render(<App />);
    const userNameLabel = getAllByText(/Username/i);
    expect(userNameLabel.length).toBe(2);
});
