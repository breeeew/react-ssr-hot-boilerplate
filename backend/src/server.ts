import * as express from 'express';
import * as process from 'process';
import {createProxyServer} from 'http-proxy';
import {routes} from './routes';

const {PORT = 3002} = process.env;
const server = express();

const onClose = () => {
    console.log('Close proxy sockets');
    frontendProxy.close();
};

process.on('SIGINT', onClose);
process.on('SIGTERM', onClose);
process.on('exit', onClose);

const frontendProxy = createProxyServer();
frontendProxy.removeAllListeners('error');
frontendProxy.on('error', (err, req, res) => {
    console.error('frontend proxy on error:', err.stack);
    req.socket.end();
    res.end();
});

server.use(routes);
server.use((req, res) => {
    frontendProxy.web(req, res, {target: 'http://127.0.0.1:3001'});
});

async function main() {
    try {
        server.listen(PORT);
    } catch (e) {
        console.error(e.stack);
        process.exit(1);
    }
}

main();
