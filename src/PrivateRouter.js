import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import Client from './Client';

const PrivateRouter = ({component, ...rest}) => (
	<Route {...rest} render={(props) => (
		Client.islogged ? (
			React.createElement(component, props)
			) : (
		<Redirect to={{
			pathname: '/login',
		}} />
		)
		
	)}
	/>
	
)
export default PrivateRouter;