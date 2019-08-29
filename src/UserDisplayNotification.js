import React from 'react';
import FollowerInterest from './FollowerInterest';
import NotificationDisplay from './NotificationDisplay';
import AddHashtags from './AddHashtags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class UserDisplayNotification extends React.Component {
	state = {
		name: this.props.name,
		user: this.props.user,
		interest: this.props.interest,
		location: this.props.location,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.user !== prevState.user || nextProps.location !== prevState.location || 
			nextProps.interest !== prevState.interest || nextProps.name !== prevState.name 
			|| nextProps.token !== prevState.token){
			return{
				name: nextProps.name,
				user: nextProps.user,
				interest: nextProps.interest,
				location: nextProps.location,
				token: nextProps.token
			}
		}
		return null;
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	phase = (name) => {
		console.log(name+' was called');
		this.props.phase(name)
	}
	following = (num,amt) => {
		this.props.following(num,amt);
	}

	render() {
		let changeMode= this.state.name == 'interest' ? <FollowerInterest interest={this.state.interest} 
		location={this.state.location} following={this.following} token={this.state.token} setCookie={this.setCookie}/> : 
		this.state.name == 'notification' ? <NotificationDisplay interest={this.state.interest} 
		token={this.state.token} setCookie={this.setCookie}/> : 
		<AddHashtags interest={this.state.interest} token={this.state.token} setCookie={this.setCookie}/>;
		let interestClass = this.state.name == 'interest' ? 'col-4 interest-follower activeClass' : 'col-4 interest-follower' ;
		let notifClass = this.state.name == 'notification' ? 'col-4 interest-notification activeClass' : 'col-4 interest-notification' ;
		let hashClass = this.state.name == 'hashtag' ? 'col-4 interest-hashtag activeClass' : 'col-4 interest-hashtag' ;
		return (
			<React.Fragment>
			<div className='row content-container'>
				<div className='row line-container'>
					<div className={interestClass} onClick={()=>this.phase('interest')}>
						<FontAwesomeIcon icon={['far','user']} color='#45505f' size='sm' className='notif-icon'/> {this.state.interest}
					</div>
					<div className={notifClass} onClick={()=>this.phase('notification')}>
						<FontAwesomeIcon icon={['far','bell']} color='#45505f' size='sm' className='notif-icon' />Notification
					</div>
					<div className={hashClass} onClick={()=>this.phase('hashtag')}>
						<FontAwesomeIcon icon='plus' color='#45505f' size='sm' className='notif-icon' />Hashtag
					</div>
				</div>
			</div>
			<div className='row content-display'>
				{changeMode}
			</div>
			</React.Fragment>
		);
	}
}
