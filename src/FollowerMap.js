import React from 'react';
import $ from './jquery-3.2.1';

export default class FollowerMap extends React.Component {
	state = {
		person: this.props.person,
		change: false,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.person !== prevState.person || nextProps.token !== prevState.token){
			return{
				person: nextProps.person,
				token: nextProps.token
			}
		}
		return null;
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	follow = (id,num) => {
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/follow.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {num: num, fid: id},
			beforeSend: () => {				
			},
			success: (data) => {
				console.log(data);
				if(data){
					let follow = JSON.parse(data);
					if(this.state.token !== follow.token){
						this.setCookie('access',follow.token,8);
					}
					if(follow.status){
						this.props.follow(id,num);
						this.props.following(num,1);
						// if(num == 1){
						// 	this.setState({
						// 		follow: true
						// 	});
						// }else{
						// 	this.setState({
						// 		follow: false
						// 	});
						// }
						// this.props.follow(this.state.data.uref,num);
						// this.props.following(num,1);
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

	// following = (num,amt) => {
	// 	this.props.following(num,amt);
	// }
	// followin

	render() {
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.person.pix}`;
		let num = this.state.person.following ? 0 : 1;
		let change = !this.state.change ? 'Following' : 'Unfollow' ;
		let follow = this.state.person.following ? <button type='button' className='change-ff-button shadow' onMouseOver={this.change} onMouseOut={this.changeBack} onClick={()=>this.follow(this.state.person.uid,num)}>{change}</button> : 
		<button type='button' className='shadow' onClick={()=>this.follow(this.state.person.uid,num)}>Follow</button>;
		return (
			<div className='row follow-map'>
				<div className='col-3'>
					<img src={src} width='70' height='70' className='round'/>
				</div>
				<div className='col-9'>
					<div className='f-name'>{this.state.person.username}</div><br/>
					{follow}
				</div>
			</div>
		);
	}
}
