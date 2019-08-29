import React from 'react';
import WriteModalContent from './WriteModalContent';
import $ from './jquery-3.2.1';

export default class WriteModal extends React.Component {
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
		$('#wrtModal').fadeOut();
		// document.getElementById('wrtModal').style.display = 'none';
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
				<div className="c-modal" id="wrtModal" style={{display: 'none'}}>
					<div className="c-modal-lg">
					    <div className="cc-modal-content">
					        <WriteModalContent location={this.state.location} interest={this.state.interest} user={this.state.user}
					        closeModal={this.closeModal} newPost={this.newPost} all_interest={this.state.all_interest} 
					        token={this.state.token} setCookie={this.setCookie}/>
					    </div>
				    </div>
			    </div>
		    </React.Fragment>
		);
	}
}
