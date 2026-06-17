export type RadioChannelId = "radio2" | "radio3" | "sky" | "pinguin";

export interface RadioChannel {
    id: RadioChannelId;
    name: string;
    streamUrl: string;
}

// Mirrors the channels from the former Elm stream player (Audio.elm). Each
// channel streams an mp3 and has a matching /api/nowplaying/<id> endpoint.
export const CHANNELS: RadioChannel[] = [
    {
        id: "radio2",
        name: "NPO Radio 2",
        streamUrl: "https://icecast.omroep.nl/radio2-bb-mp3",
    },
    {
        id: "radio3",
        name: "3FM",
        streamUrl: "https://icecast.omroep.nl/3fm-bb-mp3",
    },
    {
        id: "sky",
        name: "Sky Radio",
        streamUrl: "https://19993.live.streamtheworld.com/SKYRADIO.mp3",
    },
    {
        id: "pinguin",
        name: "Pinguin Radio",
        streamUrl: "http://streams.pinguinradio.com/PinguinRadio320.mp3",
    },
];

export const DEFAULT_CHANNEL_ID: RadioChannelId = "radio2";

export const LAST_RADIO_CHANNEL = "LAST_RADIO_CHANNEL";

export const getInitialChannelId = (): RadioChannelId => {
    const stored = localStorage.getItem(LAST_RADIO_CHANNEL);
    if (stored && CHANNELS.some((channel) => channel.id === stored)) {
        return stored as RadioChannelId;
    }
    return DEFAULT_CHANNEL_ID;
};
