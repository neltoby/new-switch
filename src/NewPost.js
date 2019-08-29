import React from 'react';
import {NavLink} from 'react-router-dom';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Multiple from './Multiple';
import Single from './Single';
import Comment from './Comment';
import WriteComment from './WriteComment';
import Share from './Share';
import ReportPost from './ReportPost';
import EditPost from './EditPost';
import CommentModal from './CommentModal';
import MiniTurnoff from './MiniTurnoff';
import Biodata from './Biodata';
import './NewPost.css';
import soundFile from './audio.wav';

export default class NewPost extends React.Component {
	state = {
		post: this.props.post,
		opacity: false,
		comment: '',
		icons: false,
		error: false,
		comments: [],
		newcomment: [],
		successful: 0,
		switches: '',
		interest: this.props.interest,
		location: this.props.location,
		share_success: '',
		response: '',
		all_followers: this.props.all,
		interest_followers: this.props.interestF,
		location_followers: this.props.locationF,
		interest_location: this.props.intLocation,
		option: '',
		short_len: true,
		editPost : false,
		user: this.props.user,
		ctotal: this.props.ctotal,
		biodata: {},
		token: this.props.token,
	}
	audio = new Audio(soundFile);
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post || nextProps.interest !== prevState.interest ||
		   nextProps.location !== prevState.location || nextProps.all !== prevState.all_followers ||
		   nextProps.interestF !== prevState.interest_followers || nextProps.locationF !== prevState.location_followers
		   || nextProps.intLocation !== prevState.interest_location || nextProps.user !== prevState.user || 
		   nextProps.ctotal !== prevState.ctotal || nextProps.token !== prevState.token){
			return{
				post: nextProps.post,
				interest: nextProps.interest,
				location: nextProps.location,
				all_followers: nextProps.all,
				interest_followers: nextProps.interestF,
				location_followers: nextProps.locationF,
				interest_location: nextProps.intLocation,
				user: nextProps.user,
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
	comment = (comment) => {
		this.setState({
			comment 
		});
	}
	viewed = () => {
		$.post("http://localhost:8080/newSwitch/Codelet/viewedPost.php",
		    {
		        id: localStorage.set_id,
		        pid: this.state.post.pid
		    },
		   (data, status) => {
		    }
	    );
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
					console.log(data);
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
	report = (id) => {
		this.props.report(id);
	}
	save = (pid) => {
		this.props.saved(pid);
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
							if(save.state){
								if(this.state.token !== save.token){
									this.setCookie('access',save.token,8);
								}
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
	updateAllComment = (data) => {
		let comments = [...this.state.comments,...data];
		this.setState({
			comments
		});
	}
	clearNewComment = () => {
		this.setState({
			newcomment: []
		});
	}
	likeComment = (id,status,check) => {
		if(check == 'new'){
			const nextLike = this.state.newcomment.map((post,i) => {
				if(post.cid === id){
					// console.log(id+' was called');
					if(status == 1){
						this.audio.play();
						return Object.assign({}, post, {
							like: true
						})
					}else{
						return Object.assign({}, post, {
							like: false
						})
					}
				}else{
					return post;
				}
			})
			this.setState({
				newcomment: nextLike 
			});
		}else{
			const nextLike = this.state.comments.map((post,i) => {
				if(post.cid === id){
					// console.log(id+' was called');
					if(status == 1){
						this.audio.play();
						return Object.assign({}, post, {
							like: true
						})
					}else{
						return Object.assign({}, post, {
							like: false
						})
					}
				}else{
					return post;
				}
			})
			this.setState({
				comments: nextLike 
			});
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
						if(like.status){
							if(this.state.token !== like.token){
								this.setCookie('access',like.token,8);
							}
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
	updateComment = (id) => {
		this.props.updateComment(id);
	}
	displayComment = () => {
		this.setState({
			opacity: !this.state.opacity
		});
	}
	following = (num,amt) => {
		this.props.following(num,amt);
	}
	showComment = () => {
		this.displayComment();
		this.setState({
			switches: 'comment'
		});
	}
	share = (num,text) => {
		let pid = this.state.post.pid;
		let interest = this.state.interest;
		let current = this.state.location.current;
		let country = this.state.location.country;
		let state = this.state.location.state;
		let local = this.state.location.municipal;
		let data;
		if(num == 1){
			data = {pid:pid,num:num,text:text}
		}else if(num == 2){			
			data = {pid:pid,num:num,interest:interest,text:text}
		}else if(num == 3){
			if(current == 'country'){
				data = {pid:pid,num:num,interest:interest,current:current,country:country,text:text}
			}else if(current == 'state'){
				data = {pid:pid,num:num,interest:interest,current:current,country:country,state:state,text:text}
			}else{
				data = {pid:pid,num:num,interest:interest,current:current,country:country,state:state,local:local,text:text}
			}
		}else{
			if(current == 'country'){
				data = {pid:pid,num:num,current:current,country:country,text:text}
			}else if(current == 'state'){
				data = {pid:pid,num:num,current:current,country:country,state:state,text:text}
			}else{
				data = {pid:pid,num:num,current:current,country:country,state:state,local:local,text:text}
			}
		}
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/sharePost.php",
		    type: "POST",
			data: data,
			headers: {"Authorization": `${this.state.token}`},
			beforeSend: () => {				
			},
			success: (data) => {
				console.log(data);
				if(data){
					let share = this.isJson(data);
					if(share){
						if(share.status){
							if(this.state.token !== share.token){
								this.setCookie('access',share.token,8);
							}
							// this.closeshow();
							this.setState({
								share_success: 'yes',
								response: share.res
							});
						}else{
							this.setState({
								share_success: 'no',
								response: share.res
							});
							// console.log(share.res);
						}
						this.closeshow();
						setTimeout(() => {
							this.setState({
								share_success: '',
								response: ''
							});
						},3000)
					}
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
	}
	closeshow = () => {
		this.displayComment();
		this.setState({
			switches: '' 
		});
	}
	follow = (id,num) => {
		this.props.follow(id,num);
	}
	showShare = () => {
		this.displayComment();
		this.setState({
			switches: 'share' 
		});
	}
	showReport = () => {
		this.displayComment();
		this.setState({
			switches: 'report' 
		});
	}
	submit = (data) => {
		let pid = this.state.post.pid;
		let backup= this.state.comments.slice();
		// this.setState({
		// 	newcomment:[] 
		// });
		let newcomment = [JSON.parse(data)];
		let comments = [JSON.parse(data),...backup]
		console.log(newcomment)
		this.setState({
			comment: '',
			newcomment,
			comments
		});
		this.updateComment(pid);
	}
	openComment = (option) => {
		this.setState({
			option  
		});
		let id = `${this.state.post.pid}comModal`;
		document.getElementById(id).style.display = 'block';
	}
	textdisplay = () => {
		if(this.state.short_len){
			this.setState({
				short_len: false 
			});
		}		
	}
	newPost = (data) => {
		this.props.newPost(data);
	}
	thread = (id) => {
		this.props.thread(id);
	}
	editPost = (num) => {
		if(num == 1){
			this.setState({
				editPost: true
			});
		}else{
			this.setState({
				editPost: false 
			});
		}		
	}
	editEpost = (post) => {
		this.props.editEpost(this.state.post.pid,post);
	}
	editEtag = (tag) => {
		this.props.editEtag(this.state.post.pid,tag);
	}
	sendEdit = (post,tag) => {
		this.props.sendEdit(post,tag,this.state.post.pid);
	}
	switchturn = () => {
		this.displayComment();
		this.setState({
			switches: 'turnoff'
		});
	}
	turnOff = (id) => {
		this.props.turnoff(id);
	}
	getBiodata = (id) => {
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
							this.setState({
								biodata: ndata.res
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
	render() {
		console.log(this.state.newcomment);
		let allNum = ['5','6','7','8','9'] ;
		let repNum = allNum[Math.floor(Math.random() * allNum.length)].valueOf();
		// repNum = parseInt(repNum);
		// console.log('repNum is '+ repNum);
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
		// replacedText = this.state.short_len ? replacedText. : replacedText ;
		let switches;
		let share_res;
		let biodata = Object.keys(this.state.biodata).length === 0 && this.state.biodata.constructor === Object ? '' : 
		<Biodata data={this.state.biodata} interest={this.state.interest} clearData={this.clearData} num='2' 
		follow={this.follow} following={this.following}/>;
		let Like = this.state.post.like ? <FontAwesomeIcon icon='heart' className='ellipsis' color='tomato' size='2x'/>: 
		<FontAwesomeIcon icon={['far', 'heart']} className='ellipsis-h n-like' color='#000' size='2x'/>;
		let comments = this.state.comments.length ?
		 <Comment comment={this.state.comments[0]} check='old' likes={this.likeComment}/> : '';		
		let newcomment = this.state.newcomment.length ? <Comment comment={this.state.newcomment[0]} 
		check='new' likes={this.likeComment}/> : '';
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.post.upix}`;
		let usrc = `http://localhost:8080/newSwitch/Profile/${this.state.user.pic}`;
		let name = this.state.post.uname;
		let error = this.state.error ? <span className='com-error'>Comment must be at least 6 characters</span> : '';
		let send = this.state.icons ? ['far', 'paper-plane'] : 'feather-alt';
		let uid = `${this.state.post.uid}${this.state.post.date}`;
		let id = this.state.opacity ? 'container-fluid form-div new-post new-posts shadow': 'container-fluid form-div new-post shadow';
		let pix = this.state.post.postpix.length > 1 ? <Multiple pix={this.state.post.postpix} pid={this.state.post.pid} 
		tag={this.state.post.tag} notification='post' uid={uid} /> : <Single pix={this.state.post.postpix} />;
		if(this.state.switches == 'comment'){
			switches = <WriteComment comment={this.state.comment} pix={this.state.user.pic} upix={this.state.post.upix}
					updatecomment={this.comment} displayComment={this.showComment} name={name} uid={this.state.post.uid}
					submit={this.submit} pid={this.state.post.pid} token={this.state.token} setCookie={this.setCookie} 
					type='post' likeComment={this.likeComment} newcomment={this.state.newcomment} 
					clearNewComment={this.clearNewComment}/>
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
			let post = {uid: this.state.post.uid, pix: this.state.post.upix, name: this.state.post.uname, interest: this.state.interest};
			switches = <MiniTurnoff post={post} closeshow={this.closeshow} turnoff={this.turnOff} 
			token={this.state.token} setCookie={this.setCookie}/>
		}
		if(this.state.share_success == 'yes'){
			share_res = <div className='share-response-new'>{this.state.response}</div>
		}else if(this.state.share_success == 'no'){
			share_res = <div className='share-response-existed'>{this.state.response}</div>
		}else{
			share_res = '';
		}
		let ctotal = !this.state.ctotal ? 'col-10 col-pix-not text-left' : 'col-10 col-pix text-left' ;
		let follow = this.state.post.follow ? 'Following' : 'Follow' ;
		let followIcon = this.state.post.follow ? ['far', 'flag'] : 'flag-checkered' ;
		let numFollow = this.state.post.follow ? 0 : 1 ;
		let followable = this.state.post.followable ? <React.Fragment><li className='listed-item' onClick={()=>this.showReport()}>
		<span className='li-span'><span className='li-icon'><FontAwesomeIcon icon='ban' className='ellipsis' color='#647489' size='2x'/></span>Report {name}'s Post</span></li>
		<li className='listed-item' onClick={()=>this.switchturn()}>
		<span className='li-span'><span className='li-icon'><FontAwesomeIcon icon='power-off' className='ellipsis' color='#647489' size='2x'/></span>Turn Off {name}</span></li></React.Fragment> : <React.Fragment>
		<li className='listed-item' onClick={()=>this.editPost(1)}>Edit Post</li><li className='listed-item'>Delete Post</li></React.Fragment> ;
		let comment =this.state.post .comment > 1 ? `${this.state.post.comment} replies` : `${this.state.post.comment} reply`;
		let likes = this.state.post.likes > 1 ? `${this.state.post.likes} likes` : `${this.state.post.likes} like`;
		let thread = this.state.post.thread > 1 ? `${this.state.post.thread} threads` : `${this.state.post.thread} thread`;
		let editPost = this.state.editPost ? <EditPost post={this.state.post.post} tag={this.state.post.tag} 
		onClick={this.sendEdit} editEtag={this.editEtag} editEpost={this.editEpost} err={this.state.post.editerr} 
		errtext={this.state.post.errText} editPost={this.editPost}/> : <p onClick={this.textdisplay}>{replacedText}</p> ;
		let manipulate = this.state.editPost ? 'none' : 'block' ;
		let style = {
			width: '100%',
		}
		let share = this.state.post.share == 'Public' ? <div className='col-3 like' title='Share' onClick={this.showShare}>
			<FontAwesomeIcon icon='external-link-alt' className='ellipsis-h n-share' color='#000' size='2x'/></div> : '' ;
		let display_thread = this.state.post.tag && this.state.post.share == 'Public' ? <div className='col-3 like th-last' title='Thread' onClick={()=>this.openComment('thread')}>
			<FontAwesomeIcon icon='link' className='ellipsis-h n-thread' color='#000' size='2x'/></div> : '' ;
		if(!this.state.post.turnoff){
			return (
				<React.Fragment>
				<div className={id}>
					<div className='row row-name'>
						<div className='col-2 col-pix-pic text-left'>						
							<span className='span-img'>
								<img src={src} width='70' height='70' alt='Profile_Image' />
							</span>
						</div>
						<div className='col-7 col-name text-left'>
							<span className='span-name' onMouseOver={()=>this.getBiodata(this.state.post.uid)}>
								<b><NavLink to={`/profile/${name}`} className='namelink'>{name}</NavLink></b>
							</span>
							{biodata}
						</div>
						<div className='col-3 col-ellip text-center'>
							<FontAwesomeIcon icon='ellipsis-h' className='ellipsis' color='gray' size='1x'/>
							<ul className='listed'>
								{followable}
							</ul>
						</div>
					</div>
					<div className='row'>
						<div className='col-2'>						
						</div>
						<div className='col-10 col-pix text-left'>
							{editPost}
							{pix}
							<div className='row reaction' style={style}>
								<div className='col-3'>
									<span className='like' title='Save' onClick={this.saved}>
										<FontAwesomeIcon icon={['far', 'save']} className='ellipsis-h n-save' color='#000' size='lg'/>
									</span>
								</div>
								<div className='col-3 like' title='Like' onClick={this.likes}>
									{Like}
								</div>
								{share}
								{display_thread}
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
									placeholder='Write a reply' onClick={this.showComment}></textarea>
								</div>
							</div>

						</div>					
					</div>
						{switches}
				</div>
					<CommentModal post={this.state.post} newcomment={this.state.newcomment} submit={this.submit} 
					allcomment={this.state.comments} newPost={this.newPost} thread={this.thread}
					openComment={this.openComment} option={this.state.option} likes={this.likes} likeComment={this.likeComment}
					updateAllComment={this.updateAllComment} interest={this.state.interest} location={this.state.location}
					all_followers={this.state.all_followers} save={this.save} token={this.state.token} setCookie={this.setCookie}
					interest_followers={this.state.interest_followers} location_followers={this.state.location_followers}
					interest_location={this.state.interest_location} user={this.state.user}/>
				</React.Fragment>
			);
		}
		return null
	}
}
