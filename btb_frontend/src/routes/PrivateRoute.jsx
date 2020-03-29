import React from 'react'
import { Route, Redirect } from "react-router";
import HeaderComponent from '@Components/HeaderComponent';
import { userIsAuthenticated } from '@utils/auth'

const PrivateRoute = (props) => {
    if (userIsAuthenticated())
    return (
        <Route exact={props.exact} path={props.path} component={props.component}>
            <HeaderComponent/>
            <div className="children-component">
            {props.children}
            </div>
           
        </Route>
    )
    else
    return <Redirect to="/login" />
}

export default PrivateRoute