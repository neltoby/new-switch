import React from 'react';
import './EditPost.css'

export default class EditPost extends React.Component {
	state = {
		post: this.props.post,
		tag: this.props.tag,
		errtext: this.props.errtext,
		loading: false
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.post !== prevState.post || nextProps.tag !== prevState.tag || nextProps.errtext !== prevState.errtext){
			return{
				post: nextProps.post,
				tag: nextProps.tag,
				errtext: nextProps.errtext
			}
		}
		return null;
	}
	editEpost = (post) => {
		this.props.editEpost(post)
	}
	editEtag = (tag) => {
		this.props.editEtag(tag)
	}
	onChange = (e) => {
		if(e.target.name == 'post'){
			this.editEpost(e.target.value)
		}else if(e.target.name == 'tag'){
			this.editEtag(e.target.value)
		}
	}
	editPost = () => {
		this.props.editPost(2);
	}
	onClick = () => {
		if(this.state.post.trim().length > 10){
			this.setState({
				loading: true 
			});
			this.props.onClick(this.state.post,this.state.tag);
			setTimeout(()=>{
				this.editPost();
			},1000)
		}	
	}
	render() {
		let errtext = this.state.errtext
		if(!this.state.loading){
			return (
				<div className='row form-control row-edit'>
					<div className='row form-control'>
						<input type='text' value={this.state.tag} name='tag' placeholder='Edit Tag' className='form-control' 
						onChange={this.onChange}/>
					</div>
					<div className='row form-control'>
						<textarea name='post' value={this.state.post} placeholder='Edit post' className='form-control' 
						onChange={this.onChange}></textarea>
					</div>
					<br/><br/>
					<div className='button-control'>
						<input type='button' className='btn btn-primary' value='Save' onClick={this.onClick}/>
					</div>
				</div>
			);
		}else{
			return(
				<div className='row form-control row-edit'>
					<span className='edit-load-span'>Saving ...</span>
				</div>
			)
		}
	}
}
