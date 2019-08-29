import React from 'react';
import {NavLink} from 'react-router-dom';
import $ from './jquery-3.2.1';
import SharedInterest from './SharedInterest';
import './Biodata.css';

export default class SharedPost extends React.Component {
	state = {
		data: this.props.data,
		interest: this.props.interest,
		num: this.props.num,
		follow : '',
		change: false,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.data !== prevState.data || nextProps.interest !== prevState.interest || nextProps.num !== prevState.num || 
			nextProps.token !== prevState.token){
			return{
				data: nextProps.data,
				interest: nextProps.interest,
				num: nextProps.num,
				token: nextProps.token
			}
		}
		return null;
	}
	componentDidMount() {
		let follow = this.state.data.follow;
		if(follow == 'You'){
			this.setState({
				follow: 'You'
			});
		}else{
			this.setState({
				follow
			});
		}		
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
	follow = (num) => {
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/follow.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {num: num, fid: this.state.data.uref},
			beforeSend: () => {				
			},
			success: (data) => {
				console.log(data);
				if(data){
					let like = this.isJson(data);
					if(like){
						if(this.state.token !== like.token){
							this.setCookie('access',like.token,8);
						}
						if(like.status){
							if(num == 1){
								this.setState({
									follow: true
								});
							}else{
								this.setState({
									follow: false
								});
							}
							// this.props.follow(this.state.data.uref,num);
							// this.props.following(num,1);
						}
					}
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
		
	}
	change = () => {
		this.setState({
			change: true 
		});
	}
	changeBack = () => {
		this.setState({
			change: false 
		});
	}
	// follow = (num) => {
	// 	this.props.follow(this.state.data.uref,num)		
	// }
	render(){
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.data.pix}`;
		let display = this.state.data.interest.length ? <div className='display-interest'>Interest</div> : '';
		let interest = this.state.data.interest.map((item,i) => {
			return <span className='list-int-item'>{item} </span>
		})
		let change = this.state.change ? 'Unfollow' : 'Following';
		let num = this.state.num == '1' ? 'biodata-container' : 'biodata-container-low';
		let shared = this.state.data.similar.length ? <SharedInterest sharedinterest={this.state.data.similar} /> : 
		<div className='shared-interest-none'>No shared interest</div>;
		let follow = this.state.follow === 'You' ? '': this.state.follow ? <button type='button' onMouseOver={this.change} onMouseOut={this.changeBack} onClick={()=>this.follow(0)} className='ff-btn-change ff-btn'>{change}</button> :
		<button type='button' onClick={()=>this.follow(1)} className='ff-btn'>Follow</button> ;
		let chkshared = localStorage.set_id == this.state.data.uref ? '' : shared ;
		return (
		    <div className={num}>
				<div className='row row-biodata-pix'>
					<div className='col-4 biodata-pix'>
						<img className='bio-pix' src={src} width='130' height='130'/>
					</div>
					<div className='col-8 col-biodata-name'>	
						<div className='name'><NavLink to={`/profile/${this.state.data.username}`} className='bio-namelink'> {this.state.data.username} </NavLink><br/>
							<span className='fullname'>{this.state.data.fullname}</span>
						</div>
						<div className='bio-follow'>
							{follow}
						</div>				
					</div>
				</div>
				<div className='row row-biodata-status'>	
					<div className='col-12 biodata-status'>
						{this.state.data.status}
					</div>		
					
				</div>
				<div className='row biodata-follow-details'>
					<div className='col-3 biodata-follow'>
						<div className='data-figure'>
							{this.state.data.follower}
						</div>
						Follower				
					</div>
					<div className='col-3 biodata-follow'>
						<div className='data-figure'>
							{this.state.data.following}
						</div>
						Following				
					</div>
					<div className='col-3 biodata-follow'>
						<div className='data-figure'>
							{this.state.data.ipost}
						</div>
						{this.state.interest}				
					</div>
					<div className='col-3 biodata-follow'>
						<div className='data-figure'>
							{this.state.data.post}
						</div>
						All Post				
					</div>
				</div>
				<div className='row biodata-interest'>
					{display}
					{interest}
				</div>
				{chkshared}
		    </div>
	   )
	}
}
