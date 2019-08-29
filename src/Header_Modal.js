import React from 'react';
import Header_Modal_Likes from './Header_Modal_Likes';
import './LocModal.css';
import $ from './jquery-3.2.1';

export default class Header_Modal extends React.Component {
	close = () => {
		// document.getElementById('locModal').style.display='none';
		$('#intModal').fadeOut();
	}

	render() {
		return (
			<React.Fragment>
				<div className="c-modal" id="intModal" style={{display: 'none'}}>
					<div className="c-modal-dialog">
					    <div className="c-modal-content">
					        <Header_Modal_Likes close={this.close}/>
					    </div>
				    </div>
			    </div>
		    </React.Fragment>
		);
	}
}
