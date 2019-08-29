import React from 'react';
import Interest from './Interest';
import $ from './jquery-3.2.1';

export default class Header_Modal_Likes extends React.Component {
	closeModal = () => {
		this.props.close();
	}
	render() {
		return (
			<React.Fragment>
				<div className="c-modal-header text-center">
			        <span className="c-modal-title"><b className='interest'>Select Interest</b></span>
			        <button type="button" className="close" onClick={this.closeModal}>&times;</button>
		        </div>
		        <div className="c-modal-body m-body">
			        <Interest closeModal={this.closeModal}/>;
		        </div>
	        </React.Fragment>
		);
	}
}
