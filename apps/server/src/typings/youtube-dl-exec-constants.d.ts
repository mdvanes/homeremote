// Hand-written types for the youtube-dl-exec/src/constants.js CJS subpath,
// which has no package "exports" map and ships no .d.ts of its own.
declare module "youtube-dl-exec/src/constants.js" {
    const constants: {
        GITHUB_TOKEN: string | undefined;
        YOUTUBE_DL_DIR: string;
        YOUTUBE_DL_FILE: string;
        YOUTUBE_DL_FILENAME: string;
        YOUTUBE_DL_HOST: string;
        YOUTUBE_DL_PATH: string;
        YOUTUBE_DL_PLATFORM: string;
        YOUTUBE_DL_SKIP_DOWNLOAD: string | undefined;
    };
    export default constants;
}
