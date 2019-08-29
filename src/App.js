import React, { Component, Fragment } from 'react';
// import $ from './jquery-3.2.1';
// import Home from './Home';
import OutRoute from './OutRoute';
// import PrivateRouter from './PrivateRouter';
// import Post from './Post';
// import Notification from './Notification';
// import Messages from './Messages';
// import Profile from './Profile';
// import Logout from './Logout';
// import CreateAccount from './CreateAccount';
// import GetPassword from './GetPassword';
// import logo from './logo.svg';
// import './App.css';
// import {Switch, Route,Redirect} from 'react-router-dom';
// import Client from './Client';
import Headers from './Headers';

class App extends Component{
    state = {
        
    }
    getCookie = (cname) => {
      if(cname == ''){
        return false;
      }else{
          let name = cname + "=";
          let ca = document.cookie.split(';');
          for(let i=0; i<ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0)==' ') c = c.substring(1);
              if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
          }
          return false;
      }
    }
    render() {
            return (
              <React.Fragment>
                  <div className="App">
                      {this.getCookie('access') ? <Fragment><Headers/></Fragment> : <OutRoute />}
                  </div>
                 
              </React.Fragment>

            );
        
    }
}

export default App;
