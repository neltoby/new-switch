import React from 'react';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ThreadForm.css';

export default class ThreadForm extends React.Component {
	state = {
		post: this.props.post,
		interest: this.props.interest,
		location: this.props.location,
		posttext: '',
		tagtext: '',
		file: '',
		files: [],
		tag: false,
		error: '',
		errorStatus: ''
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post ||  nextProps.interest !== prevState.interest 
			|| nextProps.location !== prevState.location){
			return{
				post: nextProps.post,
				interest: nextProps.interest,
				location: nextProps.location
			}
		}
		return null;
	}
	validate = () => {
		if(this.state.files.length && (this.state.posttext || this.state.tagtext)){
			if(this.state.posttext){
				if(this.state.posttext.length < 6){
					this.setState({
						error: 'Post must be a minimum of 6 characters or is optional',
						errorStatus: 'post'
					});
					return false
				}
			}
			if(this.state.tagtext){
				if(this.state.tagtext.length < 2){
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
		e.preventDefault();
		let val = this.validate();
		if(val){
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/writePost.php",
			    type: "POST",
				data: new FormData($('form')[0]),
				cache: false,
				contentType: false,
				processData: false,
				beforeSend: () => {},
				success: (response) => {
					console.log(response);
					let res = JSON.parse(response);
					if(res.state){
						console.log(res);
						this.setState({
							posttext:'',
							tagtext: '',
							files: [],
							file: '' 
						});
						this.props.newPost(res);
						this.props.thread(this.state.post.pid);
						this.props.closeModal();						
					}
					
				},
				error: () => {

				}    			
	        });
		}else{
			console.log('Invalid');
		}
	}
    onChange = (e) => {
    	if(e.target.name == 'post'){
    		this.setState({
    			posttext: e.target.value 
    		});
    	}else{
    		this.setState({
    			tagtext: e.target.value
    		});
    	}
    }
    onClick = () => {
		this.setState({
			tag: !this.state.tag 
		});
    }
    handleFileOnChange = (e) => {
    	let value = e.target.value;
		let files = e.target.files;
		this.setState({
			file: value,
			files
		})
    }
	render() {
		let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		let first = alphabet[Math.floor(Math.random() * alphabet.length)];
		let second = alphabet[Math.floor(Math.random() * (alphabet.length-1))];
		let third = alphabet[Math.floor(Math.random() * (alphabet.length-2))];
		let fouth = alphabet[Math.floor(Math.random() * (alphabet.length-3))];
		let id = `${first}${second}${localStorage.set_id}${third}${fouth}`;
		let placeholder;
		let current = this.state.location.current;
		if(current == 'country'){
			placeholder = `Discuss ${this.state.interest} in ${this.state.location.country}`;
		}else if(current == 'state'){
			placeholder = `Discuss ${this.state.interest} in ${this.state.location.state}`;
		}else if(current == 'local'){
			placeholder = `Discuss ${this.state.interest} in ${this.state.location.municipal}`;
		}
		let tag = this.state.tag ? <input type='text' name='tag' placeholder='Tag Post' value={this.state.tagtext} 
				className='form-control thread-tag' onChange={this.onChange}/>: '' ;
		let postpix = this.state.post.postpix.length > 1 ? this.state.post.postpix[0].pic : this.state.post.postpix.pic ;
		let src = `http://localhost:8080/newSwitch/PostImages/${postpix}`;	
		let num = this.state.post.postpix.length > 1 ? `${this.state.post.postpix.length - 1}+ `: 1 ;
		let divNum = this.state.post.postpix.length > 1 ? <span className='img-num'>{num} </span> : '' ;
		let tagErr = this.state.errorStatus == 'tag' ? this.state.error : '' ;
		let postErr = this.state.errorStatus == 'post' ? this.state.error : '' ;
		console.log(this.state.post);
		return (
			<React.Fragment>
				<form action='' encType='multipart/form-data' onSubmit={this.onSubmit} className='form-center'>
					<div className='row icon-title'>
						<div className='col-9 col-9-tag'>
							<span className='tag-icon-container'>
								<span className='tag-icon'><FontAwesomeIcon icon='link' className='ellipsis-h' color='#000' size='2x'/></span>
								&nbsp;&nbsp;&nbsp; <strong>-</strong>&nbsp;&nbsp;&nbsp;
								<span className='tag-title'><strong>{this.state.post.tag}</strong></span>
							</span>
						</div>
						<div className='col-3'>
							<img src={src} width='100%' height='100' alt='Image' className='post-threaded-img'/>
							{divNum}
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
						<textarea name='post' placeholder={placeholder} value={this.state.posttext} 
						className='form-control thread-textarea' onChange={this.onChange}></textarea>
						{postErr}
						<br/><br/>
						<input type='hidden' name='interest' value={this.state.interest}/>
						<input type='hidden' name='pid' value={id} />
						<input type='hidden' name='current' value={this.state.location.current}/>
						<input type='hidden' name='thread' value={this.state.post.pid} />
						<input type='hidden' name='share' value='Public'/>
						<input type='hidden' name='country' value={this.state.location.country}/>
						<input type='hidden' name='state' value={this.state.location.state}/>
						<input type='hidden' name='municipal' value={this.state.location.municipal}/>

						<button type='submit' name='submit' className='btn btn-primary send-thread'>
							Post
						</button>
					</div>
				</form>
			</React.Fragment>
		);
	}
}
