import * as React from 'react';
import './globals.css';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import {compose} from '../utils';

const RootComponent = () => {
    return (
        <Switch>
            <Route path='/'>
                hello world
            </Route>
            <Route path='/404'>
                404 =(
            </Route>
            <Route>
                <Redirect to='/404'/>
            </Route>
        </Switch>
    );
};

export const Root = compose<React.ComponentType>(
    withRouter,
)(RootComponent);
