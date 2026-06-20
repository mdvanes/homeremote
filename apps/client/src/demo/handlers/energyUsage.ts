import { http, HttpResponse } from "msw";
import {
    getElectric,
    getElectricExports,
    getGasTemperatures,
    getTemperatures,
    getWater,
} from "../data/timeseries";

type Range = "day" | "week" | "month";

const rangeOf = (request: Request, fallback: Range = "day"): Range => {
    const value = new URL(request.url).searchParams.get("range");
    return value === "day" || value === "week" || value === "month"
        ? value
        : fallback;
};

export const energyUsageHandlers = [
    http.get("*/api/energyusage/electric/exports", () =>
        HttpResponse.json(getElectricExports())
    ),
    http.get("*/api/energyusage/electric", ({ request }) =>
        HttpResponse.json(getElectric(rangeOf(request)))
    ),
    http.get("*/api/energyusage/temperature", ({ request }) =>
        HttpResponse.json(getTemperatures(rangeOf(request)))
    ),
    http.get("*/api/energyusage/gas-temperature", ({ request }) =>
        HttpResponse.json(getGasTemperatures(rangeOf(request, "week")))
    ),
    http.get("*/api/energyusage/water", ({ request }) =>
        HttpResponse.json(getWater(rangeOf(request)))
    ),
];
