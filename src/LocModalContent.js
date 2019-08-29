import React from 'react';
import LocOptions from './LocOptions';

export default class LocModalContent extends React.Component {
	setLocation = (current,country,state,municipal) => {
		this.props.setLocation(current,country,state,municipal);
	}
	close = () => {
		this.props.close();
	}
	render() {
		return (
			<React.Fragment>
				<div className="c-modal-header text-center">
			        <span className="c-modal-title"><b className='interest'>Change Location</b></span>
			        <button type="button" className="close loclose" onClick={this.close}>&times;</button>
		        </div>
		        <div className="c-modal-body">
			        <LocOptions setLocation={this.setLocation} close={this.close}/>
		        </div>
	        </React.Fragment>
		);
	}
}