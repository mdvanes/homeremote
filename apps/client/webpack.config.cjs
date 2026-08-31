const { composePlugins, withNx } = require("@nx/webpack");
const { withReact } = require("@nx/react");
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

// SVGR support (migrated from the svgr option in withReact, removed in Nx 22).
// Configured with a named `ReactComponent` export to match existing imports,
// the @nx/react jest mock and the @nx/react/typings/image.d.ts declarations.
function withSvgr(svgrOptions = {}) {
    const defaultOptions = {
        svgo: false,
        titleProp: true,
        ref: true,
        exportType: "named",
        namedExport: "ReactComponent",
    };

    const options = { ...defaultOptions, ...svgrOptions };

    return function configure(config) {
        // Exclude .svg from existing asset rules (Nx bundles svg together with
        // png/jpg/... in a single asset/resource rule) so other image types
        // keep working, then route .svg through SVGR below.
        for (const rule of config.module.rules) {
            if (
                rule &&
                typeof rule === "object" &&
                typeof rule.test !== "undefined" &&
                rule.test.toString().includes("svg")
            ) {
                rule.exclude = [].concat(rule.exclude || [], /\.svg$/);
            }
        }

        // Add SVGR loader with webpack 5 asset modules
        config.module.rules.push({
            test: /\.svg$/,
            oneOf: [
                {
                    resourceQuery: /url/,
                    type: "asset/resource",
                    generator: {
                        filename: "[name].[hash][ext]",
                    },
                },
                {
                    issuer: /\.(js|ts|md)x?$/,
                    use: [
                        {
                            loader: require.resolve("@svgr/webpack"),
                            options,
                        },
                    ],
                },
            ],
        });

        return config;
    };
}

// The service worker is only registered in production builds (see main.tsx), so
// only generate it there. This also avoids workbox re-running the injection on
// every recompile in `nx serve` watch mode.
// InjectManifest compiles swSrc with a webpack child compiler that inherits the
// parent's module rules, so the TypeScript source in libs/ is transpiled by the
// same babel-loader as the app.
function withServiceWorker() {
    return function configure(config, { options }) {
        const isProduction =
            options?.optimization === true ||
            process.env.NODE_ENV === "production";

        if (!isProduction) {
            return config;
        }

        config.plugins.push(
            new InjectManifest({
                swSrc: path.resolve(
                    __dirname,
                    "../../libs/service-worker/src/service-worker.ts"
                ),
                swDest: "service-worker.js",
                // Keeps the workbox defaults and additionally drops MSW's
                // worker, which is only used by demo mode and must never be
                // served from the PWA precache.
                exclude: [
                    /\.map$/,
                    /^manifest.*\.js$/,
                    /^mockServiceWorker\.js$/,
                ],
                // client:build uses outputHashing: "all", so asset URLs already
                // carry a content hash and don't need a __WB_REVISION__ suffix.
                dontCacheBustURLsMatching: /\.[0-9a-f]{8,20}\./,
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            })
        );

        return config;
    };
}

// Nx plugins for webpack.
module.exports = composePlugins(
    withNx(),
    withReact(),
    withSvgr(),
    withServiceWorker(),
    (config, { options, context }) => {
        // Update the webpack config as needed here.
        // e.g. config.plugins.push(new MyPlugin())
        // For more information on webpack config and Nx see:
        // https://nx.dev/packages/webpack/documents/webpack-config-setup
        return config;
    }
);
