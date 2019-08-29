import React from 'react';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FollowersInterest from './FollowersInterest';
import {Route} from 'react-router-dom';
import './UserDetails.css';

export default class UserDetails extends React.Component {
	state = {
		 user: this.props.user,
		 default_interest: 'Business',
		 location: this.props.location,
		 token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.user !== prevState.user || nextProps.location !== prevState.location || nextProps.token !== prevState.token ){
			return{
				user: nextProps.user,
				location: nextProps.location,
				token: nextProps.token
			}
		}
		return null;
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	following = (num,amt) => {
		this.props.following(num,amt);
	}

	render() {
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.user.pic}`;
		let name = this.state.user.fname ? this.state.user.fname : this.state.user.uname ;
		return (
			<React.Fragment>

				<div className='row user-pic shadow'>
					<img className='profile-img' src={src} width='100%' height='250' alt='Profile pic'/>
					<div className='row line'>
						<div className='row div-span'>
							<div className='col-4 profile-span'>
								<div className='profile-item'>Post</div>
								<span className='profile-fig'>{this.state.user.post}</span>
							</div>
							<div className='col-4 profile-span'>
								<div className='profile-item'>Followers</div>
								<span className='profile-fig'>{this.state.user.followers}</span>
							</div>
							<div className='col-4 profile-span'>
								<div className='profile-item'>Following</div>
								<span className='profile-fig'>{this.state.user.following}</span>
							</div>
						</div>
						<br/>
						<div className='row div-span space-div-span'>
							<div className='location-div-span'>
								Current Location
							</div>
							<span className='span-container'>
								<span className=''>
									<FontAwesomeIcon icon='map-marker-alt' color='tomato' size='lg'/>
								</span>&nbsp;&nbsp;&nbsp;&nbsp;
								<span className='span-country'>
									{this.state.user.country}&nbsp;&nbsp;
									<FontAwesomeIcon icon='dot-circle' color='#ddd' size='xs'/>
								</span>&nbsp;&nbsp;
								<span className='span-others'>
									{this.state.user.state} &nbsp;&nbsp;
									<FontAwesomeIcon icon='dot-circle' color='#ddd' size='xs'/>
								</span>&nbsp;&nbsp;
								<span className='span-others'>
									{this.state.user.municipal}
								</span>
							</span>
						</div>
						<div className='div-span-name text-center'>
							<h2 className='name-color'>{name}</h2>
						</div>
						<Route exact path="/home" render={({match}) => {
	                		return(
	                    		<FollowersInterest interest={this.state.default_interest} location={this.state.location} 
	                    		user={this.state.user} following={this.following} token={this.state.token} 
	                    		setCookie={this.setCookie}/>
	                		);
		                }}/>
						<Route path="/home/:interest" render={({match}) => {
							let interest = '';
							let cut;
							if(match.params.interest.charAt(0) == '#'){
								interest = match.params.interest.slice(1);
								 cut = 1;
							}else{
								interest = match.params.interest;
								cut = 2;
							}
		                		return(
		                			<FollowersInterest interest={interest} location={this.state.location} cut={cut} 
		                			user={this.state.user} following={this.following} token={this.state.token} 
		                    		setCookie={this.setCookie}/>
		                		);
		                }}/>
					</div>
					
				</div>
			</React.Fragment>
		);
	}
}
