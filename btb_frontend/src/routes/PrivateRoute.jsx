import React from 'react'
import { Route } from "react-router";
import HeaderComponent from '@Components/HeaderComponent';

const PrivateRoute = (props) => {
    return (
        <Route exact={props.exact} path={props.path} component={props.component}>
            <HeaderComponent/>
            <div className="children-component">
            {props.children}
            </div>
           
        </Route>
    )
}

export default PrivateRoute