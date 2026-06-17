const { composePlugins, withNx } = require("@nx/webpack");
const { withReact } = require("@nx/react");

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

// Nx plugins for webpack.
module.exports = composePlugins(
    withNx(),
    withReact(),
    withSvgr(),
    (config, { options, context }) => {
        // Update the webpack config as needed here.
        // e.g. config.plugins.push(new MyPlugin())
        // For more information on webpack config and Nx see:
        // https://nx.dev/packages/webpack/documents/webpack-config-setup
        return config;
    }
);
