const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WebpackPwaManifest = require("webpack-pwa-manifest")
const workboxPlugin = require("workbox-webpack-plugin")
const BitBarWebpackProgressPlugin = require("bitbar-webpack-progress-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const WebpackAutoInject = require("webpack-auto-inject-version")
const TerserPlugin = require("terser-webpack-plugin")
const ResourceHintWebpackPlugin = require("resource-hints-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")
const fecha = require("fecha")

const __root = process.cwd()
const builder = {
    pack: require(path.join(__root, "package.json")),
}

const PROD = process.env.NODE_ENV === "production"

const PATHS = {
    source: path.join(__root, "src"),
    build: path.join(__root, "build"),
    public: "https://app.temply.procsec.top/",
}

PATHS.resources = path.join(PATHS.source, "res")
PATHS.js = path.join(PATHS.source, "js")
PATHS.language = path.join(PATHS.resources, "language")
PATHS.themes = path.join(PATHS.resources, "styles", "colors")

// Own scripts
const makeLangMap = require(path.join(__dirname, "scripts", "languageList"))
const makeThemesMap = require(path.join(__dirname, "scripts", "themesList"))
makeLangMap(PATHS.language)
makeThemesMap(PATHS.themes)

const getChangelog = require(path.join(__dirname, "scripts", "getChangelog"))

module.exports = (env = {}) => ({
    optimization: {
        namedChunks: true,
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    enforce: true,
                },
                language: {
                    test: /[\\/]res[\\/]language[\\/].+[\\/]/,
                    enforce: true,
                    name(module, chunks) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]res[\\/]language[\\/](.*?)([\\/]|$)/)[1]
                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `language/${packageName.replace("@", "")}`
                    },
                },
            },
        },
        ...(PROD ? {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    sourceMap: true,
                    cache: true,
                }),
            ],
        } : {}),
    },
    resolve: {
        alias: {
            Resources: PATHS.resources,
            DOMPath: path.resolve(PATHS.js, "ui", "DOM"),
        },
    },
    entry: [
        path.join(PATHS.js, "index.js"),
    ],
    ...(!PROD || env.makeMaps ? { devtool: "source-map" } : {}),
    output: {
        path: PATHS.build,
        chunkFilename: "[id].js",
        filename: "[name].js",
        publicPath: PATHS.public,
    },
    mode: (PROD ? "production" : "development"),
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
                exclude: /theme\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /theme\.css$/,
                loader: "style-loader/useable!css-loader",
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: ["url-loader"],
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "assets/fonts/",
                    },
                }],
            },
            {
                test: /\.svg$/,
                loader: "svg-inline-loader",
            },
        ],
    },
    plugins: [
        new BitBarWebpackProgressPlugin(),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new CopyWebpackPlugin([
            { from: path.join(PATHS.resources, ".well-known"), to: path.join(PATHS.build, ".well-known") },
            { from: path.join(PATHS.resources, "template.htaccess"), to: path.join(PATHS.build, ".htaccess"), toType: "file" },
            { from: path.join(PATHS.resources, "language.template.htaccess"), to: path.join(PATHS.build, "language", ".htaccess"), toType: "file" },
            { from: path.join(PATHS.resources, "images", "logo", "ios"), to: path.join(PATHS.build, "assets", "icons", "ios") },
            { from: path.join(PATHS.resources, "animations"), to: path.join(PATHS.build, "assets", "animations") },
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
                viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
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
            start_url: "/",
            display: "standalone",
            icons: [
                {
                    src: path.join(PATHS.resources, "images", "logo", "512.png"),
                    sizes: [44, 50, 96, 100, 128, 150, 192, 256, 384, 512],
                    destination: path.join("assets", "icons"),
                },
            ],
        }),
        new workboxPlugin.GenerateSW({
            swDest: "sw.js",
            clientsClaim: true,
            skipWaiting: true,
            exclude: [/\.htaccess$/, /language\/.+$/],
            navigateFallback: "/",
            navigateFallbackBlacklist: [/^\.well-known/, /language/],
            directoryIndex: "index.html",
            runtimeCaching: [
                {
                    urlPattern: /language/,
                    handler: "StaleWhileRevalidate",
                },
                {
                    urlPattern: new RegExp("^https://api.temply.procsec.top/"),
                    handler: "NetworkFirst",
                },
                {
                    urlPattern: new RegExp("^https://fonts.gstatic.com/"),
                    handler: "CacheFirst",
                },
                {
                    urlPattern: new RegExp("^https://fonts.googleapis.com/"),
                    handler: "CacheFirst",
                },
            ],
        }),
        new webpack.DefinePlugin({
            __PACKAGE_APP_NAME: JSON.stringify(builder.pack.description),
            __PACKAGE_VERSION_NUMBER: JSON.stringify(builder.pack.version),
            __PACKAGE_BRANCH: JSON.stringify(builder.pack.config.branch),
            __PACKAGE_BUILD_TIME: webpack.DefinePlugin.runtimeValue(() => JSON.stringify(fecha.format(new Date(), "DD.MM.YYYY HH:mm:ss")), true),
            __PACKAGE_CHANGELOG: JSON.stringify(getChangelog(PROD, builder.pack.version, fecha.format(new Date(), "DD.MM.YYYY"), builder.pack.repository)),
        }),
    ],
})
