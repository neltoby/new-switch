import React from 'react';
import {NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ThreadedPost.css';

export default class ThreadedPost extends React.Component {
	state = {
		post: this.props.post,
	}

	render() {
		let src = `http://localhost:8080/newSwitch/PostImages/${this.state.post.pix}`;
		let tag_length = this.state.post.tag.split(' ').length > 10 ? this.state.post.tag.replace(/(([^\s]+\s\s*){10})(.*)/,"$1..."):
		this.state.post.tag ;
		let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		let first = alphabet[Math.floor(Math.random() * alphabet.length)];
		let second = alphabet[Math.floor(Math.random() * (alphabet.length-1))];
		let third = alphabet[Math.floor(Math.random() * (alphabet.length-2))];
		let fouth = alphabet[Math.floor(Math.random() * (alphabet.length-3))];
		let pid = `${first}${second}${this.state.post.pid}${third}${fouth}`;
		return (
			<div className='col-6 div-threaded'>
			<img src={src} width='100%' height='200' alt='Image' className='threaded-img'/>
				<div className='absolute-div'>
					<div className='absolute-title'>
					<NavLink to={`/post/${pid}`} className='threadlink'>{tag_length}</NavLink>
					</div>
					<div className='row absolute-tags'>
						<span className='first-tag'>
							<FontAwesomeIcon icon={['far', 'comment-alt']} className='ellipsis-h' color='#fff' size='lg'/>
							&nbsp;{this.state.post.com}
						</span>
						<span className='second-tag'>
							<FontAwesomeIcon icon={['far', 'heart']} className='ellipsis-h' color='#fff' size='lg'/>
							&nbsp;{this.state.post.likes}
						</span>
						<span className='third-tag'>
							<FontAwesomeIcon icon='link' className='ellipsis-h' color='#fff' size='lg'/>
							&nbsp;{this.state.post.thread}
						</span>
					</div>
				</div>
			</div>
		);
	}
}
