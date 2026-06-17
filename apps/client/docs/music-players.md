# Music players — feature reference (as-is baseline)

This document captures the **current** behaviour of the three music-player pieces before they are
refactored into a single persistent bottom bar. It is the reference for what must keep working after
the refactor.

The pieces are:

- **HomeremoteStreamPlayer** — the radio stream player (external Elm component).
- **PreviouslyPlayedCard** — the "recently played on radio" list.
- **Jukebox** — the local-library player (playlists, songs, add-to-playlist).

They are tied together by the global **HotKeyProvider**, which owns play/pause state, the keyboard
shortcuts and the "skip radio" behaviour.

---

## 1. HomeremoteStreamPlayer (radio)

Package: `@mdworld/homeremote-stream-player` (Elm, rendered via `react-elm-components`). In this repo it
is wrapped by `StreamContainer` + `StyledStreamPlayer` and rendered together with `PreviouslyPlayedCard`.

### Channels

A `<select>` switches between four hard-coded channels. Each channel has a `streamUrl` and a
`nowPlayingUrl`:

| Channel       | Stream URL                                            | Now-playing endpoint        |
| ------------- | ----------------------------------------------------- | --------------------------- |
| NPO Radio 2   | `https://icecast.omroep.nl/radio2-bb-mp3`             | `/api/nowplaying/radio2`    |
| 3FM           | `https://icecast.omroep.nl/3fm-bb-mp3`                | `/api/nowplaying/radio3`    |
| Sky Radio     | `https://19993.live.streamtheworld.com/SKYRADIO.mp3`  | `/api/nowplaying/sky`       |
| Pinguin Radio | `http://streams.pinguinradio.com/PinguinRadio320.mp3` | `/api/nowplaying/pinguin`   |

NPO Radio 2 is the default channel.

### Audio playback

- A native `<audio controls>` element streams `channel.streamUrl` with a **cache-busting timestamp**
  appended (`streamUrl?<timestamp>`). The timestamp is refreshed every time playback is (re)started so a
  fresh live connection is opened instead of resuming a stale buffer.
- The visible `<audio>` controls are hidden via CSS in the standalone widget; play/pause is driven
  through custom controls and through Elm **ports** (see below).

### Now-playing information

- On the audio `play` event and on every channel change, the component fetches the channel's
  `nowPlayingUrl`.
- The response (`NowPlayingResponse`) provides `artist`, `title`, programme `name`, `imageUrl` and
  `songImageUrl`.
- Displayed: programme `name` (channel-info line), `title`, `artist`, and an image. The image prefers
  `songImageUrl` and falls back to `imageUrl`.
- A "get now playing" button (rendered as the current image) manually refetches the now-playing info.
- On a failed fetch the title/artist show `UNKNOWN` and the programme name falls back to the channel name.

### React ⇄ Elm ports

The Elm app exposes two ports (typed in `StreamPlayer.d.ts`):

- `setPlayPauseStatusPort.subscribe(handler)` — Elm notifies React when the radio play/pause status
  changes (`"Play"` / `"Pause"`). `HotKeyProvider` uses this to track `isRadioPlaying`.
- `receivePlayPauseStatusPort.send(status)` — React tells Elm to play or pause the radio.

`StreamContainer` passes `setPorts` (from `HotKeyProvider`) into the player so the rest of the app can
control the radio.

### Styling

`StyledStreamPlayer` is a MUI `styled(Container)` that themes the Elm widget's class names (`.card`,
`.channel`, `.controls`, `.artist`, `.title`, …) to match the app's MUI theme (colors, play-button
fill states, channel-info max height, etc.). Max width is 800px.

---

## 2. PreviouslyPlayedCard

Component: `PreviouslyPlayedCard`. Shows the tracks recently played on the radio (NPO Radio 2).

- Data: `useGetRadio2PreviouslyQuery` (manual `nowplayingApi`, endpoint `/api/nowplaying/radio2previously`),
  **polled every 3 minutes** (`UPDATE_INTERVAL_MS`).
- Collapsed state: a single down-arrow `IconButton` (absolutely positioned) that expands the card.
- Expanded state: a `Paper` `List` (max height 400px, scrollable) with an up-arrow to collapse and a
  `LoadingDot` reflecting `isLoading || isFetching`.
- Each track row (`PreviouslyResponse`) shows:
  - **Primary**: `artist - title`. If the track has a `listenUrl`, the primary text is a link.
  - **Secondary**: `time.start` formatted as `HH:MM`, followed by `broadcast.title / broadcast.presenters`.
  - **Background image**: `songImageUrl ?? broadcast.imageUrl`, shown right-aligned, contained, no-repeat.
- Rows are keyed by `time.start`.

### Server data source

`/api/nowplaying/radio2previously` (NestJS `NowplayingController`) builds the list from the
`@mdworld/radio-metadata` library (`getRadioMetaData("npo2")`), mapping each track to a
`PreviouslyResponse` with `artist`, `title`, `name`, `imageUrl`, `songImageUrl`, `listenUrl`,
`broadcast` and `time`. It also sets `last_updated = Date.now()` on every call (so `last_updated` is
**not** a reliable "new song" signal — `time.start` is the meaningful timestamp).

