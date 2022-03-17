jest.mock("./auth/constants", () => ({
    __esModule: true,
    getAuthConfig: () => ({
        users: [
            {
                id: 1,
                name: "john",
                displayName: "John",
                hash: "$2b$my_password_hash",
            },
        ],
    }),
}));
