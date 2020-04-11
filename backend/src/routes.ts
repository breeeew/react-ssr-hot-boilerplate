import {Router} from 'express';

export const routes = Router();

const api = Router();

api.route('/')
    .get((req, res) => {
        res.send('hello world');
    });

routes.use('/api/v1', api);
