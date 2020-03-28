import React, { useEffect, useState } from 'react';
import MainContainer from '@MainContainer'
import 'antd/dist/antd.css'
import '../src/scss/core.scss'
function App(props) {
 

  return (
    <div className="App">
      {
      
          <MainContainer />
      }
    </div>
  );
}

export default App;
