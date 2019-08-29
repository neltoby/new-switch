import React from 'react';
import './MultiPix.css';

export default class MultiPix extends React.Component {
	state = {
		pix: this.props.pix,
		pid: this.props.pid
	};

	render() {
		let id = `demo${this.state.pid}`;
		let pid= `#demo${this.state.pid}`;
		let photo = this.state.pix.map((pic,i) => {
			let src = `http://localhost:8080/newSwitch/PostImages/${pic.pic}`;
			let keys= `${i}${id}`;
			if(i == 0){				
				return(
					<div className='carousel-item active' key={keys}>
				        <img src={src} className='carousel-image' alt='pics' />
				        <div className='carousel-caption'>
						    <h3>Los Angeles</h3>
						    <p>We had such a great time in LA!</p>
						</div>
				    </div>
					);
			}
			return(
				<div className='carousel-item' key={keys}>
			        <img src={src} className='carousel-image' alt='pics' />
			        <div className='carousel-caption'>
					    <h3>Los Angeles</h3>
					    <p>We had such a great time in LA!</p>
					</div>
			    </div>
				);
		})
		let slide = this.state.pix.map((pic,i) => {
			if(i == 0){
				return(
					<li data-target={pid} data-slide-to={i} className='active' key={i}></li>
					);
			}
			return(
				<li data-target={pid} data-slide-to={i} key={i}></li>
			);
			
		})
		return (
			<div id={id} className="carousel slide" data-ride="carousel">
			    <ul className="carousel-indicators">
				    {slide}
			    </ul>
			    <div className="carousel-inner">			    
				    {photo}
			    </div>
			    <a className="carousel-control-prev" onClick={()=>{this.plusDivs(-1,1)}}>
			    <span className="carousel-control-prev-icon"></span>
			    </a>
			    <a className="carousel-control-next" onClick={()=>{this.plusDivs(-1,2)}}>
				    <span className="carousel-control-next-icon"></span>
			    </a>
			</div>
		);
	}
}
