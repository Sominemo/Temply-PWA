const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WebpackPwaManifest = require("webpack-pwa-manifest")
const workboxPlugin = require("workbox-webpack-plugin")
const BitBarWebpackProgressPlugin = require("bitbar-webpack-progress-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const WebpackAutoInject = require("webpack-auto-inject-version")
const ResourceHintWebpackPlugin = require("resource-hints-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")
const fecha = require("fecha")

const __root = path.join(__dirname, "..", "..")

const pack = require(path.join(__root, "package.json"))

const PATHS = {
    source: path.join(__root, "src"),
    build: path.join(__root, "build"),
    public: "https://app.temply.procsec.top/",
}

PATHS.resources = path.join(PATHS.source, "res")
PATHS.js = path.join(PATHS.source, "js")

module.exports = env => ({
    optimization: {
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    enforce: true,
                },
            },
        },
    },
    entry: [
        path.join(PATHS.js, "index.js"),
    ],
    devtool: "source-map",
    output: {
        path: PATHS.build,
        chunkFilename: "[id].js",
        filename: "[name].js",
        publicPath: PATHS.public,
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        babelrc: true,
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: ["url-loader"],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "assets/fonts/",
                    },
                }],
            },
        ],
    },
    plugins: [
        new BitBarWebpackProgressPlugin(),
        new CleanWebpackPlugin([PATHS.build], {
            root: process.cwd(),
        }),
        new CopyWebpackPlugin([
            { from: path.join(PATHS.resources, ".well-known"), to: path.join(PATHS.build, ".well-known") },
        ]),
        new WebpackAutoInject({
            SILENT: true,
            SHORT: "TEMPLY",
            components: {
                InjectAsComment: false,
                InjectByTag: false,
                AutoIncreaseVersion: true,
            },
            componentsOptions: {
                AutoIncreaseVersion: {
                    runInWatchMode: false,
                },
            },
        }),
        new HtmlWebpackPlugin({
            title: "Temply App",
            favicon: path.join(PATHS.resources, "images", "logo", "favicon.ico"),
            template: path.join(PATHS.source, "index.html"),
            inject: "head",
            charset: "utf-8",
            meta: {
                viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
                description: "Universal time management diary to help you handle the routine",
            },
            prefetch: [
                "https://fonts.googleapis.com/css?family=Roboto:400,500&subset=cyrillic",
                "https://fonts.googleapis.com/css?family=IM+Fell+English:400,400italic|Product+Sans",
            ],
        }),
        new ResourceHintWebpackPlugin(),
        new WebpackPwaManifest({
            name: "Temply - Time Manager",
            short_name: "Temply",
            description: "Universal time management diary to help you handle the routine",
            background_color: "#ffffff",
            theme_color: "#ffffff",
            "theme-color": "#ffffff",
            start_url: "/",
            display: "standalone",
            icons: [
                {
                    src: path.join(PATHS.resources, "images", "logo", "512.png"),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: path.join("assets", "icons"),
                },
            ],
        }),
        new workboxPlugin.GenerateSW({
            swDest: "sw.js",
            clientsClaim: true,
            skipWaiting: true,
            navigateFallback: "/",
            navigateFallbackBlacklist: [/^\.well-known/],
            directoryIndex: "index.html",
            runtimeCaching: [
                {
                    urlPattern: "https://api.temply.procsec.top",
                    handler: "networkFirst",
                },
                {
                    urlPattern: "https://fonts.gstatic.com/",
                    handler: "cacheOnly",
                },
                {
                    urlPattern: "https://fonts.googleapis.com/",
                    handler: "cacheOnly",
                },
            ],
        }),
        new webpack.DefinePlugin({
            __PACKAGE_APP_NAME: JSON.stringify(pack.description),
            __PACKAGE_VERSION_NUMBER: JSON.stringify(pack.version),
            __PACKAGE_BRANCH: JSON.stringify(pack.config.branch),
            __PACKAGE_BUILD_TIME: webpack.DefinePlugin.runtimeValue(() => JSON.stringify(fecha.format(new Date(), "DD.MM.YYYY HH:mm:ss")), true),
        }),
    ],
})
