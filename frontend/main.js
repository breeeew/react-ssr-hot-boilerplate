const express = require('express');
const webpack = require('webpack');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const configs = require('./webpack.config');
const process = require('process');
const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const server = express();
server.use('/dist', express.static(path.resolve(__dirname, './dist')));
server.use('/images', express.static(path.resolve(__dirname, './dist/images')));
server.get('/favicon.ico', (req, res) => res.send(''));

let started = false;

const start = () => {
    if (started) {
        return;
    }

    server.listen('3001', () => {
        console.log('http://127.0.0.1:3001');
        started = true;
    });
};

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const main = () => {
    const clientConfig = configs.find(config => config.name === 'client');

    if (isDev) {
        const compiler = webpack(configs);

        server.use(webpackDevMiddleware(compiler, {
            publicPath: clientConfig.output.publicPath,
            serverSideRender: true,
        }));

        server.use(webpackHotMiddleware(compiler, {
            path: '/__what',
        }));

        server.use(webpackHotServerMiddleware(compiler));
        compiler.hooks.done.tap('startServerHook', () => {
            console.log('starting...');
            start();
        });
    } else {
        webpack(configs).run((_, stats) => {
            const statsParsed = stats.toJson();
            const clientStats = statsParsed && statsParsed.children && statsParsed.children[0];
            const render = require('./build/render.js').default;
            console.log(
                stats.toString({
                    colors: true,
                }),
            );
            server.use(render({clientStats}));
            start();
        });
    }
};

main();
