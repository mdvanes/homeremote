const { composePlugins, withNx } = require("@nx/webpack");

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
    // Emit an ESM bundle instead of CommonJS so that ESM-only runtime
    // dependencies (e.g. openid-client v6, got v12+) can be imported at
    // runtime. Nx externalizes node_modules for the node target, so the
    // bundle must `import` (not `require`) them.
    config.experiments = { ...config.experiments, outputModule: true };

    config.output = {
        ...config.output,
        module: true,
        chunkFormat: "module",
        chunkLoading: "import",
        library: { type: "module" },
    };
    delete config.output.libraryTarget;

    // Nx's externals function tags every external as "commonjs <request>",
    // which forces require() even in an ESM bundle. Re-tag them as "module"
    // so webpack emits native `import` statements that work for both CJS and
    // ESM-only packages.
    const nxExternals = Array.isArray(config.externals)
        ? config.externals
        : [config.externals];
    config.externals = nxExternals.map((external) => {
        if (typeof external !== "function") {
            return external;
        }
        return function moduleExternals(data, callback) {
            external(data, (err, result) => {
                if (err) {
                    return callback(err);
                }
                if (
                    typeof result === "string" &&
                    result.startsWith("commonjs ")
                ) {
                    return callback(
                        null,
                        `module ${result.slice("commonjs ".length)}`
                    );
                }
                return callback(null, result);
            });
        };
    });

    // In an ESM bundle `__dirname`/`__filename` are not defined by Node.
    // "node-module" makes webpack derive them from `import.meta.url` so they
    // resolve to the emitted bundle's directory, matching the previous CJS
    // build behaviour (used for static assets and the auth.json lookup).
    config.node = {
        ...config.node,
        __dirname: "node-module",
        __filename: "node-module",
    };

    return config;
});
