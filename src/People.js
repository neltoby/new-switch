import React from 'react';
import $ from './jquery-3.2.1';
import './People.css';

export default class People extends React.Component {
	state = {
		people: this.props.people,
		interest: this.props.interest,
		follow: '',
		show: false,
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.people !== prevState.people || nextProps.interest !== prevState.interest){
			return{
				people: nextProps.people,
				interest: nextProps.interest
			}
		}
		return null;
	}
	onClick = (num) => {
		let fid = this.state.people.uid;
		let uid = localStorage.set_id;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/follow.php",
		    type: "POST",
			data: {fid: fid, uid: uid, num: num},
			beforeSend: () => {				
			},
			success: (data) => {
				if(data){
					let follow = JSON.parse(data);
					if(follow.status){
						this.props.ppleFollow(this.state.people.uid,num);
						if(num == 1){
							let strg = `You have followed ${this.state.people.uname}`; 
							this.setState({
								follow: strg
							});
							setTimeout(()=>{
								this.setState({
									follow: ''
								})
							},3000);
						}else{
							this.cancel();
							let strg = `You unfollowed ${this.state.people.uname}`; 
							this.setState({
								follow: strg,
							});
							setTimeout(()=>{
								this.setState({
									follow: ''
								})
							},3000);
						}
					}
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
		
	}
	display = () => {
		this.setState({
			show: true 
		});
	}
	cancel = () => {
		this.setState({
			show: false
		});
	}

	render() {
		let show = this.state.show ? 'people show' : 'people' ;
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.people.upix}`;
		let follow = this.state.people.follow ? <div className='div-unfollow' onClick={this.display}>Following</div> : 
		<div className='div-follow' onClick={()=>this.onClick(1)}>Follow</div> ;
		return (
			<div className={show}>
				<div className='row pple'>
					<div className='col-4 col-pple'>
						<img src={src} width='100' height='100' className='follow-img'/>
					</div>
					<div className='col-8 col-img'>
						<div className='follow-name'>
							{this.state.people.uname}
						</div>
						<div className='follow-details'>
							<span className='span-intpost'>{this.state.people.sharedPost} Shared Post</span>
							<span className='span-intpost'>{this.state.people.intPost} Wall Post</span>&nbsp;&nbsp;
							<span className='span-post'>{this.state.people.totPost} All Post </span>
						</div>
					</div>
				</div>
				<div className='ff-strg'><b>{this.state.follow}</b></div>
				{follow}
				<div className='cancel'>
					<div className='cancel-img'>
						<img src={src} width='50' height='50' className='follow-img'/>
					</div>
					<div className='row cancel-option'>
						<div className='col-6' onClick={this.cancel}>
							Cancel
						</div>
						<div className='col-6' onClick={()=>this.onClick(0)}>
							Unfollow
						</div>
					</div>
				</div>

			</div>
		);
	}
}
