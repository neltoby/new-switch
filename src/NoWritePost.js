import React from 'react';
import './NoWritePost.css';

export default class NoWritePost extends React.Component {
	state = {
		interest: this.props.interest,
		location: this.props.location,
		followers: this.props.followers
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.location !== prevState.location || nextProps.interest !== prevState.interest ||
			nextProps.followers !== prevState.followers ){
			return{
				location: nextProps.location,
				interest: nextProps.interest,
				followers: nextProps.followers,
			}
		}
		return null;
	}

	render() {
		let lastItem;
		if(this.state.location.current == 'local'){
			lastItem = this.state.location.municipal;
		}else if(this.state.location.current == 'state'){
			lastItem = this.state.location.state;
		}else{
			lastItem = this.state.location.country;
		}
		let followers = this.state.followers ? <div className='no-write-container'>You have followers in 
		<span className='no-write-interest'> {lastItem} </span> 
		  who follow <b>{this.state.interest}</b> wall.<br/>
		Follow <b>{this.state.interest}</b> Wall ... Get updates from {this.state.interest} wall from those you are following</div> : 
		<div className='no-write-container'>Follow <b>{this.state.interest}</b> Wall ... Get updates from {this.state.interest} wall from those you are following</div> ;
		return (
			<React.Fragment>{followers}</React.Fragment>
		);
	}
}
