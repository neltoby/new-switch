import React from 'react';

export default class SharedInterest extends React.Component {
	state = {
		shared: this.props.sharedinterest,
		displayed: false
	}
	view = () => {
		this.setState({
			displayed: true
		});
	}

	render() {
		let display = this.state.displayed ? this.state.shared.map((share,i) => {
			return <span className='shared-item' key={i}>{share}</span>
		}): <span className='share-span-container'>
				<span className='shared-count'>{this.state.shared.length}</span> 
				<span className='view-shared' onClick={this.view}>View</span>
			</span>;
		// let divdisplay = this.state.displayed ? <div className='div-displayed'>{display}</div> : {display} ;
		return (
			<div className='row shared-item-display'>
				<span className='shared-title'>Shared interest </span>
				{display}
			</div>
		);
	}
}
