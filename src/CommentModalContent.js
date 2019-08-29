import React from 'react';
import CommentModalBody from './CommentModalBody';

export default class CommentModalContent extends React.Component {
	state = {
		post: this.props.post,
		newcomment: this.props.newcomment,
		option: this.props.option,
		allcomment: this.props.allcomment,
		interest: this.props.interest,
		location: this.props.location,
		all_followers: this.props.all_followers,
		interest_followers: this.props.interest_followers,
		location_followers: this.props.location_followers,
		interest_location: this.props.interest_location,
		user: this.props.user,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post || nextProps.newcomment !== prevState.newcomment || 
			nextProps.option !== prevState.option || nextProps.allcomment !== prevState.allcomment 
			|| nextProps.interest !== prevState.interest || nextProps.location !== prevState.location ||
			nextProps.all_followers !== prevState.all_followers || nextProps.interest_followers !== prevState.interest_followers
			|| nextProps.location_followers !== prevState.location_followers || nextProps.user !== prevState.user ||
			nextProps.interest_location !== prevState.interest_location || nextProps.token !== prevState.token){
			return{
				post: nextProps.post,
				newcomment: nextProps.newcomment,
				option: nextProps.option,
				allcomment: nextProps.allcomment,
				interest: nextProps.interest,
				location: nextProps.location,
				all_followers: nextProps.all_followers,
				interest_followers: nextProps.interest_followers,
				location_followers: nextProps.location_followers,
				interest_location: nextProps.interest_location,
				user: nextProps.user,
				token: nextProps.token
			}
		}
		return null;
	}
	likeComment = (id,status,check) => {
		this.props.likeComment(id,status,check);
	}
	save = (pid) => {
		this.props.save(pid);
	}
	likes = () => {
		this.props.likes();
	}
	newPost = (data) => {
		this.props.newPost(data);
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	thread = (id) => {
		this.props.thread(id);
	}
	openComment = (option) => {
		this.props.openComment(option)
	}
	closeModal = () => {
		this.props.closeModal()
	}
	submit = (data) => {
		this.props.submit(data);
	}
	updateAllComment = (data) => {
		this.props.updateAllComment(data)
	}
	render() {
		console.log(this.state.newcomment);
		return (
			<React.Fragment>
				<div className="c-modal-header text-center wrt-header">
			        <button type="button" className="close wrtclose" onClick={this.closeModal}>&times;&times;</button>
		        </div>
		        <div className="c-modal-body cm-body-cm">
			        <CommentModalBody post={this.state.post} newcomment={this.state.newcomment} likes={this.likes}
				        option={this.state.option} closeModal={this.closeModal} openComment={this.openComment}
				        likeComment={this.likeComment} submit={this.submit} allcomment={this.state.allcomment}
				        updateAllComment={this.updateAllComment} interest={this.state.interest} token={this.state.token}
				        location={this.state.location} newPost={this.newPost} thread={this.thread}
				        all_followers={this.state.all_followers} save={this.save} user={this.state.user}
						interest_followers={this.state.interest_followers} location_followers={this.state.location_followers}
						interest_location={this.state.interest_location} setCookie={this.setCookie}/>
		        </div>
	        </React.Fragment>
		);
	}
}
