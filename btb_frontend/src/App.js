import React, { useEffect, useState } from 'react';
import MainContainer from '@MainContainer';
import { withRouter } from "react-router";
import 'antd/dist/antd.css'
import '../src/scss/core.scss'
import { userIsAuthenticated } from '@utils/auth'
function App(props) {
  const [screenLoading, setscreenLoading] = useState(true)
  useEffect(() => {
    if (userIsAuthenticated()) {
      props.history.push('/home')
    }
    else {
      props.history.push('/login')
    }
    setscreenLoading(false)
  }, [])
  return (
    <div className="App">
      {
        screenLoading
          ?
          <div>loading..</div>
          :
          <MainContainer />
      }
    </div>
  );
}

export default withRouter(App);
