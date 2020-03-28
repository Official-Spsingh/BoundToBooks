import React from 'react'
import { Route, Switch } from "react-router"
import PageNotFound from '@Components/PageNotFound'
import LoginComponent from '@Components/LoginComponent'
import HomeComponent from '@Components/HomeComponent'
import HeaderComponent from '@Components/HeaderComponent'
import PrivateRoute from '@routes/PrivateRoute'

const MainContainer = (props) => {
    return (
        <Switch>
            
            <Route exact path="/login">
                <LoginComponent />
            </Route>
            
            <PrivateRoute exact path="/home">
                <HomeComponent/>
            </PrivateRoute>
            
            <Route>
                <PageNotFound />
            </Route>
          
        </Switch>
    )
}

export default MainContainer
