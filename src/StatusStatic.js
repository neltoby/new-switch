import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class StatusStatic extends React.Component {
	state = {
		icons: this.props.icons,
		status: this.props.status,
		interest: this.props.interest,
		pic: this.props.pic

	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.interest !== prevState.interest || nextProps.status !== prevState.status ||
			nextProps.pic !== prevState.pic || nextProps.icons !== prevState.icons){
			return{
				interest: nextProps.interest,
				status: nextProps.status,
				pic: nextProps.pic,
				icons: nextProps.icons
			}
		}
		return null;
	}
	openModal = () => {
		this.props.openModal();
	}

	render() {
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.pic}`;
		let send = this.state.icons ? ['far', 'paper-plane'] : 'feather-alt';
		let num = !this.state.status.length ? 0 : this.state.status.length;
		let textValue = this.state.status ? '20px': '40px';
		let shortPlaceholder = `Write ${this.state.interest} status`;
		return (
			<div className='status-container form-div' onClick={this.openModal}>
				<div className='row text-container'>
					<div className='col-2'>
						<img src={src} width='70' height='70' alt='profile pic' className='status-profile'/>
					</div>
					<div className='col-10'>
						<div className="input-group mb-3 wrt-grp">
						    <textarea value={this.state.status} placeholder={shortPlaceholder} 
						    className='form-control' maxLength='150' rows='1' readOnly style={{fontSize: textValue}}></textarea>
						    <div className="input-group-append">
							    <span className="input-group-text read-text">
							    {num}/150</span> 
							</div>								
						    <div className="input-group-append">
							    <span className="input-group-text">
							    <FontAwesomeIcon icon={send} color='#7289da' size='2x' /></span> 
							</div>
						</div>
						<div className='status-error'>{this.state.error}</div>
					</div>
				</div>
			</div>
		);
	}
}
