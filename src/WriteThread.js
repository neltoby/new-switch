import React from 'react';
import {NavLink} from 'react-router-dom';
import './WriteThread.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class WriteThread extends React.Component {
	state = {
		threads: this.props.threads,
	};
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.threads !== prevState.threads){
			return{
				threads: nextProps.threads,
			}
		}
		return null;
	}	
	onClick = () => {
		this.props.onClick(this.state.threads.tag,this.state.threads.postId);
	}

	render() {
		let src=`http://localhost:8080/newSwitch/Profile/${this.state.threads.pix}`; 
		let postsrc=`http://localhost:8080/newSwitch/PostImages/${this.state.threads.postpix}`; 
		let post = this.state.threads.post.replace(/(([^\s]+\s\s*){8})(.*)/,"$1...");
		let pixCount = this.state.threads.pixNum > 1 ? `${this.state.threads.pixNum - 1}+`: '';
		return (
			<div className='row row-thread' onClick={this.onClick}>
				<div className='col-4 col-th-img'>
					<img src={postsrc} width='100%' height='100' alt='Image' className='thread-post-pix'/>
					<span className='thread-center'>{pixCount}</span>
				</div>
				<div className='col-8 col-th-content'>
					<p className='p-thread-post text-left'><strong>{this.state.threads.tag}</strong></p>
					<p className='p-thread-post text-left'>{post}</p>
					<div className='row'>
						<div className='col-4'>
						</div>
						<div className='col-8'>
							<span className='thread-span'>
								<img src={src} width='40' height='40' alt='Image' className='thread-user-image'/> 
								<span className='thread-user-name'><NavLink to={`/profile/${this.state.threads.uname}`} className='namelink'>
								{this.state.threads.uname}</NavLink></span>
								<span className='thread-user-followers'>{this.state.threads.followers}&nbsp;
								<FontAwesomeIcon icon='users' className='send-post' color='#7289da' size='sm'/></span>
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
