export const willAddCredentials = (): "include" | "same-origin" =>
    process.env.NODE_ENV === "development" ? "include" : "same-origin";
