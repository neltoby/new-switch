import React from 'react';
import $ from './jquery-3.2.1';
import {NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CommentModalBody.css';
import Multiple from './Multiple';
import Single from './Single';
import AllComment from './AllComment';
import ShareOptions  from './ShareOptions';
import ThreadedPost from './ThreadedPost';
import Thread from './Thread';
import soundFile from './audio.wav';

export default class CommentModalBody extends React.Component {
	state = {
		post: this.props.post,
		newcomment: this.props.newcomment,
		option: this.props.option,		
		allcomment: this.props.allcomment,
		interest: this.props.interest,
		location: this.props.location,
		thread: [],
		toggle: 'share',
		all_followers: this.props.all_followers,
		interest_followers: this.props.interest_followers,
		location_followers: this.props.location_followers,
		interest_location: this.props.interest_location,
		response: '',
		user: this.props.user,
		token: this.props.token
	}
	audio = new Audio(soundFile);
	
	
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
	componentDidMount() {
		this.getthread(this.state.post.pid);
	}	
	save = (pid) => {
		this.props.save(pid);
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
	saved = () => {
		let pid = this.state.post.pid;
		if(!this.state.post.saved){
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/savedPost.php",
			    type: "POST",
				data: {pid: pid},
				beforeSend: () => {				
				},
				success: (data) => {
					console.log(data);
					if(data){
						let save = this.isJson(data);
						if(save){
							if(save.state){
								this.setState({
									response: save.res
								});
								this.save(pid);
								setTimeout(()=>{
									this.setState({
										response: ''
									});
								},3000);
								
							}else{
								this.setState({
									response: save.res
								});
								setTimeout(()=>{
									this.setState({
										response: ''
									});
								},2000);
							}
						}
					}
				},
				error: (err) => {
					console.log(err);
				}    			
	        });
		}else{
			this.setState({
				response: 'Saved already'
			});
			setTimeout(()=>{
				this.setState({
					response: ''
				});
			},2000);
		}
	}
	getthread = (pid) => {
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/getThread.php",
		    type: "POST",
			data: {pid: pid},
			beforeSend: () => {				
			},
			success: (data) => {
				console.log(data);
				if(data){
					let res = JSON.parse(data);
					if(res.status){
						let thread = res.res;
						console.log(thread);
						this.setState({
							thread
						});
					}
					
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
	}
	submit = (data) => {
		this.props.submit(data);
	}
	updateAllComment = (data) => {
		this.props.updateAllComment(data)
	}
	likes = () => {
		this.props.likes();
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	likeComment = (id,status,check) => {
		this.props.likeComment(id,status,check);
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
	openComment = (option) => {
		this.props.openComment(option)
	}
	showShare = () => {
		if(this.state.post.share == 'Public'){
			this.setState({
				toggle: 'share'
			});
		}
	} 
	showComment = () => {
		this.setState({
			toggle: 'comment' 
		});		
	}
	render() {	
	console.log(this.state.newcomment);
		if(this.state.option == 'comment'){
			const reactStringReplace = require('react-string-replace');
			const text = this.state.post.post;
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
			
			let post_thread = this.state.thread.map((post,i) => {
				return <ThreadedPost post={post} key={i} />
			})
			let title_thread = this.state.thread.length ? <div className='title-threaded'>Other Post Tagged To This</div> : '';			
			let Like = this.state.post.like ? <FontAwesomeIcon icon='heart' className='ellipsis-h' color='red' size='2x'/>: 
			<FontAwesomeIcon icon={['far', 'heart']} className='ellipsis-h' color='#000' size='2x'/>;
			let tagged = this.state.post.tag ? this.state.post.tag : '' ;
			let pix = this.state.post.postpix.length > 1 ? <Multiple pix={this.state.post.postpix} pid={this.state.post.pid} 
			tag={this.state.post.tag} notification='comment'/>: <Single pix={this.state.post.postpix} />;
			let toggle = this.state.toggle == 'share' && this.state.post.share == 'Public' ? 
			<span className='like-c' title='Share' onClick={this.showComment}>
				<FontAwesomeIcon icon='external-link-alt' className='ellipsis-h' color='#000' size='2x'/></span> : 
				<span className='like-c' title='Comment' onClick={this.showShare}>
				<FontAwesomeIcon icon={['far', 'comment-alt']} className='ellipsis-h' color='#000' size='2x'/></span>;
			let toggle_class = this.state.toggle == 'share' ? 
			<AllComment post={this.state.post} submit={this.submit} newcomment={this.state.newcomment} setCookie={this.setCookie}
			allcomment={this.state.allcomment} updateAllComment={this.updateAllComment} user={this.state.user} token={this.state.token}
			likeComment={this.likeComment} /> : <ShareOptions post={this.state.post} user={this.state.user} setCookie={this.setCookie}
			interest={this.state.interest} location={this.state.location} all_followers={this.state.all_followers} token={this.state.token}
			interest_followers={this.state.interest_followers} location_followers={this.state.location_followers}
			interest_location={this.state.interest_location}/> ;
			let save = this.state.response ? <div className='share-response-new'>{this.state.response}</div> : '';
			let link = this.state.post.tag && this.state.post.share == 'Public'? <span className='like-c th-last' title='Thread' onClick={()=>this.openComment('thread')}>
			<FontAwesomeIcon icon='link' className='ellipsis-h' color='#000' size='2x'/></span> : '';
			return (
				<React.Fragment>
					<div className='comment-tag text-left'>
						<h2> {tagged}</h2>
					</div>
					<div className='row'>
					<div className='col-6'>
						<div className='modal-comment-img'>
							{pix}
						</div>
						<div className='row opinions'>
							<div className='col-5'>
								<span className='like-c' title='Save' onClick={this.saved}>
									<FontAwesomeIcon icon={['far', 'save']} className='ellipsis-h' color='#000' size='2x'/>
								</span>
							</div>
							<div className='col-7'>
								<span className='opinions'>
									<span className='like-c' title='Like' onClick={this.likes}>
										{Like}
									</span>
									{toggle}
									{link}
								</span>
							</div>
						</div>
						{save}
						<div className='row c-modal-post'>
							<NavLink to={`/profile/${this.state.post.uname}`} className='namelink'>
							{this.state.post.uname}
							</NavLink>
							{replacedText}
						</div>
						<br/>
						<div className='row'>
							{title_thread}
							{post_thread}
						</div>
					</div>
					<div className='col-6 left-comment'>
						{toggle_class}
					</div>
					</div>
				</React.Fragment>
			);
		}else if(this.state.option == 'thread'){
			return(
				<React.Fragment>
					<Thread post={this.state.post} interest={this.state.interest} location={this.state.location}
					newPost={this.newPost} thread={this.thread} closeModal={this.closeModal} token={this.state.token} 
					setCookie={this.setCookie} setCookie={this.setCookie} token={this.state.token}/>
				</React.Fragment>
				);
		}else{
			return(
				<h2>Nothing</h2>
			);
		}
	}
}
