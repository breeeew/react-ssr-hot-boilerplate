import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router';
import {Request, Response} from 'express';
import {flushChunkNames} from 'react-universal-component/server';
import * as webpack from 'webpack';
import flushChunks from 'webpack-flush-chunks';
import * as React from 'react';
import {StaticRouterContext} from 'react-router';
import {Root} from '../components/Root';

const lang = 'ru';

const render = ({clientStats}: IRenderOptions) => async (req: Request, res: Response) => {
    const context: IStaticRouterContext = {};

    const app = renderToString(
        <StaticRouter
            location={req.originalUrl}
            context={context}
        >
            <Root/>
        </StaticRouter>
    );

    const { js, styles, cssHash } = flushChunks(clientStats, {
        chunkNames: flushChunkNames(),
    });

    const status = context.status || 200;

    if (context.status == 404) {
        console.log('Error 404: ', req.originalUrl);
    }

    if (context.url) {
        const redirectStatus = context.status || 302;
        res.redirect(redirectStatus, context.url);
        return;
    }

    res.status(status)
        // .cookie(LOCALE_COOKIE_NAME, lang, { maxAge: COOKIE_MAX_AGE, httpOnly: false })
        .header('Content-Type', 'text/html')
        .send(
            `<!DOCTYPE html>
            <html lang='${lang}'>
                <head>
                    ${styles}
                    ${cssHash}
                </head>
                <body>
                    <div id='react-root' class='reactRoot'>${app}</div>
                    ${js}
                </body>
            </html>`
        );
};

export default render;

interface IRenderOptions {
    clientStats: webpack.Stats;
}

interface IStaticRouterContext extends StaticRouterContext {
    status?: number;
}
