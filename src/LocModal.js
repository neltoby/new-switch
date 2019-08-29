import React from 'react';
import LocModalContent from './LocModalContent';
import './LocModal.css';
import $ from './jquery-3.2.1';


export default class LocModal extends React.Component {
	setLocation = (current,country,state,municipal) => {
		this.props.setLocation(current,country,state,municipal);
	}
	close = () => {
		// document.getElementById('locModal').style.display='none';
		$('#locModal').fadeOut();
	}
	render() {
		return (
			<React.Fragment>
				<div className="c-modal" id="locModal" style={{display: 'none'}}>
					<div className="c-modal-lg">
					    <div className="c-modal-content" id="locContent">
					        <LocModalContent setLocation={this.setLocation} close={this.close}/>
					    </div>
				    </div>
			    </div>
		    </React.Fragment>
		);
	}
}