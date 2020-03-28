import React from 'react'
import { Route } from "react-router";
import HeaderComponent from '@Components/HeaderComponent';

const PrivateRoute = (props) => {
    return (
        <Route exact={props.exact} path={props.path} component={props.component}>
            <HeaderComponent/>
            {props.children}
        </Route>
    )
}

export default PrivateRoute