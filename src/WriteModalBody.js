import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DisplayLocation from './DisplayLocation';
import $ from './jquery-3.2.1';
import WriteThread from './WriteThread';

export default class WriteModalBody extends React.Component {
	state = {
		post: '',
		tag: '',
		checked: false,
		trending_tag: '',
		thread: '',
		error: '',
		errorStatus: '',
		file: '',
		files: [],
		tags: false,
		threadId: '',
		thread_details: [],
		interest: this.props.interest,
		location: this.props.location,
		all_interest: this.props.all_interest,
		user: this.props.user,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.location !== prevState.location || nextProps.interest !== prevState.interest ||
			nextProps.all_interest !== prevState.all_interest || nextProps.user !== prevState.user || 
			nextProps.token !== prevState.token){
			return{
				location: nextProps.location,
				interest: nextProps.interest,
				all_interest: nextProps.all_interest,
				user: nextProps.user,
				token: nextProps.token
			}
		}
		return null;
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
	findThread = (info) => {
		console.log(info);
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/findThread.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: info,
			beforeSend: () => {				
			},
			success: (data) => {
				console.log(data);
				if(data){
					let thread = this.isJson(data);
					if(thread){
						if(thread.token){
							if(this.state.token !== thread.token){
								this.setCookie('access',thread.token,8);
							}
						}
						if(thread.status){
							console.log(thread);
							this.setState({
								thread_details: thread.res
							});
						}else{
							console.log('error occurred');
							this.setState({
								thread_details: [] 
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
	onClick = () => {
		this.setState({
			tags: !this.state.tags 
		});
    }
	onChange = e => {
		if(e.target.name == 'post'){
			this.setState({
				post: e.target.value
			});
			if(e.target.value.trim().length > 5){
				this.setState({
					error: '',
					errorStatus: ''
				});
			}
		}else if(e.target.name == 'tag'){
			this.setState({
				tag: e.target.value
			});
			if(e.target.value.trim().length > 1){
				this.setState({
					error: '',
					errorStatus: ''
				});
				let data;
				let text= e.target.value;
				let interest = this.state.interest;
				let current = this.state.location.current;
				let country = this.state.location.country;
				let state = this.state.location.state;
				let local = this.state.location.municipal;
				if(current == 'country'){
					data = {text:text,interest:interest,current:current,country:country}
				}else if(current == 'state'){
					data = {text:text,interest:interest,current:current,country:country,state:state}
				}else{
					data = {text:text,interest:interest,current:current,country:country,state:state,local:local}
				}
				this.findThread(data);
			}else{
				this.setState({
					thread_details: [] 
				});
			}
		}
	}
	checkbox = (e) => {
		this.setState({
			checked: e.target.checked
		});	
		if(e.target.checked === true){
			this.deleteThread()
		}	
	}
	thread = (thread) => {
		this.setState({
			thread 
		});
	}
	validate = () => {
		if(this.state.files.length || this.state.post || this.state.tag){
			if(this.state.post){
				if(this.state.post.length < 6){
					this.setState({
						error: 'Post must be a minimum of 6 characters or is optional',
						errorStatus: 'post'
					});
					return false
				}
			}
			if(this.state.tag){
				if(this.state.tag.length < 2){
					this.setState({
						error: 'Tag must be a minimum of 2 characters or is optional',
						errorStatus: 'tag' 
					});
					return false
				}
			}
			return true;
		}
		return false;
	}
	onSubmit = e => {
		if(this.state.token){
			e.preventDefault();
			let val = this.validate();
			if(val){
				console.log('sent');
				$.ajax({
		        	url: "http://localhost:8080/newSwitch/Codelet/writePost.php",
				    type: "POST",
				    headers: {"Authorization": `${this.state.token}`},
					data: new FormData($('form')[0]),
					cache: false,
					contentType: false,
					processData: false,
					beforeSend: () => {},
					success: (response) => {
						console.log(response);
						let res = this.isJson(response);
						if(res){
							if(res.token){
								if(this.state.token !== res.token){
									this.setCookie('access',res.token,8);
								}
							}
							if(res.state){
								console.log(res);
								this.setState({
									post:'',
									tag: '',
									files: [],
									file: '' 
								});
								this.newPost(res);
								this.closeModal();
							}
						}
						
							console.log(res);
						// 	this.transform();
						// 	this.setState({
						// 		file: ''
						// 	});
						// 	this.props.thread(JSON.parse(response));
						// }
					},
					error: () => {

					}    			
		        });
			}
		}
	}
	closeModal = () => {
		this.props.closeModal();
	}
	handleFileOnChange = (e) => {
		let value = e.target.value;
		let files = e.target.files;
		this.setState({
			file: value,
			files
		})
	}
	deleteThread = () => {
		this.setState({
			trending_tag: ''
		});
	}
	visible = () => {
		$('.thread').fadeIn();
	}
	blur = () => {
		$('.thread').fadeOut();
	}
	newPost = (post) => {
		this.props.newPost(post);
	}
	dashTag = (trending_tag,threadId) => {
		this.setState({
			trending_tag, 
			threadId,
			checked: false
		});
	}

	render() {
		let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		let lastItem = ''
		if(this.state.location.current == 'local'){
			lastItem = this.state.location.municipal;
		}else if(this.state.location.current == 'state'){
			lastItem = this.state.location.state;
		}else{
			lastItem = this.state.location.country;
		}
		let thread_details = this.state.thread_details.length ? this.state.thread_details.map((thread,i) => {
			return (
				<WriteThread threads={thread} onClick={this.dashTag} key={i}/>
				);
		}): '';
		let placeholder = `Talk ${this.state.interest} in ${lastItem}`;
		let first = alphabet[Math.floor(Math.random() * alphabet.length)];
		let second = alphabet[Math.floor(Math.random() * (alphabet.length-1))];
		let third = alphabet[Math.floor(Math.random() * (alphabet.length-2))];
		let fouth = alphabet[Math.floor(Math.random() * (alphabet.length-3))];
		let id = `${first}${second}${third}${fouth}`;
		let tag = this.state.tags ? <input type='text' name='tag' placeholder='Tag Post' value={this.state.tag} 
				className='form-control thread-tag' onChange={this.onChange}/>: '' ;
		let tagErr = this.state.errorStatus == 'tag' ? this.state.error : '' ;
		let postErr = this.state.errorStatus == 'post' ? this.state.error : '' ;
		// let thread = this.state.threads.length ? this.state.threads.map((thred, i) => {
		// 	return (
		// 		<li className='thread-item' onClick={()=>{this.thread(`${thred}`)}} key={i}>{thred}</li>
		// 		);
		// }): <li className='thread-item'>No trending thread found</li> ;
		let style = {
			textAlign: 'left',
			paddingTop: '0.5rem',
			paddingBottom: 0,
		}
		let check = this.state.checked ? 'Followers' : 'Public' ;
		let checked_tip = this.state.checked ? 'Only Followers will see post': 'Anyone can share this post';
		let display_text = this.state.thread_details.length ? <div className='h2-display'>Trending threads</div> : '';
		let spanThread = this.state.trending_tag ? <div className='row rows-m'><span className=''><b>Post thread</b>: <span className='span-thread btn-defaults'><b> {this.state.trending_tag} </b>
		</span> <span className='delete-thread' onClick={this.deleteThread}>&times;</span></span></div> : '';
		let error = this.state.error ? <div className='row form-rows-m' style={{color: 'tomato'}}><i>{this.state.error}</i></div>: '';
		return (
			<React.Fragment>
			<div className='container-fluid form-div-m' onClick={this.writeModal}>
			<form name='write' method='post' encType='multipart/form-data' onSubmit={this.onSubmit} className='form-center'>
				<div className='row icon-title'>
					<div className='col-7 col-7-tags'>
						<b>{this.state.interest} wall &nbsp;&nbsp;- &nbsp;&nbsp;{this.state.all_interest}</b>
					</div>
					<div className='col-5'>
						<div className='custom-control custom-switch' style={style}>
							<input type='checkbox' className='custom-control-input'
							id='custom-Check' style={{fontSize: '30px !important',backgroundColor: '#7289da'}} 
							value={this.state.checked} onChange={this.checkbox}/>
							<label className='custom-control-label' htmlFor='custom-Check'>
								<h5><b>{check}</b></h5>
								<span className='check-tip'>{checked_tip}</span>
							</label>
						</div>
					</div>
				</div>
				<div className='row row-thread-form-row'>
					<div className='col-4 col-2-thread-form'>
						<label htmlFor='threadFile' className='label-thread-file'>
							<span className='thread-file-label'>
								<FontAwesomeIcon icon={['far', 'images']} className='file-img-icon' color='#7289da' size='2x'/>
							</span>
						</label>
						<span className='thread-tag-span' onClick={this.onClick}>
							<FontAwesomeIcon icon='tag' className='thread-tag-icon' color='#7289da' size='2x'/>
						</span>	
						<input type='file' name='file[]' id='threadFile' style={{display: 'none'}} multiple
						onChange={this.handleFileOnChange} value={this.state.file} />						
					</div>
					<div className='col-8 col-10-thread-form'>
						{tag}
						{tagErr}
					</div>
				</div>
				<div className='row row-thread-form-row'>
					<textarea name='post' placeholder={placeholder} value={this.state.post} 
					className='form-control thread-textarea' onChange={this.onChange}></textarea>
					{postErr}
					<br/><br/>
					<input type='hidden' name='interest' value={this.state.interest}/>
					<input type='hidden' name='pid' value={id} />
					<input type='hidden' name='current' value={this.state.location.current}/>
					<input type='hidden' name='thread' value={this.state.threadId} />
					<input type='hidden' name='share' value={check}/>
					<input type='hidden' name='country' value={this.state.location.country}/>
					<input type='hidden' name='state' value={this.state.location.state}/>
					<input type='hidden' name='municipal' value={this.state.location.municipal}/>

					<button type='submit' name='submit' className='btn btn-primary send-thread'>
						Post
					</button>
				</div>
				{spanThread }
				<div className = 'row'>
					{display_text}
					{thread_details}
				</div>
			</form>
			</div>

			</React.Fragment>
		);
	}
}
