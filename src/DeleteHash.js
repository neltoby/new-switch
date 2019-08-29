import React from 'react';
import $ from './jquery-3.2.1';

export default class DeleteHash extends React.Component {
	state = {
		hash: this.props.hash,
		interest: this.props.interest,
		undo: false,
		text: false,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.interest !== prevState.interest || nextProps.hash !== prevState.hash || nextProps.token !== prevState.token){
			return{
				interest: nextProps.interest,
				hash: nextProps.hash,
				token: nextProps.token
			}
		}
		return null;
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
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	undo = () => {
		let hash = [];
		let interest = this.state.interest;
		hash.push(`#${this.state.hash}`);
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/addHashTags.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {interest: interest, hashtags: hash},
			beforeSend: () => {				
			},
			success: (data) => {
				if(data){
					console.log(data);					
					let hashtags = this.isJson(data);
					if(hashtags){
						if(this.state.token !== hashtags.token){
							this.setCookie('access',hashtags.token,8);
						}
						// let d = new Date();
						// d.setTime(d.getTime() + (8*24*60*60*1000));
						// document.cookie = "access="+hashtags.token+"; expires="+d.toUTCString();
						if(hashtags.state){
							this.setState({
								text: true,
								undo: false
							});
						}else{

						}
					}
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	deleteHashTags = () => {
		let interest = this.state.interest;
		let hash = this.state.hash;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/deleteHashTags.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {interest: interest, hashtag: hash},
			beforeSend: () => {				
			},
			success: (data) => {
				if(data){
					console.log(data);
					let hashtags = this.isJson(data);
					if(hashtags){
						if(this.state.token !== hashtags.token){
							this.setCookie('access',hashtags.token,8);
						}
						console.log(hashtags);
						if(hashtags.state){
							this.setState({
								undo: true,
								text: false
							});
							setTimeout(() => {
								if(!this.state.text){
									this.props.deleteHashTags(hash);
								}
							},7000);
							// this.props.deleteHashTags(hash);
						}else{

						}
					}
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
	}

	render() {
		if(this.state.undo){
			return (
				<div className='row hash-undo'>
					<div className='col-9 undo-hash-div'>
						#{this.state.hash}
					</div>
					<div className='col-3 hash-undo-text' onClick={this.undo}>
						UNDO
					</div>
				</div>
				);
		}
		return (
			<div className='row hash-div'>
				<div className='col-10 col-hash-div'>
					#{this.state.hash}
				</div>
				<div className='col-2 col-hash-div-undo text-center' onClick={this.deleteHashTags}>
					&times;
				</div>
			</div>
		);
	}
}
