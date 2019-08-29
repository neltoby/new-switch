import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

class Logout extends Component {

	logout = () => {
		let d = new Date();
		d.setTime(d.getTime() - (120*24*60*60*1000));
		document.cookie = "access=; expires="+d.toUTCString();
		console.log(document.cookie);
		return <Redirect to='/login' />
	}

	render(){
		return(
			<React.Fragment>
				{this.logout()}
			</React.Fragment>
		);
	};
}

export default Logout;