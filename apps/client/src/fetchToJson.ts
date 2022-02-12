import { willAddCredentials } from "./devUtils";

const fetchToJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(`${process.env.NX_BASE_URL}${url}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: willAddCredentials(),
        ...init,
    });

    if (!response.ok) {
        const { message } = await response.json();
        throw new Error(`${url} ${message || response.statusText}`);
    }
    const json = await response.json();

    if (json.error) {
        throw new Error(`${url} ${json.error}`);
    }
    return json;
};

export default fetchToJson;
