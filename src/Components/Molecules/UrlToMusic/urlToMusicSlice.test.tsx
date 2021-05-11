/**
 * Because of isolatedModules, this does not work in UrlToMusic.test. Here, just test the value of "album".
 */
describe("urlToMusicSlice", () => {
    it("looks like a form", () => {
        // Isolate modules because getFullYear is resolved greedily in urlToMusicSlice
        jest.isolateModules(() => {
            jest.useFakeTimers("modern").setSystemTime(
                new Date("2010-03-14").getTime()
            );

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const slice = require("./urlToMusicSlice");
            expect(slice.initialState.form.album.value).toBe("Songs from 2010");
        });
    });
});
