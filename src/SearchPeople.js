import React from 'react';
import $ from './jquery-3.2.1';
import {NavLink} from 'react-router-dom';
import InterestItems from './InterestItems';
import './SearchPeople.css';

export default class SearchPeople extends React.Component {
	state = {
		post: this.props.post,
		confirmed: true,
		show: false,
		follow: '',
		close: false
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post){
			return{
				post: nextProps.post,
			}
		}
		return null;
	}
	option = () => {
		this.setState({
			confirmed: false 
		});
	}
	cancel = () => {
		this.setState({
			confirmed: true 
		});
	}
	follow = (num) => {
		let fid = this.state.post.uid;
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
						this.props.follow(this.state.post.uid,num);
						let name = this.state.post.fullname ? this.state.post.fullname : this.state.post.username ;
						// this.following(num);
						if(num == 1){
							let strg = `You have followed ${name}`; 
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
							let strg = `You unfollowed ${name}`; 
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
		
		// if(num != 1){
		// 	this.cancel();
		// }
	}
	view = () => {
		this.setState({
			show: !this.state.show
		});
		if(!this.state.show){
			setTimeout(()=>{
				this.setState({
					close: false 
				});
			})
		}else{
			this.setState({
				close: true
			});
		}
	}

	render() {
		let show_interest = this.state.post.shared.length > 2 ? this.state.post.shared.map((item,i)=>{
			return(
				<InterestItems item={item} key={i} />
				);
		}): '';
		let follow;
		let shared = this.state.post.shared.length;
		let share_display;
		let show_class = this.state.show ? 'display-items' : 'close-items' ;
		let show_str = this.state.show ? 'See less' : 'See more' ;
		let close = this.state.close ? 'block' : 'none';
		let show = this.state.show ? <div className={show_class} style={{display: close}}>{show_interest}</div>: 
		<div className={show_class}>{show_interest}</div>;
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.post.pix}`;
		let uname = this.state.post.username;
		let name = this.state.post.fullname ? this.state.post.fullname : this.state.post.username ;
		let post_type = <React.Fragment><b>{this.state.post.post}</b> &nbsp; {this.state.post.current} post
		</React.Fragment>;
		let allpost = <React.Fragment><b>{this.state.post.allPost}</b> &nbsp; Post
		</React.Fragment>;
		if(this.state.confirmed){
			follow = this.state.post.following ? <div className='search-following' onClick={this.option}>Following</div> : 
			<div className='search-follow' onClick={()=>this.follow(1)}>Follow</div> ;
		}else{
			follow = <div className='search-cancel'><div className='follow-cancel' onClick={this.cancel}>Cancel</div>
			<div className='follow-cancel' onClick={()=>this.follow(0)}>Unfollow</div></div>
		}
		if(shared){
			if(shared < 2){
				share_display = <div className='search-info'><span className='shared-count'><b>{shared}</b> Shared interest </span>
				 <span className='shared-item'><InterestItems item={this.state.post.shared[0]} thick='1'/></span></div>
	  		}else if(shared == 2){
	  			share_display = <div className='search-info'><span className='shared-count'><b>{shared}</b> Shared interest </span>
				 <span className='shared-item'><InterestItems item={this.state.post.shared[0]} thick='1'/>
				<InterestItems item={this.state.post.shared[1]} thick='1'/></span>
				 </div>
	  		}else{
	  			share_display = <div className='search-info'><span className='shared-count'><b>{shared}</b> Shared interest </span>
				<span className='shared-item'><InterestItems item={this.state.post.shared[0]} thick='1'/>
				<InterestItems item={this.state.post.shared[1]} thick='1'/></span>
				<span className='shared-more' onClick={()=>this.view()}>{show_str}</span>
				{show}
				</div>
	  		}
	  	}
		return (
			<div className='pple-container'>
				<div className='row people-container'>
					<div className='col-3s'>
						<img src={src} width='100%' height='150' className='search-img'/>
					</div>
					<div className='col-9s'>
						<p className='search-name'><NavLink to={`/profile/${uname}`} className='namelink'>{name}</NavLink></p>
						{share_display}
						<div className='search-info'>
							<span className='tt-post'>
								{post_type}
							</span>
							<span className='tt-post'>
								{allpost}
							</span>
							<span className='follower-count'>
								{this.state.post.followers} Followers
							</span>
						</div>
						
							{follow}
					</div>
				</div>
			</div>
		);
	}
}
