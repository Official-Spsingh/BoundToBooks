import React from 'react'
import LoginForm from './components/loginForm'

function LoginComponent(props) {
    return (
        <div className="login-wrapper">

        
        <div className="login-container">
            <div className="left-content">
                <h1>Bound To Books</h1>
                <h2>A Platform for buying, selling and donating books</h2>
                <h4><span>Developed By <a src="#">Shubham Pratap Singh</a></span></h4>

            </div>
            <div className="right-content">
                <LoginForm />
            </div>
        </div>
        </div>

    )
}

export default LoginComponent
