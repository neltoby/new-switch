import React from 'react';
import {NavLink} from 'react-router-dom';
import $ from './jquery-3.2.1';
import Multiple from './Multiple';
import Single from './Single';
import './NewPost.css';
import Comment from './Comment';
import WriteComment from './WriteComment';
import Share from './Share';
import ReportPost from './ReportPost';
import Biodata from './Biodata';
import MiniTurnoff from './MiniTurnoff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class SharedPost extends React.Component {
	state = {
		post: this.props.post,
		ctotal:this.props.ctotal,
		location: this.props.location,
		interest: this.props.interest,
		all_followers: this.props.all,
		interest_followers: this.props.interestF,
		location_followers: this.props.locationF,
		interest_location: this.props.intLocation,
		opacity: false,
		user: this.props.user,
		short_len: true,
		comments: [],
		newcomment: [],
		switches: '',
		biodata: {},
		ubiodata: {},
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post || nextProps.ctotal !== prevState.ctotal || nextProps.token !== prevState.token){
			return{
				post: nextProps.post,
				ctotal: nextProps.ctotal,
				token: nextProps.token
			}
		}
		return null;
	}
	componentDidMount() {
		this.getComment(this.state.post.pid);
		this.viewed();
	}
	viewed = () => {
		$.post("http://localhost:8080/newSwitch/Codelet/viewedPost.php",
		    {
		        pid: this.state.post.pid
		    },
		   (data, status) => {
		    }
	    );
	}
	displayComment = () => {
		this.setState({
			opacity: !this.state.opacity
		});
	}
	switchturn = () => {
		this.displayComment();
		this.setState({
			switches: 'turnoff'
		});
	}
	showReport = () => {
		this.displayComment();
		this.setState({
			switches: 'report' 
		});
	}
	showShare = () => {
		this.displayComment();
		this.setState({
			switches: 'share' 
		});
	}
	showComment = () => {
		this.displayComment();
		this.setState({
			switches: 'comment'
		});
	}
	closeshow = () => {
		this.displayComment();
		this.setState({
			switches: '' 
		});
	}
	textdisplay = () => {
		if(this.state.short_len){
			this.setState({
				short_len: false 
			});
		}		
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
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
			    headers: {"Authorization": `${this.state.token}`},
				data: {pid: pid},
				beforeSend: () => {				
				},
				success: (data) => {
					console.log(data);
					if(data){
						let save = this.isJson(data);
						if(save){
							if(this.state.token !== save.token){
								this.setCookie('access',save.token,8);
							}
							if(save.state){
								this.setState({
									share_success: 'yes',
									response: save.res
								});
								this.props.saved(pid);
								setTimeout(()=>{
									this.setState({
										share_success: '',
										response: ''
									});
								},3000);
								
							}else{
								this.setState({
									share_success: 'yes',
									response: save.res
								});
								setTimeout(()=>{
									this.setState({
										share_success: '',
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
				share_success: 'yes',
				response: 'Saved already'
			});
			setTimeout(()=>{
				this.setState({
					share_success: '',
					response: ''
				});
			},2000);
		}
	}
	likes = () => {
		let pid = this.state.post.pid;
		let status = this.state.post.like ? 0 : 1;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/likePost.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {status: status, pid: pid},
			beforeSend: () => {				
			},
			success: (data) => {
				if(data){
					let like = this.isJson(data);
					if(like){
						if(this.state.token !== like.token){
							this.setCookie('access',like.token,8);
						}
						if(like.status){
							this.props.likes(pid,status);
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
	clearData = () => {
		this.setState({
			biodata: {} ,
			ubiodata: {}
		});
	}
	getBiodata = (id,num) => {
		let interest = this.state.interest;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/getBiodata.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {id: id, interest: interest},
			beforeSend: () => {				
			},
			success: (data) => {
				console.log(data);
				if(data){
					let ndata = this.isJson(data);
					console.log(ndata);
					if(ndata){
						if(this.state.token !== ndata.token){
							this.setCookie('access',ndata.token,8);
						}
						if(ndata.state){
							// let comments = ndata.res;
							// console.log(comments);
							if(num == 1){
								this.setState({
									biodata: ndata.res
								});
							}else{
								this.setState({
									ubiodata: ndata.res
								});
							}
						}
					}
					
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
	}
	openComment = (option) => {
		this.setState({
			option  
		});
		let id = `${this.state.post.pid}comModal`;
		document.getElementById(id).style.display = 'block';
	}
	getComment = (pid) => {
		let pageNum = 1 ;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/getAllComment.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {pid: pid, pageNum: pageNum},
			beforeSend: () => {				
			},
			success: (data) => {
				if(data){
					let ndata = this.isJson(data);
					if(ndata){
						if(this.state.token !== ndata.token){
							this.setCookie('access',ndata.token,8);
						}
						if(ndata.num > 0){
							let comments = ndata.res;
							console.log(comments);
							this.setState({
								comments
							});
						}
					}
					
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });

	}
	follow = (id,num) => {
		this.props.follow(id,num)		
	}
	following = (num,amt) => {
		this.props.following(num,amt);
	}

	render() {
		const reactStringReplace = require('react-string-replace');
		const text = this.state.short_len ? this.state.post.post.replace(/(([^\s]+\s\s*){15})(.*)/,"$1...") : this.state.post.post;
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
		let lik_sha = this.state.post.type != 'like' && this.state.post.type != 'comment' ? 'external-link-alt' : this.state.post.type == 'like' ? 'heart' : ['far', 'comment-alt'] ;
		let letter = this.state.post.type == 'like' ? 'liked' : this.state.post.type == 'comment' ? 'comment' : 'shared'; 
		let switches;
		if(this.state.switches == 'comment'){
			switches = <WriteComment comment={this.state.comment} pix={this.state.user.pic}
					updatecomment={this.comment} displayComment={this.showComment} 
					submit={this.submit} pid={this.state.post.pid} token={this.state.token} setCookie={this.setCookie}/>
		}else if(this.state.switches == 'share'){
			switches = <Share interest={this.state.interest} location={this.state.location} 
			closeshow={this.closeshow} pix={this.state.user.pic} share={this.share} all={this.state.all_followers}
				interestF={this.state.interest_followers} locationF={this.state.location_followers} 
				intLocation={this.state.interest_location} token={this.state.token} setCookie={this.setCookie}/>
		}else if(this.state.switches == 'report'){
			switches = <ReportPost pid={this.state.post.pid} report={this.state.post.report} 
			closeshow={this.closeshow} pix={this.state.user.pic} reports={this.report} 
			token={this.state.token} setCookie={this.setCookie}/>;
		}else if(this.state.switches == 'turnoff'){
			let post = {uid: this.state.post.ownerId, pix: this.state.post.ownerPix, name: this.state.post.ownerName, interest: this.state.interest};
			switches = <MiniTurnoff post={post} closeshow={this.closeshow} turnoff={this.turnOff} 
			token={this.state.token} setCookie={this.setCookie}/>
		}
		let share_res;
		if(this.state.share_success == 'yes'){
			share_res = <div className='share-response-new'>{this.state.response}</div>
		}else if(this.state.share_success == 'no'){
			share_res = <div className='share-response-existed'>{this.state.response}</div>
		}else{
			share_res = '';
		}
		let ubiodata = Object.keys(this.state.ubiodata).length === 0 && this.state.ubiodata.constructor === Object ? '' : 
		<Biodata data={this.state.ubiodata} interest={this.state.interest} clearData={this.clearData} num='2' 
		follow={this.follow} following={this.following} token={this.state.token} setCookie={this.setCookie}/>;
		let biodata = Object.keys(this.state.biodata).length === 0 && this.state.biodata.constructor === Object ? '' : 
		<Biodata data={this.state.biodata} interest={this.state.interest} clearData={this.clearData} num='1' 
		follow={this.follow} following={this.following} token={this.state.token} setCookie={this.setCookie}/>;
		let name = this.state.post.uname;
		let comments = this.state.comments.length ?
		 <Comment comment={this.state.comments[0]} check='old' likes={this.likeComment}/> : '';		
		let newcomment = this.state.newcomment.length ? <Comment comment={this.state.newcomment[0]} 
		check='new' likes={this.likeComment}/> : '';
		let followable = this.state.post.followable ? <React.Fragment><FontAwesomeIcon icon='ellipsis-h' className='ellipsis' color='gray' size='1x'/>
		<ul className='listed'><li className='listed-item' onClick={()=>this.showReport()}>
		<span className='li-span'><span className='li-icon'><FontAwesomeIcon icon='ban' className='ellipsis' color='#647489' size='lg'/></span>Report {this.state.post.ownerName}'s Post</span></li>
		<li className='listed-item' onClick={()=>this.switchturn()}><span className='li-span'><span className='li-icon'>
		<FontAwesomeIcon icon='power-off' className='ellipsis' color='#647489' size='lg'/></span>Turn Off {this.state.post.ownerName}</span></li></ul>
		</React.Fragment>: '';
		let display_thread = this.state.post.tag && this.state.post.share == 'Public' ?
			<span className='th-last' title='Thread' onClick={()=>this.openComment('thread')}>
				<FontAwesomeIcon icon='link' className='ellipsis-h n-thread' color='#000' size='2x'/>
			</span> : '' ;
		let Like = this.state.post.like ? <FontAwesomeIcon icon='heart' className='ellipsis' color='tomato' size='2x'/>: 
		<FontAwesomeIcon icon={['far', 'heart']} className='ellipsis-h n-like' color='#000' size='2x'/>;
		let share = this.state.post.share == 'Public' && this.state.post.uid != this.state.user.id ? 
			<div className='col-3 like' onClick={this.showShare}>
				<FontAwesomeIcon icon='external-link-alt' className='ellipsis-h n-share' color='#000' size='2x'/>
				<span className='abs-tip'>
					Share {name}'s story
				</span>
			</div> : '' ;
		let shares = this.state.post.share == 'Public' ? <span className='' title='Share' onClick={this.showShare}>
			<FontAwesomeIcon icon='external-link-alt' className='ellipsis-h n-share' color='#000' size='2x'/></span> : '' ;	
		let saves = <span className='like' title='Save' onClick={this.saved}>
			<FontAwesomeIcon icon={['far', 'save']} className='ellipsis-h n-save' color='#000' size='lg'/></span>
		let save = <React.Fragment><FontAwesomeIcon icon={['far', 'save']} className='ellipsis-h n-save' color='#000' size='lg'/>
			<span className='ab-tip'>Save {name}'s story</span></React.Fragment>;
		let ownerName =`${this.state.post.ownerName}`;
		let id = this.state.opacity ? 'container-fluid new-post new-posts shadow': 'container-fluid new-post shadow';
		let usrc = `http://localhost:8080/newSwitch/Profile/${this.state.user.pic}`;
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.post.ownerPix}`;
		let osrc = `http://localhost:8080/newSwitch/Profile/${this.state.post.upix}`;
		let comment =this.state.post .comment > 1 ? `${this.state.post.comment} replies` : `${this.state.post.comment} reply`;
		let likes = this.state.post.likes > 1 ? `${this.state.post.likes} likes` : `${this.state.post.likes} like`;
		let thread = this.state.post.thread > 1 ? `${this.state.post.thread} threads` : `${this.state.post.thread} thread`;
		// let ctotal = !this.state.ctotal ? 'col-11 col-pix-not text-left' : 'col-11 col-pix text-left' ;
		// console.log('ctotal is '+ctotal);
		let uid = `${this.state.post.ownerId}${this.state.post.date}${this.state.post.plid}`;
		let pix = this.state.post.postpix.length > 1 ? <Multiple pix={this.state.post.postpix} pid={this.state.post.pid} 
		tag={this.state.post.tag} notification={this.state.post.type} uid={uid} /> : <Single pix={this.state.post.postpix} />;
		let style = {
			width: '100% !important',
		}
		let scomment = this.state.post.scomment ? <div className='row shared-post-comment'><div className='col-1'></div>
			<div className='col-11'>{this.state.post.scomment}</div></div>: '';
		let reactions = this.state.post.scomment ? <React.Fragment>
		<div className='col-3 like' title='Like' onClick={this.likes}>{Like}<span className='abs-tip'>Like {name}'s story
		</span></div>{share}</React.Fragment> : <React.Fragment><div className='col-3 like' title='Like' onClick={this.likes}>
		{Like}</div><div className='col-3'>{shares}</div><div className='col-3'>{display_thread}</div></React.Fragment>;
		let chksave = this.state.post.scomment ? save : saves ;
		let tag = this.state.post.tag ? <b className='share-tag'>{this.state.post.tag}</b> : '';
		let refinedPost = this.state.post.post || this.state.post.tag? 
		<div className='share-text-container'><p className='share-content-post'>{replacedText}</p>{tag}
		<div className='share-content-view'>View post</div></div> : ''; 
		let placeholder = `Reply ${name}`;
		let follower = this.state.post.share == 'Public' ? '' : <div className='col-3'><span className='ff-only'>Followers only</span></div>;
		return (
			<div className={id}>
				<div className='row row-name row-display'>
					<div className='col-10 col-6-share'>
						<FontAwesomeIcon icon={lik_sha} className='ellipsis-h' color='rgba(128,128,128,0.9)' size='lg'/>												
						<span className='display-content' onMouseOver={()=>this.getBiodata(this.state.post.uid,1)} ><NavLink to={`/profile/${name}`} className='namelink-share'> {name} </NavLink></span>				
						<span className='span-img-i'><img src={osrc} width='40' height='40' alt='Profile_Image' /></span>
						<FontAwesomeIcon icon='angle-right' className='ellipsis-h space-item' color='rgba(128,128,128,0.9)' size='sm'/>
						<span className='span-share-text'>
						 {letter}
						</span>
					    {biodata}
					</div>
					{follower}
				</div>
				{scomment}
				<div className='row row-name-container'>
					
					<div className='row row-not-name'>
						<div className='col-1 col-name text-left'>
						</div>
						<div className='col-10 share-content-container'>
							<div className='row row-name'>
								<div className='col-2 col-pix-pic text-left'>						
									<span className='span-img'>
										<img src={src} width='50' height='50' alt='Profile_Image' className='s-img' />
									</span>
								</div>
								<div className='col-7 col-name text-left'>
									<span className='span-name' onMouseOver={()=>this.getBiodata(this.state.post.ownerId,2)}>
										<b><NavLink to={`/profile/${ownerName}`} className='namelink'>
										{ownerName}</NavLink></b> 
									</span>
									{ubiodata}
								</div>
								<div className='col-3 col-ellip text-center'>
									{followable}
								</div>
							</div>
							<div className='row row-name-sec'>
								<div className='col-2'>
								</div>
								<div className='col-9 share-images'>
									{refinedPost}								
								</div>
							</div>
							{pix}
						</div>
					</div>
					<div className='row icon-tags'>
						<div className='col-2'>
						</div>
						<div className='col-10'>
							<div className='row reaction' style={style}>
								<div className='col-3' onClick={this.saved}>
									{chksave}
								</div>
									{reactions}
							</div>
							{share_res}
							<div className='row text-left' style={style}>
								<div className='col-12'>
									<span className='res-react'><b>{likes}</b></span>
									<span className='res-react' onClick={()=>this.openComment('comment')}><b>{comment}</b></span>
									<span className='res-react'><b>{thread}</b></span>
								</div>
							</div>
							<div className='row reaction' style={style}>
								<div className="input-group mb-3 ng-txt">
								    <div className="input-group-prepend">
								        <img src={usrc} width='35' height='35' className='rimg'/>
								    </div>
									<textarea className='onlyread form-control' readOnly 
									placeholder={placeholder} onClick={this.showComment}></textarea>
								</div>
							</div>
						</div>
					</div>
				</div>
			{switches}
			</div>
		);
	}
}
