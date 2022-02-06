const path = require("path");
const webpack = require('webpack')

module.exports = {
    entry: "./test.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "test.bundle.js",
    },
    mode: "development",
    plugins: [
        // fix "process is not defined" error:
        // (do "npm install process" before running the build)
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
    ],
};