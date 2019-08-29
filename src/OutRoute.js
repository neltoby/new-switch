import React from 'react';
import CreateAccount from './CreateAccount';
import GetPassword from './GetPassword';
import Login from './Login';
import {Switch, Route, Redirect} from 'react-router-dom';
import LoginBody from './LoginBody';

const OutRoute = (props) => {
	// console.log(props.location);
  return (
    <div className="row c-row">
	    <div className= 'row c-col'>
		    <LoginBody />
	        <Switch>
	            <Route path="/createaccount" component={CreateAccount}/>
	            <Route path="/passwordrecovery" component={GetPassword}/>
	            <Route path="/login" component={Login}/>
	            <Route path="/*" render={() => (
					<Redirect to={{pathname:'/login', state:{ from: props.location}, }}/>
            	)}/>
	            
	        </Switch>
        </div>
    </div>
  )
}

export default OutRoute;