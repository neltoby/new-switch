import React from 'react';
import $ from './jquery-3.2.1';
import FollowerMap from './FollowerMap';

export default class FollowerInterest extends React.Component {
	state = {
		follower: true,
		follower_data: [],
		following_data: [],
		interest: this.props.interest,
		location: this.props.location,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.location !== prevState.location || nextProps.token !== prevState.token || 
			nextProps.interest !== prevState.interest){
			return{
				interest: nextProps.interest,
				location: nextProps.location,
				token: nextProps.token
			}
		}
		return null;
	}
	componentDidUpdate(prevProps, prevState) {
		if(prevState.interest !== this.state.interest || prevState.location !== this.state.location){
			this.getfollows();
		}
	}
	componentDidMount() {
		this.getfollows();
	}
	isJson = (item) => {
		item = typeof item !== 'string' ? JSON.stringify(item) : item ;
		try{
			item = JSON.parse(item);
		} catch (e) {
			return false
		}
		if((typeof item === 'object' || Array.isArray(item)) && item !== null){
			return item
		}
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	getfollows = () => {
		let interest = this.state.interest;
		let current = this.state.location.current;
		let country = this.state.location.country;
		let state = this.state.location.state;
		let local = this.state.location.municipal;
		let info;
		if(current == 'country'){
			info = {interest: interest, current: current, country:country};
		}else if(current == 'state'){
			info = {interest: interest, current: current, country: country, state: state} 
		}else if(current == 'local'){
			info = {interest: interest, current: current, country: country, state: state, local: local}
		}
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/getfollows.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: info,
			beforeSend: () => {				
			},
			success: (data) => {
				if(data){
					// let d = new Date();
					// d.setTime(d.getTime() + (8*24*60*60*1000));
					let follow = this.isJson(data);
					if(follow){
						if(this.state.token !== follow.token){
							this.setCookie('access',follow.token,8);
						}					
						// document.cookie = "access="+follow.token+"; expires="+d.toUTCString();
						if(follow.state){
							this.setState({
								follower_data: follow.follower,
								following_data: follow.following
							});
						}
					}
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
	}
	follower = () => {
		let followings = this.state.following_data.slice();
		this.setState({
			follower: true,
		});
	}
	following = () => {
		let followers = this.state.follower_data.slice();
		this.setState({
			follower: false,
		});
	}
	follow = (id,num) => {
		const follower_data = this.state.follower_data.map((arr,i) => {
			if(arr.uid === id){
				if(num == 0){
					console.log(num + 'was called for user '+id);
					return Object.assign({}, arr, {
						following: false
					})
				}else{
					console.log(num + 'was called for user '+id);
					return Object.assign({}, arr, {
						following: true
					})
				}
				
			}else{
				return arr;
			}
		})
		const following_data = this.state.following_data.map((arr,i) => {
			if(arr.uid === id){
				if(num == 0){
					console.log(num + 'was called for user '+id);
					return Object.assign({}, arr, {
						following: false
					})
				}else{
					console.log(num + 'was called for user '+id);
					return Object.assign({}, arr, {
						following: true
					})
				}
				
			}else{
				return arr;
			}
		})

		this.setState({
			follower_data,
			following_data
		});
	}
	followings = (num,amt) => {
		this.props.following(num,amt);
	}

	render() {
		let lastItem ;
		if(this.state.location.current == 'local'){
			lastItem = this.state.location.municipal;
		}else if(this.state.location.current == 'state'){
			lastItem = this.state.location.state;
		}else{
			lastItem = this.state.location.country;
		}
		let follower = this.state.follower ? this.state.follower_data.length ? this.state.follower_data.map((person,i) => {
			return <FollowerMap person={person} key={i} following={this.followings} follow={this.follow}/>
		}) : <div className='no-follow'>No {this.state.interest} wall follower in {lastItem}</div>: this.state.following_data.length ? this.state.following_data.map((person,i) => {
			return <FollowerMap person={person} key={i} following={this.followings} follow={this.follow}/>
		}): <div className='no-follow'>You are not following anyone on {this.state.interest} wall in {lastItem}</div>;
		let follow = this.state.follower ? <div className='row ff-header-row'>
		<div className='col-8' onClick={this.follower}>Followers<p><span className='title-interest'>{this.state.interest}</span></p>
			</div><div className='col-4 show-small' onClick={this.following}>Following</div></div>: 
			<div className='row ff-header-row'><div className='col-8' onClick={this.following}>Following
			<p><span className='title-interest'>{this.state.interest}</span></p>
			</div><div className='col-4 show-small' onClick={this.follower}>Followers</div></div>;
		return (
			<React.Fragment>
				<div className='row ff-header-row ff-header-row-tab'>
					{follow}
					<div className='ff-list'>
						{follower}
					</div>
				</div>
			</React.Fragment>
		);
	}
}
