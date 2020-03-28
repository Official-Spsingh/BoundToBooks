import React from 'react'
import { Route, Switch } from "react-router"
import PageNotFound from '@Components/PageNotFound'
import LoginComponent from '@Components/LoginComponent'
import HomeComponent from '@Components/HomeComponent'

const MainContainer = (props) => {
    return (
        <Switch>
            <Route exact path="/home">
                <HomeComponent/>
            </Route>
            <Route exact path="/login">
                <LoginComponent />
            </Route>
            
            <Route>
                <PageNotFound />
            </Route>
        </Switch>
    )
}

export default MainContainer
