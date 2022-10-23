// Force as ES module with import. Do not use export {}, because avoid exports from unit tests.
import "redux";

/**
 * Because of isolatedModules, this does not work in UrlToMusic.test. Here, just test the value of "album".
 */
describe("urlToMusicSlice", () => {
    it("looks like a form", () => {
        // Isolate modules because getFullYear is resolved greedily in urlToMusicSlice
        jest.isolateModules(() => {
            jest.useFakeTimers()       // eslint-disable-next-line @typescript-eslint/no-var-requires
            const slice = require("./urlToMusicSlice");
            expect(slice.initialState.form.album.value).toBe("Songs from 2010");
        });
    });
});
