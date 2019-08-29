import React from 'react';
import {NavLink} from 'react-router-dom';
import Multiple from './Multiple';
import Single from './Single';
import './SearchPost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class SearchPost extends React.Component {
	state = {
		post: this.props.post,
		short_len: true,
		search: this.props.search
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post){
			return{
				post: nextProps.post,
			}
		}
		return null;
	}

	render() {
		const reactStringReplace = require('react-string-replace');
		const text = this.state.short_len ? this.state.post.post.replace(/(([^\s]+\s\s*){25})(.*)/,"$1...") : this.state.post.post;
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
		replacedText =  reactStringReplace(replacedText, /{this.state.search}/g, (match, i) => (
			<b key={match + i}>{match}</b>
		));

		let pix = this.state.post.postpix.length > 1 ? <Multiple pix={this.state.post.postpix} pid={this.state.post.pid} 
		tag={this.state.post.tag} notification='search' /> : <Single pix={this.state.post.postpix} />;
		let follow = this.state.post.follow ? 'Unfollow' : 'Follow' ;
		let followable = this.state.post.followable ? <span className=''>{follow}</span> : <span className=''>You</span> ;
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.post.upix}`;
		return (
			<div className='post-container'>
			<div className='post-titl'>
				<b>{this.state.post.tag}</b>
			</div>
			<div className='row'>
				<div className='col-3 post-img'>
					{pix}
				</div>
				<div className='col-9 post-text'> 
					{replacedText}
					<div className='row search-row-icon'>						
						<div className='col-7'>
							<div className='row'>
								<div className='col-3'>
									<span className='search-icon'>
										<FontAwesomeIcon icon={['far', 'heart']} className='ellipsis-h' color='#9fabba' size='md'/>&nbsp;&nbsp;
										{this.state.post.likes}
									</span>
								</div>
								<div className='col-3'>
									<span className='search-icon'>
										<FontAwesomeIcon icon={['far', 'comment-alt']} className='ellipsis-h' color='#9fabba' size='md'/>&nbsp;&nbsp;
										{this.state.post.comment}
									</span>
								</div>
								<div className='col-3'>
									<span className='search-icon'>
										<FontAwesomeIcon icon={['far', 'eye']} className='ellipsis-h' color='#9fabba' size='md'/>&nbsp;&nbsp;
										{this.state.post.view}
									</span>
								</div>
								<div className='col-3'>
									<span className='search-icon'>
										<FontAwesomeIcon icon='link' className='ellipsis-h' color='#9fabba' size='md'/>&nbsp;&nbsp;
										{this.state.post.thread}
									</span>
								</div>
							</div>
						</div>
						<div className='col-5'>
						</div>
					</div>
					<div className='row search-row-img'>						
						<div className='col-7 div-ff'>
							Post by - <span className='search-uname'>{this.state.post.uname}</span>
						</div>
						<div className='col-5 div-img'>							
						</div>
					</div>
				</div>

			</div>

			</div>
		);
	}
}
