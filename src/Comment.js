import React from 'react';
import {NavLink} from 'react-router-dom';
import $ from './jquery-3.2.1';
import './Comment.css';
import SpanReply from './SpanReply';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Comment extends React.Component {
	state = {
		comment: this.props.comment,
		check: this.props.check,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.comment !== prevState.comment || nextProps.token !== prevState.token){
			return{
				comment: nextProps.comment,
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
	likes = () => {
		if(this.state.token){
			let cid = this.state.comment.cid
			let check = this.state.check;
			let status = this.state.comment.like ? 0 : 1;
			console.log(status);
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/likeComment.php",
			    type: "POST",
			    headers: {"Authorization": `${this.state.token}`},
				data: {status: status, cid: cid},
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
								this.props.likes(cid,status,check);
							}else{
								console.log('error occurred');
							}
						}
					}
				},
				error: (err) => {
					console.log(err);
				}    			

	        });
		}
	}

	render() {
		const reactStringReplace = require('react-string-replace');
		const text = this.state.comment.comment;
		let replacedText;

		replacedText = reactStringReplace(text,/#(\w+)/g, (match, i) => (
			<NavLink to={`/interest/${match}`} key={match + i} className='hashtag-link'>#{match}</NavLink>
			));
		replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) =>(
			<NavLink to={`/profile/${match}`} key={match + i} className='namelink'>@{match}</NavLink>
		));
		replacedText =  reactStringReplace(replacedText, /(https?:\/\/\S+)/g, (match, i) => (
			<a key={match + i} href={match}>{match}</a>
		));
		let replies = this.state.comment.refer.map((name,i) => {
			return <SpanReply name={name} refer={true} />
		})
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.comment.pix}`;
		let Like = this.state.comment.like ? <FontAwesomeIcon icon='heart' className='ellipsis-h' color='tomato' size='lg'/>: 
		<FontAwesomeIcon icon={['far', 'heart']} className='ellipsis-h' color='#000' size='lg'/>;
		return (
			<div className='row row-comment-container'>
				<div className='row row-comment'>
					<div className='col-2 c-col-2-img'>
						<img src={src} width='70' height='70' alt='Image' className='comment-image' />
					</div>
					<div className='col-10 c-col-9-content'>
							<span className='comment-content'>
								<span className='span-comment-content'>
									<NavLink to={`/profile/${this.state.comment.name}`} className='namelink'>
										<span className='comment-name'>{this.state.comment.name}</span>
									</NavLink>
									<span className='comment-date'>{this.state.comment.date}</span>
								</span>
								<span className='icon-comment-content text-right'>
									<FontAwesomeIcon icon='ellipsis-h' color='gray' size='sm' className='icon-reply-dropdown'/>
									<ul className='reply-dropdown shadow'>
										<li className='li-reply'><FontAwesomeIcon icon='ban' color='gray' size='sm' className='icon-reply-dropdown'/>Report Reply</li>
										<li className='li-reply'><FontAwesomeIcon icon='power-off' color='gray' size='sm' className='icon-reply-dropdown'/>Turn off {this.state.comment.name}'s report</li>
										<li className='li-reply'><FontAwesomeIcon icon='user-plus' color='gray' size='sm' className='icon-reply-dropdown'/>Follow {this.state.comment.name}</li>
									</ul>
								</span>
								
							</span>
							<span className='replies-refer'>replied {replies}</span>
							<span className='comment-body'>{replacedText}</span><br/>
							<div className='c-col-1-like text-center'>
								<span className='comment-like' onClick={this.likes}>{Like}</span>
							</div>						
					</div>
					
				</div>

				
			</div>
		);
	}
}
