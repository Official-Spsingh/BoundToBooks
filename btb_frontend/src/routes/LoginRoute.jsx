import React from 'react'
import { Route, Redirect } from "react-router";
import { userIsAuthenticated } from '@utils/auth'

const LoginRoute = (props) => {
    if (!userIsAuthenticated())
        return (
            <Route exact={props.exact} path={props.path} component={props.component}>
                {props.children}
            </Route>
        )
    else
        return <Redirect to="/home" />
}

export default LoginRoute
