const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    target: 'node',
    entry: path.resolve(__dirname, './src/server.ts'),
    mode: NODE_ENV,
    externals: [
        nodeExternals({modulesFromFile: true}),
    ],
    watch: NODE_ENV === 'development',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [new NodemonPlugin()],
};
