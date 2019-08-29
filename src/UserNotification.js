import React from 'react';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class UserNotification extends React.Component {
	state = {
		user: this.props.user,
		interest: this.props.interest,
		location: this.props.location,
		notification: 0,
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
	componentDidMount() {
		this.userNotification();
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
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
	userNotification = () => {
		let interest= this.state.interest
		$.ajax({
            url: 'http://localhost:8080/newSwitch/Codelet/userNotification.php',
            type: "POST",
            headers: {"Authorization": `${this.state.token}`},
            data: {interest: interest},
            beforeSend: () => {
            	
            },                    
            success: (data) => {	
	            if(data){
					console.log(data);
					let userAlert = this.isJson(data);
					if(userAlert){
						if(this.state.token !== userAlert.token){
							this.setCookie('access',userAlert.token,8);
						}					
						// let d = new Date();
						// d.setTime(d.getTime() + (8*24*60*60*1000));
						// document.cookie = "access="+userAlert.token+"; expires="+d.toUTCString();
						if(userAlert.state){
							this.setState({
								notification: userAlert.total
							})	
						}
					}
				}
            },
            error: (error) => {

            }
        })
	}
	phase = (name) => {
		this.props.phase(name)
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
		let label = this.state.notification < 1 ? <div className='row long-interest-notification text-left no-notification'>
		<div className='col-7'><FontAwesomeIcon icon={['far','bell']} color='#45505f' size='lg' className='notif-icon' />
		Notification</div><div className='col-5'></div></div> : 
		<div className='row long-interest-notification alert-notification' onClick={()=>this.phase('notification')}>
		<div className='col-7 text-left'><FontAwesomeIcon icon={['far','bell']} color='#45505f' size='lg' className='notif-icon' />
		Notification</div><div className='col-5 text-left'>
			<span className='label label-danger'>{this.state.notification}</span></div></div>;
		return (
			<div className='content-long-container'>
				<div className='line-long-container text-left'>
					<div className='long-interest-follower' onClick={()=>this.phase('interest')}>
					<FontAwesomeIcon icon={['far','user']} color='#45505f' size='lg' className='notif-icon'/>
						{this.state.interest} Followers &nbsp;&nbsp;<FontAwesomeIcon icon='map-marker-alt' color='#45505f' size='sm' className='location-display-icon'/> 
						<span className='location-display'>{lastItem} </span>
					</div>					
					{label}
					<div className='row long-interest-notification' onClick={()=>this.phase('hashtag')}>
						<FontAwesomeIcon icon='plus' color='#45505f' size='lg' className='notif-icon'/>
						Add {this.state.interest} hashtags
					</div>
				</div>
			</div>
		);
	}
}
