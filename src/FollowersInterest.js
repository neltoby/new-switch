import React from 'react';
import UserNotification from './UserNotification';
import UserDisplayNotification from './UserDisplayNotification';

export default class FollowersInterest extends React.Component {
	state = {
		user: this.props.user,
		interest: this.props.interest,
		location: this.props.location,
		phase: true,
		name: '',
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.user !== prevState.user || nextProps.location !== prevState.location || 
			nextProps.interest !== prevState.interest || nextProps.token !== prevState.token){
			return{
				user: nextProps.user,
				interest: nextProps.interest,
				location: nextProps.location,
				token: nextProps.token
			}
		}
		return null;
	}
	phase = (name)=> {
		this.setState({
			phase: false,
			name
		});
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	following = (num,amt) => {
		this.props.following(num,amt);
	}

	render() {
		if(this.state.phase){
			return (
				<div className='d-over-flow'>
					<UserNotification user={this.state.user} interest={this.state.interest} location={this.state.location} 
					phase={this.phase} token={this.state.token} setCookie={this.setCookie}/>
				</div>
			);
		}else{
			return(
				<div className='d-over-flow'>
					<UserDisplayNotification name={this.state.name} interest={this.state.interest} location={this.state.location} 
					user={this.state.user} phase={this.phase} following={this.following} token={this.state.token} setCookie={this.setCookie}/>
				</div>
				)
		}
	}
}
