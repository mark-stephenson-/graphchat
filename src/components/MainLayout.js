import React from 'react';
import { Switch, Route } from 'react-router-dom';

//import './MainLayout.css'

import Nav from './Nav';
import ChatContainer from './ChatContainer';

const MainLayout = () => (
  <div className="main-container">
    <div>
      <Nav />
    </div>
    <div>
      <Switch>

        <Route exact path ='/' render={(props) => (
          <ChatContainer {...props} mode='Customer' />
        )} />

        <Route exact path ='/operator' render={(props) => (
          <ChatContainer {...props} mode='Jo' />
        )} />

      </Switch>
    </div>
  </div>
);

export default MainLayout;
