import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Share extends React.Component {
	state = {
		interest: this.props.interest,
		location: this.props.location,
		pix: this.props.pix,
		all_followers: this.props.all,
		interest_followers: this.props.interestF,
		location_followers: this.props.locationF,
		interest_location: this.props.intLocation,
		choose: true,
		num: '',
		share: '',
		error: '',
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.pix !== prevState.pix || nextProps.interest !== prevState.interest ||
		   nextProps.location !== prevState.location || nextProps.all !== prevState.all_followers ||
		   nextProps.interestF !== prevState.interest_followers || nextProps.locationF !== prevState.location_followers
		   || nextProps.intLocation !== prevState.interest_location || nextProps.token !== prevState.token){
			return{
				pix: nextProps.pix,
				interest: nextProps.interest,
				location: nextProps.location,
				all_followers: nextProps.all,
				interest_followers: nextProps.interestF,
				location_followers: nextProps.locationF,
				interest_location: nextProps.intLocation,
				token: nextProps.token
			}
		}
		return null;
	}
	shareWith = () => {
		if(this.state.share.trim().length && this.state.share.length > 2){
			this.share(this.state.num,this.state.share);
		}else{
			this.setState({
				error: 'Minimum of 2 characters'
			});
			setTimeout(()=>{
				this.setState({
					error: ''
				});
			},3000)
		}
	}
	shareWithout = () => {
		this.share(this.state.num, '');
	}
	closeshow = () => {
		this.props.closeshow();
	}
	share = (num,text) => {
		this.props.share(num,text);
		// this.closeshow();
	}
	changeShare = (num) => {
		this.setState({
			num,
			choose: false
		});
	}
	onChange = (e) => {
		this.setState({
			share: e.target.value
		});
	}
	changeBack = () => {
		this.setState({
			num: '',
			choose: true 
		});
	}

	render() {
		let location;
		if(this.state.location.current == 'country'){
			location = this.state.location.country;
		}else if(this.state.location.current == 'state'){
			location = `${this.state.location.state} , ${this.state.location.country}`;
		}else if(this.state.location.current == 'local'){
			location = `${this.state.location.municipal} , ${this.state.location.state} , ${this.state.location.country}`;
		}
		let usrc = `http://localhost:8080/newSwitch/Profile/${this.state.pix}`;
		if(this.state.choose){
			return (
				<div className='share-center'>
					<div className='row share-content'>
						<div className='row share-title share-div'>
							<div className='col-2'>
								<img src={usrc} width='35' height='35' alt='Image' className='rimg-share'/>
							</div>
							<div className='col-7'>
								Share
							</div>
							<div className='col-3'>
								<button className='close' onClick={this.closeshow}>&times;</button>
							</div>
						</div>
						<div className='row share-types' onClick={()=>{this.changeShare(1)}}>
							<div className='col-3'>
								<span className='share-post'>
									<FontAwesomeIcon icon='user-friends' className='share-post-icon' color='#647489' size='1x'/>
								</span>
							</div>
							<div className='col-9 text-left'>
								<span className=''> All Your Followers</span>
								<div className='ff-count text-right'>
									<span className='ff-count'>
										{this.state.all_followers}
									</span>
								</div>
							</div>
						</div>
						<div className='row share-types' onClick={()=>{this.changeShare(2)}}>
							<div className='col-3'>
								<span className='share-post'>
									<FontAwesomeIcon icon='user-friends' className='share-post-icon' color='#647489' size='1x'/>
								</span>
							</div>
							<div className='col-9 text-left'>
								<span className=''>All Followers interested in {this.state.interest}</span>
								<div className='ff-count text-right'>
									<span className='ff-count'>
										{this.state.interest_followers} 
									</span>
								</div>
							</div>
						</div>
						<div className='row share-types' onClick={()=>{this.changeShare(3)}}>
							<div className='col-3'>
								<span className='share-post'>
									<FontAwesomeIcon icon='user-friends' className='share-post-icon' color='#647489' size='1x'/>
								</span>
							</div>
							<div className='col-9 text-left'>
								<span className=''>All Followers interested in {this.state.interest} at {location}</span>
								<div className='ff-count text-right'>
								<span className='ff-count'>
									{this.state.interest_location}
								</span>
								</div>
							</div>
						</div>
						<div className='row share-types' onClick={()=>{this.changeShare(4)}}>
							<div className='col-3'>
								<span className='share-post'>
									<FontAwesomeIcon icon='user-friends' className='share-post-icon' color='#647489' size='1x'/>
								</span>
							</div>
							<div className='col-9 text-left'>
								<span className=''>All Followers at {location}</span>
								<div className='ff-count text-right'>
									<span className='ff-count'>
										{this.state.location_followers}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}else{
			let title = this.state.num == 1 ? 'All Your Followers' : this.state.num == 2 ? `All Followers interested in ${this.state.interest}` :
			this.state.num == 3 ? `All Followers interested in ${this.state.interest} at ${location}`: `All Followers at ${location}`;
			return(
				<div className='share-center write-share-container'>
					<div className='row share-content'>
						<div className='row share-title share-div'>
							<div className='col-2' onClick={this.changeBack}>
								<FontAwesomeIcon icon='arrow-left' className='share-post-icon' color='#647489' size='1x'/>
							</div>
							<div className='col-7'>
								Share
							</div>
							<div className='col-3'>
								<button className='close' onClick={this.closeshow}>&times;</button>
							</div>
						</div>
						<div className='write-share-title'>
							{title}
						</div>
						<div className='row write-share-row without'>
							<div className='col-8 no-write'>
								Share this post
							</div>
							<div className='col-4'>
								<span className='share-btn' onClick={this.shareWithout}>Share</span>
							</div>
						</div>
						<div className='row write-share-row'>
							<div className='share-comment-div'>Write a comment to share</div>
							<div className='row write-row'>
								<div className='col-9 '>								
									<textarea className='form-control share' value={this.state.share}  
									placeholder='Write a comment' onChange={this.onChange}></textarea>
								</div>
								<div className='col-3'>
									<span className='write-share-btn' onClick={this.shareWith}>Share</span>
								</div>
							</div>
							<div className='share-comment-error'>{this.state.error}</div>
						</div>
					</div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
				</div>
			)
		}
	}
}