---

## 3. Jukebox

Components: `Jukebox`, `JukeboxPlayer`, `JukeboxSongList`, plus `AddSongToPlaylistButton`,
`SongDirDialog`, `SongDirSelectPlaylistDialog`. Data via `jukeboxApi` (`/api/jukebox/...`).

### Playlists & browsing

- `useGetPlaylistsQuery` loads playlists; the component renders nothing until the response status is
  `received`.
- `CardExpandBar` ("browse") toggles the browse panel open/closed.
- When no playlist is selected, a `List` of playlists is shown. Each item has:
  - an `Avatar` cover-art image from `/api/jukebox/coverart/:id?type=<type>&hash=<name>`,
  - the playlist `name`,
  - a star icon when `type === "album"`.
  - Selecting a playlist stores it in `localStorage` under `LAST_PLAYLIST`.
- `JukeboxSongList` shows the selected playlist's songs with a "back" button (clears the selection).
  - Album tracks show `track. title`; other songs show `artist - title`.
  - Selecting a song sets it as current, stores it under `LAST_SONG`, and starts playback after a short
    delay (waiting for the `<audio>` to load the new `src`).

### Player (`JukeboxPlayer`)

- Plays `<audio controls src="/api/jukebox/song/:id?hash=<artist - title>">`.
- Shows `artist - title` and the playlist name.
- Controls:
  - **Previous** (`getPrevSong`) — title "Previous track (a)".
  - **Next** (`getNextSong`) — title "Next track (d)"; also fired on the audio `ended` event (auto-advance).
  - **Skip radio** (`Forward10Icon`) — calls `handleSkipRadio`; while a skip is active the button is
    disabled-looking and titled "Skip radio in progress!".
  - **HotKeyCoach** — help popper listing the keyboard shortcuts.
  - **AddSongToPlaylistButton** — adds the current song to a playlist.
- Prev/next handlers are published to `HotKeyProvider` (`setHandlePlayPrev` / `setHandlePlayNext`) so the
  keyboard shortcuts can drive them.

### Persistence (`useLocalStorage`)

On mount, restores the last playlist (`LAST_PLAYLIST`) and last song (`LAST_SONG`) from `localStorage`,
so the jukebox reopens on the previously selected song.

### Shared audio element

`Jukebox` creates the `<audio>` ref and publishes it to `HotKeyProvider` via `setJukeboxElem`, so the
global hotkeys and the "skip radio" logic can play/pause the jukebox.

---

## 4. HotKeyProvider (global glue)

`HotKeyProvider` holds non-serializable, app-wide player state in React context (not Redux):

- `ports` (radio Elm ports) and `jukeboxElem` (jukebox `<audio>` ref).
- `isRadioPlaying` (kept in sync via the radio's `setPlayPauseStatusPort`).
- `handlePlayPrev` / `handlePlayNext` (published by `JukeboxPlayer`).
- `handleSkipRadio` + `isSkipRadioActive`.

### Keyboard shortcuts

Key presses are ignored while typing in an `INPUT` element. The map:

| Key | Action                                |
| --- | ------------------------------------- |
| `q` | play/pause radio                      |
| `w` | toggle between radio and jukebox      |
| `a` | play previous on jukebox              |
| `s` | play/pause jukebox                    |
| `d` | play next on jukebox                  |
| `f` | skip radio (N minutes — see below)    |

- **toggleRadio** — sends `Play`/`Pause` to the radio port (and clears any active skip).
- **toggleJukebox** — plays/pauses the jukebox `<audio>` (and clears any active skip).
- **toggleBetween** — pauses one source and plays the other, depending on `isRadioPlaying`.

### Skip radio (current behaviour)

- Configurable via `localStorage` key `SKIP_MINUTES` (default **10**); `SKIP_TIME = SKIP_MINUTES * 60 * 1000`.
- On skip (only when the radio is playing): pause radio, play jukebox, log "Radio will resume at
  &lt;time&gt;", mark `isSkipRadioActive`, and start a **fixed `setTimeout`**.
- When the timer fires: pause jukebox, resume radio, clear the skip state, log "Skip radio finished".
- Cancelling (any toggle) clears the timer and logs "Skip radio cancelled".

> The refactor replaces this fixed timer with **metadata-driven** resume: watch the radio metadata
> `time.start`; resume the radio when a new song starts, with a 20-minute fallback.

---

## 5. Where these are mounted today

- `Dashboard` page: `StreamContainer`, `UrlToMusic`, `Jukebox`, optional `VideoStream`
  (gated behind `localStorage.showVideoStream === "true"`), …
- `/streams` route → `Streams` page → `StreamContainer`.
- `/jukebox` route → `Jukebox`.

Because they are mounted per page, navigating away unmounts the players and **stops playback** — the
problem the bottom-bar refactor solves. After the refactor the players live in a single global bottom
bar, the `/streams` and `/jukebox` routes are removed, and `VideoStream` is excluded from the bar.
