const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const PORT = '8081';

const HOT_ENTRY_MODULES = [
    `webpack-hot-middleware/client?path=/__what&name=client`,
    'webpack/hot/only-dev-server',
];

const HOT_PLUGINS = [
    new webpack.HotModuleReplacementPlugin(),
];

const IS_DEV = process.env.NODE_ENV !== 'production';

const configs = [
    {
        name: 'client',
        mode: process.env.NODE_ENV || 'development',
        entry: {
            vendor: ['react', 'react-dom'],
            main: [
                ...IS_DEV ? HOT_ENTRY_MODULES : [],
                path.resolve(__dirname, 'src/index.tsx'),
            ],
        },
        output: {
            filename: 'client.[name].[hash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/dist',
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)?$/,
                    use: [
                        'thread-loader',
                        {
                            loader: 'ts-loader',
                            options: {
                                happyPackMode: true,
                                transpileOnly: true,
                            },
                        },
                    ],
                    exclude: [path.resolve(__dirname, 'node_modules')],
                },
                {
                    test: /\.css$/,
                    include: /\.module\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: IS_DEV,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[name]__[local]--[hash:base64:5]',
                                },
                                url: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: /\.module\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: IS_DEV,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                url: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|ttf|woff|woff2|svg|eot)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images',
                                publicPath: 'images',
                                emitFile: true,
                            },
                        },
                    ],
                },
            ],
        },
        devtool: 'inline-source-map',
        resolve: {
            alias: {
                assets: path.resolve(__dirname, 'src/assets'),
            },
            extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
        },
        devServer: {
            port: PORT,
            hot: IS_DEV,
            publicPath: '/dist',
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.resolve(__dirname, 'tsconfig.json'),
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[hash].css',
                chunkFilename: '[name].[id].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            }),
            ...IS_DEV ? HOT_PLUGINS : [],
        ],
    },
    {
        name: 'server',
        target: 'node',
        externals: [
            nodeExternals({modulesFromFile: true, whitelist: [/fontawesome/]}),
        ],
        entry: path.resolve(__dirname, 'src/server/render.tsx'),
        mode: process.env.NODE_ENV || 'development',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js',
            libraryTarget: 'commonjs2',
        },
        resolve: {
            alias: {
                assets: path.resolve(__dirname, 'src/assets'),
            },
            extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.resolve(__dirname, 'tsconfig.node.json'),
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)?$/,
                    use: [
                        'thread-loader',
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                happyPackMode: true,
                            },
                        },
                    ],
                    exclude: [path.resolve(__dirname, 'node_modules')],
                },
                {
                    test: /\.css$/,
                    include: /\.module\.css$/,
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[name]__[local]--[hash:base64:5]',
                                },
                                url: true,
                                onlyLocals: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: /\.module\.css$/,
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: true,
                                onlyLocals: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|ttf|woff|woff2|svg|eot)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                publicPath: 'images',
                                emitFile: false,
                            },
                        },
                    ],
                },
            ],
        },
    },
];
module.exports = configs;
