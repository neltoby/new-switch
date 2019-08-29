import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import $ from './jquery-3.2.1';
import './ShareOptions.css';

export default class ShareOptions extends React.Component {
	state = {
		post: this.props.post,
		interest: this.props.interest,
		location: this.props.location,
		response: '',
		share_success: '',
		all_followers: this.props.all_followers,
		interest_followers: this.props.interest_followers,
		location_followers: this.props.location_followers,
		interest_location: this.props.interest_location,
		num: '',
		user: this.props.user
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post|| nextProps.interest !== prevState.interest || 
			nextProps.location !== prevState.location ||
			nextProps.all_followers !== prevState.all_followers || nextProps.interest_followers !== prevState.interest_followers
			|| nextProps.location_followers !== prevState.location_followers || nextProps.user !== prevState.user ||
			nextProps.interest_location !== prevState.interest_location){
			return{
				post: nextProps.post,
				interest: nextProps.interest,
				location: nextProps.location,
				all_followers: nextProps.all_followers,
				interest_followers: nextProps.interest_followers,
				location_followers: nextProps.location_followers,
				interest_location: nextProps.interest_location,
				user: nextProps.user
			}
		}
		return null;
	}
	share = (num) => {
		let pid = this.state.post.pid;
		let id = localStorage.set_id;
		let interest = this.state.interest;
		let current = this.state.location.current;
		let country = this.state.location.country;
		let state = this.state.location.state;
		let local = this.state.location.municipal;
		let data;
		if(num == 1){
			data = {id:id,pid:pid,num:num}
		}else if(num == 2){			
			data = {id:id,pid:pid,num:num,interest:interest}
		}else if(num == 3){
			if(current == 'country'){
				data = {id:id,pid:pid,num:num,interest:interest,current:current,country:country}
			}else if(current == 'state'){
				data = {id:id,pid:pid,num:num,interest:interest,current:current,country:country,state:state}
			}else{
				data = {id:id,pid:pid,num:num,interest:interest,current:current,country:country,state:state,local:local}
			}
		}else{
			if(current == 'country'){
				data = {id:id,pid:pid,num:num,current:current,country:country}
			}else if(current == 'state'){
				data = {id:id,pid:pid,num:num,current:current,country:country,state:state}
			}else{
				data = {id:id,pid:pid,num:num,current:current,country:country,state:state,local:local}
			}
		}
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/sharePost.php",
		    type: "POST",
			data: data,
			beforeSend: () => {				
			},
			success: (data) => {
				// console.log(data);
				if(data){
					let share = JSON.parse(data);
					if(share.status){
						// this.closeshow();
						this.setState({
							share_success: 'yes',
							response: share.res,
							num
						});
					}else{
						this.setState({
							share_success: 'no',
							response: share.res,
							num
						});
						// console.log(share.res);
					}
					setTimeout(() => {
						this.setState({
							share_success: '',
							response: '',
							num: ''
						});
					},3000)
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
	}

	render() {
		let location;
		if(this.state.location.current == 'country'){
			location = this.state.location.country;
		}else if(this.state.location.current == 'state'){
			location = `${this.state.location.state} , ${this.state.location.country}`;
		}else if(this.state.location.current == 'local'){
			location = `${this.state.location.municipal} , ${this.state.location.state} , ${this.state.location.country}`;
		}
		let first = this.state.num == 1 && this.state.response ? 
		<React.Fragment><br/><span className='long-left'>{this.state.response}</span></React.Fragment> : 
		<span className='ff-right'>{this.state.all_followers}</span>;
		let second = this.state.num == 2 && this.state.response ? 
		<React.Fragment><br/><span className='long-left'>{this.state.response}</span></React.Fragment> : 
		<span className='ff-right'>{this.state.interest_followers}</span>;
		let third = this.state.num == 3 && this.state.response ? 
		<React.Fragment><br/><span className='long-left'>{this.state.response}</span></React.Fragment> : 
		<span className='ff-right'>{this.state.interest_location}</span>;
		let fouth = this.state.num == 4 && this.state.response ? 
		<React.Fragment><br/><span className='long-left'>{this.state.response}</span></React.Fragment> : 
		<span className='ff-right'>{this.state.location_followers}</span>;
		let usrc = `http://localhost:8080/newSwitch/Profile/${this.state.user.pic}`;
		return (
			<React.Fragment>
				<div className='row share-post-row sticky-top'> 
					<div className='col-3'>
						<img src={usrc} width='100' height='100' className='share-img'/>
					</div>
					<div className='col-9 share-text'>
						<span className='span-share-text'>Share post with - </span>
					</div>
				</div>
				<div className='row share-post-option-row'>
					<div className='row share-post-option' onClick={()=>{this.share(1)}}>
						<div className='col-3'> 
							<span className='span-share-post-icon'>
								<FontAwesomeIcon icon='user-friends' className='share-post-icon' color='#7289da' size='3x'/>
							</span>
						</div>
						<div className='col-9 share-text-9'>
							All Your Followers
							<br/>
							{first}
						</div>
					</div>
					<div className='row share-post-option' onClick={()=>{this.share(2)}}>
						<div className='col-3'>
							<span className='span-share-post-icon'>
								<FontAwesomeIcon icon='user-friends' className='share-post-icon' color='#7289da' size='3x'/>
							</span>
						</div>
						<div className='col-9 share-text-9'>
							All Your Followers interested in {this.state.interest}
							<br/>
							{second}
						</div>
					</div>
					<div className='row share-post-option' onClick={()=>{this.share(3)}}>
						<div className='col-3'>
							<span className='span-share-post-icon'>
								<FontAwesomeIcon icon='map-marker-alt' className='share-post-icon' color='#7289da' size='3x'/>
							</span>
						</div>
						<div className='col-9 share-text-9'>
							All Your Followers interested in {this.state.interest} at {location}
							<br/>
							{third}
						</div>
					</div>
					<div className='row share-post-option'onClick={()=>{this.share(4)}}>
						<div className='col-3'>
							<span className='span-share-post-icon'>
								<FontAwesomeIcon icon='map-marker-alt' className='share-post-icon' color='#7289da' size='3x'/>
							</span>
						</div>
						<div className='col-9 share-text-9'>
							All Your Followers at {location}
							<br/>
							{fouth}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
