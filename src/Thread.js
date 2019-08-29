import React from 'react';
import ThreadForm from './ThreadForm';
import './Thread.css';

export default class Thread extends React.Component {
	state = {
		post: this.props.post,
		interest: this.props.interest,
		location: this.props.location
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post ||  nextProps.interest !== prevState.interest 
			|| nextProps.location !== prevState.location){
			return{
				post: nextProps.post,
				interest: nextProps.interest,
				location: nextProps.location
			}
		}
		return null;
	}
	closeModal = () => {
		this.props.closeModal()
	}
	newPost = (data) => {
		this.props.newPost(data);
	}
	thread = (id) => {
		this.props.thread(id);
	}
	render() {
		return (
			<div className='row-thread-form'>
				<ThreadForm post={this.state.post} interest={this.state.interest} location={this.state.location}
				newPost={this.newPost} thread={this.thread} closeModal={this.closeModal}/>
			</div>
		);
	}
}
