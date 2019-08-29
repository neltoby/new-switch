import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import LoginForm from './LoginForm';

class Login extends Component {
	state = {
		session: false
	}

	redirectPath = (props) => {
		const locationState = this.props.location.state;
		console.log(locationState);
		if(locationState){
			console.log('path was returned');
			const pathname = locationState.from;
			return pathname
		}else{
			console.log('home was returned');
			return '/home';
		}	
		// console.log(locationState);		
	}

	onClick = () => {
		this.setState({
			session: true
		})
	}

	// onClick = (e) => {
	// 	localStorage.setItem('username' , 'Jude');
	// 	this.setState({
	// 		session: true
	// 	})
	// }
	render(){
		if(!this.state.session){
			return(
				<React.Fragment>
					<LoginForm onClick={this.onClick}/>
				</React.Fragment>
			);
		}else{
			return(
				<React.Fragment>
					<Redirect to={this.redirectPath()} />
				</React.Fragment>
			);
		}
	};
}

export default Login;