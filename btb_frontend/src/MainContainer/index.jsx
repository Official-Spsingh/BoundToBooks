import React from 'react'
import { Route, Switch } from "react-router"
import PageNotFound from '@Components/PageNotFound'
import LoginComponent from '@Components/LoginComponent'
import HomeComponent from '@Components/HomeComponent'
import PrivateRoute from '@routes/PrivateRoute'
import ProfileComponent from '@Components/ProfileComponent'

const MainContainer = (props) => {
    return (
        <Switch>
            
            <Route exact path="/login">
                <LoginComponent />
            </Route>
            
            <PrivateRoute exact path="/home">
                <HomeComponent/>
            </PrivateRoute>
            <PrivateRoute exact path="/profile">
                <ProfileComponent/>
            </PrivateRoute>
            
            <Route>
                <PageNotFound />
            </Route>
          
        </Switch>
    )
}

export default MainContainer
