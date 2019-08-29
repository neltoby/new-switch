import React from 'react';

export default class MiniTurnoff extends React.Component {
	state = {
		post: this.props.post,
	}
	closeshow = () => {
		this.props.closeshow();
	}
	turnoff = () => {
		this.props.turnoff(this.state.post.uid);
		this.props.closeshow();
	}

	render() {
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.post.pix}`;
		return (
			<div className='turnoff-confirmation-container'>
				<div className='row turnoff-confirmation-row'>
					<div className='turn-off-comment'>
						Turn Off {this.state.post.name}?
					</div>
					<div className='div-turnoff-img'>
						<img src={src} width='80' height='80' alt='Image' className='rimg-share'/>
					</div>
					<div className='row turnoff-confirmation-option'>
						<div className='col-4' onClick={this.closeshow}>
							Cancel
						</div>
						<div className='col-4'>
						</div>
						<div className='col-4' onClick={this.turnoff}>
							Turn Off
						</div>
					</div>
					<div className='turn-off-summary'>
						You will not see {this.state.post.name}'s post on {this.state.post.interest} wall anymore, <br/>although you still follow {this.state.post.name}
					</div>
				</div>
			</div>
		);
	}
}
