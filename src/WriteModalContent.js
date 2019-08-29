import React from 'react';
import WriteModalBody from './WriteModalBody';

export default class WriteModalContent extends React.Component {
	state = {
		interest: this.props.interest,
		location: this.props.location,
		all_interest: this.props.all_interest,
		user: this.props.user,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.location !== prevState.location || nextProps.interest !== prevState.interest || 
			nextProps.all_interest !== prevState.all_interest || nextProps.user !== prevState.user || 
			nextProps.token !== prevState.token){
			return{
				location: nextProps.location,
				interest: nextProps.interest,
				all_interest: nextProps.all_interest,
				user: nextProps.user,
				token: nextProps.token
			}
		}
		return null;
	}
	closeModal = () => {
		this.props.closeModal()
	}
	newPost = (post) => {
		this.props.newPost(post);
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	render() {
		return (
			<React.Fragment>
				<div className="c-modal-header text-center wrt-header">
			        <button type="button" className="close wrtclose" onClick={this.closeModal}>&times;&times;</button>
		        </div>
		        <div className="cm-body">
			        <WriteModalBody location={this.state.location} interest={this.state.interest} user={this.state.user}
			        closeModal={this.closeModal} newPost={this.newPost} all_interest={this.state.all_interest} 
			        token={this.state.token} setCookie={this.setCookie}/>
		        </div>
	        </React.Fragment>
		);
	}
}
