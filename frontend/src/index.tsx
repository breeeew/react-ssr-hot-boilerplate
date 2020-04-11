import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Root} from './components/Root';
import {BrowserRouter} from 'react-router-dom';

const el = document.getElementById('react-root');

function render(Component: React.ComponentType) {
    ReactDOM.hydrate(
        <BrowserRouter>
            <Component/>
        </BrowserRouter>,
        el,
    );
}

render(Root);

declare let module: { hot: {
    accept(path: string, cb: Function): void;
} };

if (module.hot) {
    module.hot.accept('./components/Root', () => {
        const NewApp = require('./components/Root').Root;
        render(NewApp);
    });
}
