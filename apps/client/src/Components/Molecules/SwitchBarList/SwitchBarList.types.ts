// Types should be in @homeremote/types/switches.types.ts but it errors with: Support for the experimental syntax 'flow' isn't currently enabled
export const DOMOTICZ_SELECTOR_STATES_OPTIONS = {
    0: "disconnected",
    10: "disarmed",
    20: "partarmed",
    30: "armed",
} as const;

type DomoticzSelectorStateCodes = keyof typeof DOMOTICZ_SELECTOR_STATES_OPTIONS;

const DOMOTICZ_SELECTOR_STATECODE_OPTIONS: DomoticzSelectorStateCodes[] = [
    0, 10, 20, 30,
];

export const isDomoticzSelectorStateCode = (
    nr: number | null
): nr is DomoticzSelectorStateCodes => {
    return DOMOTICZ_SELECTOR_STATECODE_OPTIONS.some((option) => option === nr);
};
