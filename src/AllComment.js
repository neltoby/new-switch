import React from 'react';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Comment from './Comment';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import SpanReply from './SpanReply';

export default class AllComment extends React.Component {
	state = {
		post: this.props.post,
		newcomment: this.props.newcomment,
		allcomment: this.props.allcomment,
		comment: [],
		all_repliers: '',
		num: true,
		icons: false,
		text: '',
		change: false,
		update: true,
		error: false,
		user: this.props.user,
		token: this.props.token,
		all_names: [],
		selected_name: [],
		display_name: [],
		display_num: [],
		dark: false
	}
	page = 2;
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post || nextProps.newcomment !== prevState.newcomment || 
			nextProps.allcomment !== prevState.allcomment || nextProps.user !== prevState.user
			|| nextProps.token !== prevState.token){
			return{
				post: nextProps.post,
				newcomment: nextProps.newcomment,
				allcomment: nextProps.allcomment,
				user: nextProps.user,
				token: nextProps.token				
			}
		}
		return null;
	}
	componentDidMount() {
		this.setComment();
		this.getAllRepliers(this.state.post.pid);
		this.addname(this.state.post.uname);
		this.addnum(this.state.post.uid);
	}
	componentDidUpdate(prevProps, prevState) {
		if(prevState.allcomment !== this.state.allcomment || prevState.newcomment !== this.state.newcomment){
			console.log(this.state.allcomment);
			this.setComment();
		}
		
	}
	addname = (name) => {
		let display_name = this.state.display_name.slice();
		display_name.push(`@${name}`);
		this.setState({
			display_name 
		});
	}
	addnum = (num) => {
		let display_num = this.state.display_num.slice();
		display_num.push(num);
		this.setState({
			display_num 
		});
	}
	deleteReply = (name,id) => {
		let display_name = this.state.display_name.slice().filter((dname) => {
			if(dname !== name){
				return dname
			}
		})
		let display_num = this.state.display_num.slice().filter((dnum) => {
			if(dnum !== id){
				return dnum
			}
		})
		console.log(display_num);
		console.log(display_name);
		this.setState({
			display_name,
			display_num
		});
	}
	onReplies = (e) => {
		console.log(e.target.value+' was written');
		this.setState({
			all_repliers: e.target.value
		});
		console.log(e.target.value);
		this.getSelectedName(e.target.value);
	}
	getSelectedName = (name) => {
		if(name.trim().length){
			let allname = this.state.all_names.slice();
			console.log(allname);
			let selected_name = allname.filter((fname) => {
				if(fname.name.search(name) != -1){
					return fname
				}
			})
			this.setState({
				selected_name
			});
		}else{
			this.setState({
				selected_name: [] 
			});
		}
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
	getAllRepliers = (pid) => {
		let uid = this.state.post.uid;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/getAllRepliers.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: { pid: pid, uid: uid},
			beforeSend: () => {				
			},
			success: (data) => {
				console.log(data);
				let res = this.isJson(data);
				if(res){
					if(this.state.token !== res.token){
						this.setCookie('access',res.token,8);
					}	
					if(res.state){
						this.setState({
							loading: false,
						});
						let uname = `@${this.state.post.uname}`;
						let newObject = {'id': this.state.post.uid, 'name': uname, 'pix': this.state.post.upix};
						if(res.res.length){
							let all_names = res.res.map((names, i) => {
								return Object.assign({}, names, {
									name: `@${names.name}`,
								})
							});							
							all_names.unshift(newObject);
							console.log(all_names);
							this.setState({
								all_names 
							});
						}else{
							res.res.push(newObject);
							this.setState({
								all_names: res.res
							});
						}
					}else{

					}
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
	}
	setComment = () => {
		console.log('setComment was called');
		let comment = [...this.state.allcomment,...this.state.newcomment];
		console.log(comment);
		if(comment.length && comment.length > 3){
			this.setState({
				comment,
				num: true
			});
		}else{
			this.setState({
				comment,
				num: false 
			});
		}
	}
	getAllComment = (int) => {
		let pid = this.state.post.pid;
		let pageNum = this.page;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/getAllComment.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {pageNum: pageNum, pid: pid},
			beforeSend: () => {				
			},
			success: (data) => {
				console.log(data);
				if(data){
					let comment = this.isJson(data);
					if(comment){
						if(this.state.token !== comment.token){
							this.setCookie('access',comment.token,8);
						}
						if((comment.status) && (comment.num > 0)){
							this.page = this.page + 1;
							this.props.updateAllComment(comment.res);						
							console.log(this.page);
						}else{
							this.setState({
								 num: false
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
	inputChangeDark = () => {
		this.setState({
			dark: true
		});
	}
	inputChangeFalse = () => {
		this.setState({
			change: false
		});
	}
	cancel = () => {
		this.setState({
			dark: false
		});
	}
	takeName = (name,id) => {
		let display_name = this.state.display_name.slice();
		let display_num = this.state.display_num.slice();
		if(display_name.includes(name)){
			this.setState({
				display_name,
				display_num,
				selected_name: [],
				all_repliers: ''
			});
		}else{
			display_name.push(name);
			display_num.push(id);
			if(display_name.length > 1){
				this.setState({
					display_name,
					display_num,
					selected_name: [],
					all_repliers: '',
					dark: true
				});
			}else{
				this.setState({
					display_name,
					display_num,
					selected_name: [],
					all_repliers: ''
				});
			}
			
		}
		this.setState({
			change: false
		});
	}
	submit = () => {
		if(this.state.icons){
			if(this.state.text.length > 5){
				let pid = this.state.post.pid;
				let comment = this.state.text;
				if(this.state.token){
					$.ajax({
			        	url: "http://localhost:8080/newSwitch/Codelet/postComment.php",
					    type: "POST",
					    headers: {"Authorization": `${this.state.token}`},
						data: {comment: comment, pid: pid,state: 1,referred: this.state.display_num},
						beforeSend: () => {				
						},
						success: (data) => {
							console.log(data);
							if(data){
								let res = this.isJson(data);
								if(res){
									if(this.state.token !== res.token){
										this.setCookie('access',res.token,8);
									}
									this.setState({
										text: '',
										icons: false 
									});
									this.props.submit(data);
								}
							}
						},
						error: (err) => {
							console.log(err);
						}    			

			        }); 
				}
				
			}else{ 
				this.setState({
					error: true
				});
				setTimeout(() => {
					this.setState({
						error: false 
					});
				},3000)
			}
			
		}
	}
	likeComment = (id,status,check) => {
		if(this.state.num){
			this.setState({
				update: true 
			});
		}else{
			this.setState({
				update: false 
			});
		}
		
		this.props.likeComment(id,status,'new');
		this.props.likeComment(id,status,'old');		
	}
	replies = (e) => {
		this.setState({
			all_repliers: e.target.value
		});
	}
	onChange = (e) => {
		if(e.target.value.trim().length){			
			this.setState({
				icons: true,
				text: e.target.value
			});
		}else{
			this.setState({
				icons: false,
				text: e.target.value
			});
		}
	}
	updatereply = (text) => {
		this.setState({
			text 
		});
	}
	inputChange = () => {
		this.setState({
			change: true 
		});
	}
	showEmojis = (e) => {
	    this.setState({
	        showEmojis: true
	    }, () => document.addEventListener('click', this.closeMenu))
	}

    closeMenu = (e) => {
	    console.log(this.emojiPicker)
	    if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
	        this.setState({
		        showEmojis: false
		    }, () => document.removeEventListener('click', this.closeMenu))
	    }
	} 
	
	addEmoji = (e) => {
	    console.log(e.unified)
	    let sym = e.unified.split('-')
	    let codesArray = []
	    sym.forEach(el => codesArray.push('0x' + el))
	    let emojiPic = String.fromCodePoint(...codesArray) //("0x1f3f3", "0xfe0f")
	    let id = `${this.state.type}${this.state.pid}`;
		let ctl = document.getElementById(id);
		let startPos = ctl.selectionStart;
		// let endPos = ctl.selectionEnd;		
		let newStr = this.state.text.slice(0, startPos) + emojiPic + this.state.text.slice(startPos) 
		this.updatereply(newStr);	    

	}
	render() {
		console.log(this.state.post);
		console.log(this.state.comment);
		let id = `${this.state.type}${this.state.pid}`
		let comments = this.state.comment.map((comment, i) => {
				return(
					<Comment comment={comment} key={i} check='old' likes={this.likeComment} token={this.state.token} 
					setCookie = {this.setCookie}/>
					);
			})
		let com;
		if(this.state.comment.length){
			if(this.state.num){
				if(this.state.update){
					com = this.state.num ? 
				<div className='other-comment' onClick={()=>this.getAllComment(1)}>View other comments</div> : '';
				}
				
			}else{
				com = ''
			}
		}else{
			com = <div className='no-comment'>Write first comment</div>;
		}
		let repliers = this.state.display_name.map((name,i) => {
			return <SpanReply name={name} deleteReply={this.deleteReply} id={this.state.display_num[i]} sides='front' />
		});
		let li_list = this.state.selected_name.length ? this.state.selected_name.map((name,i) => {
			let src = `http://localhost:8080/newSwitch/Profile/${name.pix}`;
			console.log(name);
			return (<li onClick={()=>this.takeName(name.name,name.id)} key={i} className='combo-li-com'>
			<img src={src} width='50' height='50' className='li-image-com' alt='profile-img'/>{name.name}</li>
			)
		}): '';
		let combo_list = this.state.selected_name.length ? <ul className='combo-list-com shadow'>{li_list}</ul> : '';
		let change = this.state.change ? 
		<React.Fragment>
			<input type='text' value={this.state.all_repliers} placeholder='Type name to reply' className='replies' onChange={this.onReplies}/>
			<span className='dir-span' onClick={this.inputChangeFalse}><FontAwesomeIcon icon='arrow-left' color='#fff' size='sm' className='com-send'/></span>
			{combo_list}
		</React.Fragment> : this.state.display_name.length ? this.state.display_name.length > 1 ? <span className='com-send reply-name-container-s'>
		Replying to {repliers[1]} and {this.state.display_name.length - 1} {this.state.display_name.length-1 > 1 ? 'others' : 
		'other' } <span onClick={this.inputChangeDark} className='reply-name'>
		<FontAwesomeIcon icon='angle-down' color='#fff' size='sm' className='com-send'/></span></span> : <span className='com-send reply-name-container-s'>
		Replying to {repliers}<span onClick={this.inputChange} className='reply-name'>
		<FontAwesomeIcon icon='angle-down' color='#fff' size='sm' className='com-send'/></span></span> :
		<span className='com-send reply-name-container'><span onClick={this.inputChange} className='reply-name'>
		<FontAwesomeIcon icon='caret-down' color='#fff' size='sm' className='com-send'/></span></span>;
		let changes = this.state.change ? 
		<React.Fragment>
			<input type='text' value={this.state.all_repliers} placeholder='Type name to reply' className='replies' onChange={this.onReplies}/>
			<span className='dir-span' onClick={this.inputChangeFalse}><FontAwesomeIcon icon='arrow-left' color='#fff' size='sm' className='com-send'/></span>
			{combo_list}
		</React.Fragment> : this.state.display_name.length ? <span className='com-send reply-name-container'>
		Replying to {repliers}<span onClick={this.inputChange} className='reply-name'>
		<FontAwesomeIcon icon='angle-down' color='#fff' size='sm' className='com-send'/></span></span> :
		<span className='com-send reply-name-container'><span onClick={this.inputChange} className='reply-name'>
		<FontAwesomeIcon icon='caret-down' color='#fff' size='sm' className='com-send'/></span></span>;
		let error = this.state.error ? <span className='com-error'>Comment must be at least 6 characters</span>: '';
		let send = this.state.icons ? ['far', 'paper-plane'] : 'feather-alt';
		let decider = this.state.dark ? '' : change ;
		let usrc = `http://localhost:8080/newSwitch/Profile/${this.state.user.pic}`;
		let dark_display = this.state.dark ? 'block' : 'none' ;
		return (
			<React.Fragment>
				<div className='row sticky-top'>
					<div className="row row-comment-container col-fixed">
					<textarea className='writeonly-i form-control' id={id}
						placeholder='Reply' value={this.state.text} onChange={this.onChange} rows='2'></textarea>
						<div className="row cnt-igt">
							<div className="col-2 text-center">
								<span onClick={this.submit}>
									<FontAwesomeIcon icon={send} color='#fff' size='2x' className='com-send'/>
								</span>
							</div>
							<div className="col-4 text-center">
								{
							        this.state.showEmojis ?
							            <span className="input-group-text" ref={el => (this.emojiPicker = el)}>
							                <Picker onSelect={this.addEmoji} />
							            </span>
							        :
							            <span className="input-group-text image-emoji" onClick={this.showEmojis} >
							                <FontAwesomeIcon icon={['far','smile']} color='#fff' size='2x' className='com-emoji'/>
							            </span>
								} 
							</div>	
							<div className="col-6">
								{decider}
							</div>					 
						</div>
					</div>
				</div>
				<div className='row comment-content'>
					{comments}
					<div className='row-comment-container dark-content' style={{display: dark_display}}>
						<div className='row row-cancel'>
							<div className='col-10'>
							</div>
							<div className='col-2 text-center'>
							<span onClick={this.cancel}>&times;</span>
							</div>
						</div>
						<div className='row dark-content-container'>
							<div className='col-1'>
							</div>
							<div className='col-8 text-center'>
								{changes}
							</div>
							<div className='col-1'>
							</div>
						</div>
					</div>
				</div>
				<div className='row'>
					{com}
				</div>
				<div className='row'>
					
				</div>
				<div>{error}</div>
			</React.Fragment>
		);
	}
}
