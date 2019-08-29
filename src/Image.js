import React from 'react';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Image extends React.Component {
	state = {
		like: this.props.likes,
		count: this.props.likecnt,
		views: this.props.views,
		notification: this.props.notification,
		uid: this.props.uid,
		pid: this.props.pid
	}

		timer ='';
		audio = new Audio('./audio_2.wav');
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.uid !== prevState.uid ||
			nextProps.notification !== prevState.notification || nextProps.pid !== prevState.pid){
			return{
				uid: nextProps.uid,
				notification: nextProps.notification,
				pid: nextProps.pid,
			}
		}
		return null;
	}

	componentDidMount(){
		// this.timer = setInterval(() =>{
		// 	this.checklikes(this.state.pid, this.props.src);
		// 	this.imageViews(this.props.src);
		// },10000);
		// this.imageViews(this.props.src);
	}

	componentWillUnmount(){
		if(this.timer){
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	checklikes = (id, name) => {
		$.ajax({
        	url: "http://localhost:8080/Switch/switch/likes.php",
		    type: "POST",
			data: {check: 'check', id: id, name: name},
			beforeSend: () => {				
			},
			success: (data) => {
				// console.log(data);
				this.setState({
					count: data
				})
			},
			error: (err) => {
				console.log(err);
			}    			

        });
		
	}

	display = (data) => {
		document.getElementById(data).style.display='block';
	}

	activateLike = (id, name, status) => {
		$.ajax({
	        	url: "http://localhost:8080/Switch/switch/likes.php",
			    type: "POST",
				data: {type: 'multiple', id: id, name: name, status: status},
				beforeSend: () => {				
				},
				success: (data) => {
					//console.log(data);
					// this.setState({
					// 	count: data
					// })
				},
				error: (err) => {
					console.log(err);
				}    			

	        });
	}

	likeButton = () => {
		let count = this.state.count;
		if(this.state.like){
			count --;
			this.setState({
				like: !this.state.like,
				count
			})
			this.activateLike(this.state.pid, this.props.src, 0)
		}else{
			count ++;
			this.audio.play();
			this.setState({
				like: !this.state.like,
				count
			})
			this.activateLike(this.state.pid, this.props.src, 1)
		}
	}

	addComment = () => {
		this.setState({
			comment: this.state.comment + 1
		})
	}

	imageViews = (id) => {
		// $.ajax({
  //       	url: "../switch/image_view_count.php",
		//     type: "POST",
		// 	data: {image: id, pid: this.state.pid},
		// 	beforeSend: () => {				
		// 	},
		// 	success: (data) => {
		// 		this.setState({
		// 			views: data
		// 		})
		// 	},
		// 	error: (err) => {
		// 		console.log(err);
		// 	}    			

  //       });
	}
	
	render(){
		let notification = `${this.state.notification}${this.state.uid}`;
		let colored_Like = this.state.like ? <FontAwesomeIcon icon='heart' className='ellipsis-h' color='red' size='1x'/>: 
		<FontAwesomeIcon icon={['far', 'heart']} className='ellipsis-h' color='#fff' size='1x'/>;
		let pid = `slides-container ${notification}${this.state.pid}mySlides`;
		let src = `http://localhost:8080/newSwitch/PostImages/${this.props.src}`;
		let current = `${this.props.num}/${this.props.count}`;
		let id = `${notification}${this.props.num}_${this.props.src}`;
		let count = this.state.count > 1 ? `${this.state.count} likes` : `${this.state.count} like`;
		// let view = this.state.views > 1 ? `${this.state.views} views` : `${this.state.views} view`;
		let height = '';
		if(this.state.notification == 'post') {
			height = '500';
		}else if(this.state.notification == 'comment'){
			height = '700';
		}else{
			height = '400';
		}
		return(
			<div className={pid} id={id}>
				<div className='display-topright'>
					<div className='row'>
						<div className='col-6 text-left'>
							<b>{current}</b>
						</div>
						<div className='col-6 text-right'>
							<b>{count}</b>
						</div>
					</div>
				</div>
				<img src={src} width='100%' className='post-image' height={height} onDoubleClick={this.likeButton}/>
				<div className='display-bottomright'>
					<div className='row'>
						<div className='col-6 text-left'>
						    <FontAwesomeIcon icon={['far', 'comment-alt']} className='ellipsis-h' color='#fff' size='1x'/>
					    </div>
					    <div className='col-6 text-center'>
							{colored_Like}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
