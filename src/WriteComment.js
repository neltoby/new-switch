import React from 'react';
import $ from './jquery-3.2.1';
import SpanReply from './SpanReply';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

export default class WriteComment extends React.Component {
	state = {
		comment: this.props.comment,
		icons: false,
		error: false,
		turned: false,
		err_comment: '',
		pid: this.props.pid,
		upix: this.props.upix,
		uid: this.props.uid,
		pix: this.props.pix,
		token: this.props.token,
		name: this.props.name,
		all_names: [],
		selected_name: [],
		display_name: [],
		display_num: [],
		loading: true,
		replier: '',
		newcomment: [],
		type: this.props.type,
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.comment !== prevState.comment || nextProps.token !== prevState.token || nextProps.newcomment !== prevState.newcomment){
			return{
				comment: nextProps.comment,
				token: nextProps.token,
				newcomment: nextProps.newcomment
			}
		}
		return null;
	}
	componentDidUpdate(prevProps, prevState) {
		if(this.state.newcomment !== prevState.newcomment){
			console.log(this.state.newcomment);
		}
	}
	componentDidMount() {
		let display_name = this.state.display_name.slice();
		let display_num = this.state.display_num.slice();
		display_name.push(`@${this.state.name}`)
		display_num.push(`${this.state.uid}`)
		this.setState({
			display_name,
			display_num
		});
		this.getAllRepliers(this.state.pid);
		// setInterval(() => {
		// 	this.getAllRepliers(this.state.pid);
		// },1000);
	}
	onReply = (e) => {
		this.setState({
			replier: e.target.value
		});
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
	getAllRepliers = (pid) => {
		let uid = this.state.uid;
		console.log(uid+' is a num')
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
						console.log(this.state.name+' '+this.state.uid+' '+this.state.upix);
						let uname = `@${this.state.name}`;
						let newObject = {'id': this.state.uid, 'name': uname, 'pix': this.state.upix};
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
	takeName = (name,id) => {
		let display_name = this.state.display_name.slice();
		let display_num = this.state.display_num.slice();
		if(display_name.includes(name)){
			this.setState({
				display_name,
				display_num,
				selected_name: [],
				replier: ''
			});
		}else{
			display_name.push(name);
			display_num.push(id);
			this.setState({
				display_name,
				display_num,
				selected_name: [],
				replier: ''
			});
		}
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
	onChange = (e) => {
		if(e.target.value.trim().length){			
			this.setState({
				icons: true,
				// comment: e.target.value
			});
		}else{
			this.setState({
				icons: false,
				// comment: e.target.value 
			});
		}
		this.props.updatecomment(e.target.value);
	}
	submit = () => {
		if(this.state.icons){
			if(this.state.comment.length > 5){
				if(this.state.display_num.length){
					console.log(this.state.display_num);
					let pid = this.state.pid;
					let comment = this.state.comment;
					$.ajax({
			        	url: "http://localhost:8080/newSwitch/Codelet/postComment.php",
					    type: "POST",
					    headers: {"Authorization": `${this.state.token}`},
						data: {comment: comment, pid: pid,state: 1,referred: this.state.display_num},
						beforeSend: () => {				
						},
						success: (data) => {
							console.log(data);
							let res = this.isJson(data);
							if(res){
								if(this.state.token !== res.token){
									this.setCookie('access',res.token,8);
								}	
								// this.props.displayComment();
								this.setState({
									icons: false,
									turned: true,
									cid: res.cid,
									sent_comment: res.comment
								});
								this.props.submit(data);
							}
						},
						error: (err) => {
							console.log(err);
						}    			

			        });
				}else{
					this.setState({
						error: true,
						err_comment: 'No recipient to your reply'
					});
					setTimeout(() => {
						this.setState({
							error: false ,
							err_comment: ''
						});
					},3000)
				}
				
			}else{
				this.setState({
					error: true,
					err_comment: 'Comment must be at least 6 characters'
				});
				setTimeout(() => {
					this.setState({
						error: false ,
						err_comment: ''
					});
				},3000)
			}
			
		}
	}
	likeComment = (id,status,check) => {
		this.props.likeComment(id,status,check);
	}
	clear = () => {
		this.setState({
			turned: false
		});
		this.props.clearNewComment();
		this.props.displayComment();
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
		let newStr = this.state.comment.slice(0, startPos) + emojiPic + this.state.comment.slice(startPos) 
		this.props.updatecomment(newStr);	    

	}
	render(){
		let replies = this.state.loading ? <button className="btn btn-default"><span className="spinner-border spinner-border-lg text-primary">
		</span></button> : this.state.all_names.length ? 
		<input type='text' value={this.state.replier} placeholder='Type name to reply' className='reply-input form-control' onChange={this.onReply}/> : 
		<span className='reply-nothing'>Be first to reply</span> ;
		let li_list = this.state.selected_name.length ? this.state.selected_name.map((name,i) => {
			let src = `http://localhost:8080/newSwitch/Profile/${name.pix}`;
			return (<li onClick={()=>this.takeName(name.name,name.id)} key={i} className='combo-li'>
			<img src={src} width='50' height='50' className='li-image' alt='profile-img'/>{name.name}</li>
			)
		}): '';
		let combo_list = this.state.selected_name.length ? <ul className='combo-list shadow'>{li_list}</ul> : '';
		let names = this.state.display_name.map((name,i) => {
			return <SpanReply name={name} id={this.state.display_num[i]} key={i} deleteReply={this.deleteReply} sides='front'/>
		});
		let error = this.state.error ? <span className='com-error'>{this.state.err_comment}</span> : '';
		let send = this.state.icons ? ['far', 'paper-plane'] : 'feather-alt';
		let usrc = `http://localhost:8080/newSwitch/Profile/${this.state.pix}`;
		let id = `${this.state.type}${this.state.pid}`;
		const customEmojis = [
			{
			    name: 'Octocat',
			    short_names: ['octocat'],
			    text: '',
			    emoticons: [],
			    keywords: ['github'],
			    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7',
			}]
	
		const styles = {
			getEmojiButton: {
			    cssFloat: 'right',
			    border: 'none',
			    margin: 0,
			    cursor: 'pointer',
		},
			emojiPicker: {
			    position: 'absolute',
			    bottom: 0,
			    right: 0,
			    cssFloat: 'right',
			    marginLeft: '200px',
			}
		}
		if(!this.state.turned){
			return (
				<div className='row center-absolute'>				
					<div className='row reply-detail-container'>
						<div className='row close-div'>
							<div className='col-11 text'>
								<span className='float-right clearfix' onClick={()=>this.props.displayComment()}>&times;</span>
							</div>
						</div>
						<div className='row reply-detail'>
							<div className='col-3'>
								<img src={usrc} className='uimg'/>
							</div>
							<div className='col-9'>
								<span className='reply-text'>
									Reply 
									<span className='all-replies'>
										{replies}
										{combo_list}
									</span>
								</span>
								{names}	
								{error}
								<div className='row close-div'>
									<div className="input-group mb-3 nt-ig">
										<textarea className='writeonly form-control' rows='1' id={id}
										placeholder='Write a reply' value={this.state.comment} onChange={this.onChange}></textarea>
										<div className="input-group-append">
										    <button onClick={this.submit} className='btn btn-primary btn-lg btndef'>
										    <FontAwesomeIcon icon={send} color='white' size='2x' /></button> 
										</div>
									</div>
								</div>
								<div className='row close-div'>
									<div className='col-12'>
									    {
									        this.state.showEmojis ?
									            <span className="input-group-text" ref={el => (this.emojiPicker = el)}>
									                <Picker onSelect={this.addEmoji} />
									            </span>
									        :
									            <span className="input-group-text image-emoji" onClick={this.showEmojis} >
									                <FontAwesomeIcon icon={['far','smile']} color='#7289da' size='2x' />
									            </span>
										} 
									</div>
								</div>						
							</div>
						</div>
						
					</div>
				</div>
			);
		}else{
			console.log(this.state.newcomment);
			let names = this.state.display_name.map((name,i) => {
				return <SpanReply name={name} key={i}/>
			});
			let src = this.state.newcomment.length ? `http://localhost:8080/newSwitch/Profile/${this.state.newcomment[0].pix}` :
			`http://localhost:8080/newSwitch/Profile/${this.state.newcomment.pix}`;
			let Like = this.state.newcomment.length ? this.state.newcomment[0].like ? <FontAwesomeIcon icon='heart' className='ellipsis' color='tomato' size='2x'/>: 
				<FontAwesomeIcon icon={['far', 'heart']} className='ellipsis-h n-like' color='#000' size='2x'/>: '';
			let cid = this.state.newcomment.length ? this.state.newcomment[0].cid: '';
			let num = this.state.newcomment.length ? this.state.newcomment[0].like ? 0 : 1 : '';
			let comment = this.state.newcomment.length ? this.state.newcomment[0].comment : '' ;
			let name = this.state.newcomment.length ? this.state.newcomment[0].name : '' ;
			console.log(cid+' '+num+' new');
			return (
				<div className='row center-absolute'>				
					<div className='row reply-detail-container'>
						<div className='row close-div'>
							<div className='col-11 text'>
								<span className='float-right clearfix' onClick={this.clear}>&times;</span>
							</div>
						</div>
						<div className='row row-name'>
							<div className='col-2 col-pix-pic text-left'>						
								<span className='span-img'>
									<img src={src} width='70' height='70' alt='Profile_Image' />
								</span>
							</div>
							<div className='col-10 col-name-span text-left'>
								<span className='span-name span-straight'>
									<b><span className='namelink'>{name}</span></b> 
								</span> 
								replied 
								{names}
								<div className='row'>
									<div className='col-12 sent-comment'>
										{comment}
									</div>
								</div>
								<div className='row'>
									<div className='col-12'>
										<span onClick={()=>this.likeComment(cid,num,'new')}>{Like}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			 )
		}
	}
}
