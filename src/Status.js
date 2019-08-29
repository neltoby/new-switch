import React from 'react';
import './Status.css';

const Status = (props) => {
	let src = `http://localhost:8080/newSwitch/Profile/${props.pic}`;
  return (
    <div className='status-edit-container form-div'>
	    <div className='row text-container'>
			<div className='col-2'>
				<img src={src} width='100' height='100' alt='profile pic' className='edited-status-profile'/>
			</div>
			<div className='col-8 edit-container shadow'>
				<div className='check-status'>
					{props.status}
				</div>
				<div className='row edit-status'>
					<button type='button' className='edit-but' onClick={props.edit}>Edit Status</button>
				</div>
			</div>
			<div className='col-2'>
			</div>

		</div>
		

	</div>
  )
}

export default Status;