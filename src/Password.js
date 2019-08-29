import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Password.css';

export default class LoginForm extends Component {
	state = {
		show: false,
		password: '',
		errorPass: false
	}

	show = () => {
		this.setState({
			show: !this.state.show
		})
	}
	clearError = () => {
		this.props.clearError();
	}

	clear = () => {
		this.setState({
			password: ''
		});
		this.clearError();
	}
	onChange = (e) => {
		this.setState({
			password: e.target.value,
		});
		this.clearError();
	}

	render(){
		let labelSize = '0.8rem';
		let input = this.state.show ? 'text' : 'password';
		let icon = this.state.show ? 'eye-slash' : 'eye';
		let title = this.state.show ? 'Hide' : 'Show';
		let password_display = this.state.password.trim().length || this.state.errorPass? 'block' : 'none' ;
		let display = this.state.password.trim().length ? 'block' : 'none' ;
		let passcolor = this.state.errorPass ? 'red' : '#355664' ;
		let password = {
			display: password_display,
			zIndex: 1,
			color: passcolor,
			fontSize: labelSize
		}
		let style = {
			display: display,
			zIndex: 1
		}
		return(
			<div className='user-div'>
				<label htmlFor='password' style={password}>Password</label>
				<div className="input-group mb-3">
				    <div className="input-group-prepend">
				        <span className="input-group-text"><FontAwesomeIcon icon='lock' color='gray'/></span>
				    </div>
				    <input type={input} name='password' className="form-control" onChange={this.onChange} placeholder='Password' 
				    value={this.state.password}/>
				    <div className="input-group-append">
					    <span className="input-group-text" onClick={this.show} title={title}><FontAwesomeIcon icon={icon} color='gray' /></span> 
					    <span className="input-group-text" onClick={this.clear} style={style}><FontAwesomeIcon icon='times' color='gray' /></span> 
					</div>
			    </div>
			</div>

		)
	}
}