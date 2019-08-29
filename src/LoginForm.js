import React, { Component } from 'react';
// import {Redirect} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Password from './Password';
import './LoginForm.css';
import $ from './jquery-3.2.1';
import {NavLink} from 'react-router-dom';
// import LoginBody from './LoginBody';

export default class LoginForm extends Component {
	state = {
		email: '',
		error: '',
		errorEmail: false
	}

	onClick = (e) => {
		localStorage.setItem('username' , 'Jude');
		this.props.onClick();
	}

	clear = () => {
		this.setState({
			email: '',
			error: ''
		})
	}

	onChange = (e) => {
		this.setState({
			email: e.target.value,
			error: ''
		})
	}
	clearError = () => {
		this.setState({
			error: ''
		});
	}
	getCookie = (cname) => {
	    let name = cname + "=";
	    let ca = document.cookie.split(';');
	    for(let i=0; i<ca.length; i++) {
	        let c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return false;
	}

	onSubmit = (e) => {
		e.preventDefault();
		$.ajax({
            url: 'http://localhost:8080/newSwitch/Codelet/login.php',
            type: "POST",
            data: new FormData($('form')[0]),
            cache: false,
	        contentType: false,
	        processData: false,
            beforeSend: () =>{
            },                    
            success: (data) => {
            	console.log(data)
				let res = JSON.parse(data);
				if(res.state){
					let d = new Date();
					d.setTime(d.getTime() + (8*24*60*60*1000));
					let token = `"access=${res.token};"`;
            		document.cookie = "access="+res.token+"; expires="+d.toUTCString();
            		console.log(this.getCookie('access'));
            		console.log(document.cookie);
					this.props.onClick();
				}else{
					this.setState({
						error: res.error
					});
				}				
            },
            error: (error) => {

            }
        });
	}

	render(){
		let labelSize = '0.8rem';
		let emailcolor = this.state.errorEmail ? 'red' : '#355664' ;
		let email_display = this.state.email.trim().length || this.state.errorEmail ? 'block' : 'none' ;
		let display = this.state.email.trim().length ? 'block' : 'none' ;
		let style = {
			display: display,
			zIndex: 1
		}
		let email = {
			display: email_display,
			zIndex: 1,
			color: emailcolor,
			fontSize: labelSize
		}
		return(
			<div className= 'col-8-s'>
				<div className='flex shadow'>
					<form name='upload' onSubmit={this.onSubmit} >
						<div className='flex-1'>
							<div className='flex-img'>
							<img src={require('./icons8-male-avatar-64.png')} width='150' height='150' className='' alt='profile_image'/>
							</div>
							<div className='flex-error'>
								<i>{this.state.error}</i>
							</div>
							<div className='user-div'>
								<label htmlFor='email' style={email}>Email</label>
								<div className="input-group mb-3 i-group">
								    <div className="input-group-prepend">
								        <span className="input-group-text"><FontAwesomeIcon icon='user' color='gray'/></span>
								    </div>
								    <input type="email" name='email' className="form-control" onChange={this.onChange} placeholder='Email' value={this.state.email}/>
								    <div className="input-group-append">
									    <span className="input-group-text" onClick={this.clear} style={style}><FontAwesomeIcon icon='times' color='gray' /></span> 
									</div>
							    </div>
							</div>
							<div className='pass-div'>
								<Password clearError={this.clearError}/>
							</div>
							<div className='row'>
								<div className='col submit-div'>
									<button type='submit' name='submit' className='btn btn-primary s-btn'><b>Login</b></button>
								</div>
								<div className='col text-center forget-password'>
									<NavLink to='/passwordrecovery'><i>Forget Password?</i></NavLink>
								</div>
							</div>
						</div>	
						<div className='flex-2'>
							<span className='span-account'>
								<NavLink to='/createaccount' className='nav-create'><b>CREATE ACCOUNT</b></NavLink>
							</span>
						</div>
					</form>
				</div>
			</div>
		)
		
	}
}