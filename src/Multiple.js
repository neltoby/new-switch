import React from 'react';
import $ from './jquery-3.2.1';
import Image from './Image';
// import Spans from './Spans';

export default class Multiple extends React.Component {
	state = {
		images: this.props.pix,
		pid: this.props.pid,
		tag: this.props.tag,
		notification: this.props.notification,
		uid: this.props.uid
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.tag !== prevState.tag || nextProps.pix !== prevState.images || nextProps.uid !== prevState.uid ||
			nextProps.notification !== prevState.notification || nextProps.pid !== prevState.pid){
			return{
				tag: nextProps.tag,
				pix: nextProps.pix,
				uid: nextProps.uid,
				notification: nextProps.notification,
				pid: nextProps.pid,
			}
		}
		return null;
	}

	slideIndex = 1;

	componentDidMount(){
		this.showDivs(this.slideIndex,1)
	}

	plusDivs = (n,m) => {	
	    this.showDivs(this.slideIndex += n,m);	    
	}

	currentDiv = (n) => {
		if(this.slideIndex != n){
		    if(n > this.slideIndex){
		        this.showDivs(this.slideIndex = n,2);
		    }else{
		        this.showDivs(this.slideIndex = n,1);
		    }			
		}
	} 

	imageViews = (id) => {
		fetch('../switch/image_view.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			body: `image=${id}&pid=${this.props.pid}`		
		})
		.then(response => response.text())
		.then(body =>{ 
		})
		.catch(error => console.error('Error:', error));


		// $.ajax({
  //       	url: "../switch/image_view.php",
		//     type: "POST",
		// 	data: {image: id, pid: this.props.pid},
		// 	beforeSend: () => {				
		// 	},
		// 	success: (data) => {
		// 	},
		// 	error: (err) => {
		// 		console.log(err);
		// 	}    			

  //       });
	}
	initialshowDivs = (n) => {
		let notification = `${this.state.notification}${this.state.uid}`;
		let pid = `${notification}${this.state.pid}mySlides`;
		let dip = `${notification}${this.state.pid}demo`;
		let i;
		let x = document.getElementsByClassName(pid);
		let dots = document.getElementsByClassName(dip);
		if (n > x.length) {this.slideIndex = 1}
		if ((n < x.length) && (n > 0 )) {this.slideIndex = n}   
		if (n < 1) {this.slideIndex = x.length} ;
		for (i = 0; i < x.length; i++) {
		    // x[i].classList.add("slide-in");		    
		    x[i].style.display = "none";
		}
		for (i = 0; i < dots.length; i++) {
		    dots[i].classList.remove("w3-white");
		}
	}

	showDivs = (n,m) => {
		let notification = `${this.state.notification}${this.state.uid}`;
		let pid = `${notification}${this.state.pid}mySlides`;
		let dip = `${notification}${this.state.pid}demo`;
		let i;
		let x = document.getElementsByClassName(pid);
		let dots = document.getElementsByClassName(dip);
		if (n > x.length) {this.slideIndex = 1}
		if ((n < x.length) && (n > 0 )) {this.slideIndex = n}   
		if (n < 1) {this.slideIndex = x.length} ;
		for (i = 0; i < x.length; i++) {
		    x[i].classList.add("slide-in");
		    x[i].classList.remove("slide-out");
		    x[i].classList.remove("slide-out-m");		    
		    // x[i].style.display = "none";
		}
		for (i = 0; i < dots.length; i++) {
		    dots[i].classList.remove("w3-white");
		}
		// x[this.slideIndex - 1].style.display = "block";    
		// x[this.slideIndex - 1].classList.remove("slide-in");
		// x[this.slideIndex - 1].classList.add("slide-out");
		// this.imageViews(x[this.slideIndex - 1].id);
		if(m==1){
		    x[this.slideIndex - 1].classList.remove("slide-in");
		    x[this.slideIndex - 1].classList.remove("slide-out");
		    x[this.slideIndex - 1].classList.add("slide-out-m");
		}else{
			x[this.slideIndex - 1].classList.remove("slide-in");
		    x[this.slideIndex - 1].classList.remove("slide-out-m");
		    x[this.slideIndex - 1].classList.add("slide-out");
		    
		}
		   
		dots[this.slideIndex - 1].classList.add("w3-white");
	}
	render(){
		let notification = `${this.state.notification}${this.state.uid}`;
		const count = this.state.images.length;
		let demo = `${notification}${this.state.pid}demo demo-li active`;
		let all_images = this.state.images.map((image,i) => {
			let num=i+1;
			// let cons = this.state.notification != 'post' ?  console.log(this.state.images): '' ;
			return( 
			<Image 
			src={image.pic} 
			key={image.pic} 
			num={num} 
			count={count} 
			title={this.state.title} 
			pid={this.state.pid}
			likecnt={image.picnt}
			likes={image.imageLike}
			// com={image.mcom}
			uid={this.state.uid}
			views={image.views}
			notification={this.state.notification}
			/>
			);
		})

		let all_span = this.state.images.map((image,i) => {
			let num = i;
			num+=1;
			let uniq = i+image.pic;
			return(
			<li className={demo} onClick={()=>this.currentDiv(num)} key={uniq} pid={this.state.pid}></li>
			)
		})
		let notifications = this.props.tag && (this.state.notification == 'post') ? 
		<div className='b-title'><b>{this.state.tag}</b></div> : '';
		let classes = this.state.notification == 'post' ? 'm-image' : 'c-image';
		return(
			<div className={classes}>				
				<div className = 'carousel slide'>
					<ul className="carousel-indicators">
					    {all_span}
				    </ul>
				    <div className="carousel-inner">
						{all_images}
					</div>
					<a className="carousel-control-prev" onClick={()=>{this.plusDivs(-1,1)}}>
						<span className="carousel-control-prev-icon"></span>
					</a>
					<a className="carousel-control-next" onClick={()=>{this.plusDivs(1,2)}}>
						<span className="carousel-control-next-icon"></span>
					</a>	
				</div>
				{notifications}				
			</div>	
		);
	}
}
