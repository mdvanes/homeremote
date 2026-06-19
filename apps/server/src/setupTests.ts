// NestJS dependency injection relies on decorator metadata emitted by swc.
import "reflect-metadata";

vi.mock("./auth/constants", () => ({
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
