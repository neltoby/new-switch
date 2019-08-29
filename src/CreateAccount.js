import React, { Component } from 'react';
import {Redirect , NavLink} from 'react-router-dom';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CreateAccount.css';
// import LoginBody from './LoginBody';

export default class CreateAccount extends Component {

	state = {
		username : '',
		email: '',
		mobile: '',
		password: '',
		show: false,
		// file: '',
		input_file: '',
		loading: false,
		errorEmail: false,
		errorPass: false,
		errorUsername: false,
		errorFile: false,
		emailLabel: 'Format must be example@example.domain',
		usernameLabel: 'Must be a minimum of 2 characters',
		passwordLabel: 'Must be atleast 6 characters',
		// fileLabel: 'No file Uploaded',
		countryLabel: 'Current Country',
		stateLabel: 'Current State',
		municipalLabel: 'Current Municipal',
		country: '',
		state: '',
		municipal: '',
		countries:[],
		states: [],
		municipals: [],
		success: false
	}

	componentDidMount(){
	    // $('[data-toggle="tooltip"]').tooltip(); 
	}

	emailConfirmation = (email) => {
		$.post("http://localhost:8080/newSwitch/Codelet/emailConfirmation.php",
		    {
		        email: email
		    },
		   (data, status) => {
				//check if data is array first
				let states = JSON.parse(data);
				if(states.status){
					this.setState({
						errorEmail: true,
						emailLabel: 'Email already exist'
					});
					console.log(states.status + 'yes');
				}else{
					this.setState({						
						errorEmail: false,
						emailLabel: 'Format must be example@example.domain'
					});
					console.log(states.status+ 'no');
				}
		    }
	    );
	}
	checkUsername = (value) => {
		$.post("http://localhost:8080/newSwitch/Codelet/checkUsername.php",
		    {
		        username: value
		    },
		   (data, status) => {
				//check if data is array first
				let res = JSON.parse(data);
				if(res.state){
					this.setState({
						errorUsername: false,
						usernameLabel: 'Must be a minimum of 2 characters'
					});
				}else{
					this.setState({
						errorUsername: true,
						usernameLabel: res.error
					});
				}
		    }
	    );
	}

	onChange = (e) => {
		if(e.target.name == 'username'){
			this.setState({
				username: e.target.value
			})
			if(e.target.value.trim().length){
				if(e.target.value.trim().length < 2){
					this.setState({
						errorUsername: true
					});
				}else{
					this.setState({
						errorUsername: false
					});
					this.checkUsername(e.target.value);
				}				
			}else{
				this.setState({
					errorUsername: false
				});
			}
			
		}else if(e.target.name == 'email'){
			this.setState({
				email: e.target.value
			})
			if(e.target.value.trim().length){
				this.isEmail(e.target.value);
			}else{
				this.setState({
					errorEmail: false
				});
			}

		}else if(e.target.name == 'mobile'){
			this.setState({
				mobile: e.target.value
			})
		}else if(e.target.name == 'password'){
			this.setState({
				password: e.target.value
			})
			if(e.target.value.trim().length){
				if(e.target.value.trim().length < 6){
					this.setState({
						errorPass: true
					});
				}else{
					this.setState({
						errorPass: false
					});
				}				
			}else{
				this.setState({
					errorPass: false,
					passwordLabel: 'Must be atleast 6 characters'
				});
			}
		}
	}
	clear = () => {
		this.setState({
			username: '',
			errorUsername: false,
			usernameLabel: 'Must be a minimum of 2 characters'
		})
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
		if(this.state.country && this.state.state && this.state.municipal){
			$.ajax({
	            url: 'http://localhost:8080/newSwitch/Codelet/CreateUser.php',
	            type: "POST",
	            data:  new FormData($('form')[0]),
	            cache: false,
		        contentType: false,
		        processData: false,
	            beforeSend: () => {
	            	this.setState({
	            		loading: true
	            	})
	            },                  
	            success: (data) => {
	            	if(data){
		            	console.log(data);
		            	let res = JSON.parse(data);
		            	console.log(res);
		            	if(res.state){
		            		let token = `"access=${res.token};"`;
		            		document.cookie = token;
		            		if(this.getCookie('access')){
								setTimeout(() => {
				            		this.setState({
				            			loading: false,
				            			success: true
				            		});
				            		console.log(data);
				            	},3000);
		            		}		
			            	console.log(data);
		            	}else{
							if(res.option == 'Username'){
								this.setState({
									errorUsername: true,
									usernameLabel: res.error,
								});
							}
							else if(res.option == 'Email'){
								this.setState({
									errorEmail: true,
									emailLabel: res.error
								});
							}
							else if(res.option == 'Password'){
								this.setState({
									errorPass: true,
									passwordLabel: res.error
								});
							}
							else if(res.option == 'Country'){
								this.setState({
									countryLabel: res.error 
								});
							}
							else if(res.option == 'State'){
								this.setState({
									stateLabel: res.error
								});
							}
							else if(res.option == 'Municipal'){
								this.setState({
									municipalLabel: res.error
								});
							}
							else{
								this.setState({
									errorFile: true,
									fileLabel: res.error 
								});
							}
		            	}
		            	setTimeout(() => {
		            		this.setState({
		            			loading: false
		            		});
		            		if(res.option != 'Country' && res.option != 'State' && res.option != 'Municipal'){
		            			this.reverse();
		            		}else{
		            			this.slide();
		            		}
		            	},3000);
		            }
	            },
	            error: (error) =>{
		            // alert(error);
		            // console.log(error);
		            // alert(error);
	            }
	        });
		}
	}
	show = () => {
		this.setState({
			show: !this.state.show
		})
	}
	clearEmail = () => {
		this.setState({
			email: '',
			errorEmail: false
		})
	}
	clearMobile = () => {
		this.setState({
			mobile: ''
		})
	}
	clearPassword = () =>{
		this.setState({
			password: '',
			errorPass: false,
			passwordLabel: 'Must be atleast 6 characters'
		})
	}
	handleOnChange = (e) => {
		this.setState({
			file: URL.createObjectURL(e.target.files[0]),
			input_file: e.target.value
		})
		// if(e.target.value.trim().length){
			if(e.target.files[0]){
				this.setState({
					errorFile: false
				});
			}else{
				this.setState({
					errorFile: true
				});
			}				
		// }else{
		// 	this.setState({
		// 		errorUsername: false
		// 	});
		// }
	}
	isEmail = email => {
        var m_format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!email.match(m_format)){
        	this.setState({
        		errorEmail: true,
        		emailLabel: 'Format must be example@example.domain'
        	});
        }
        else{ 
	        this.setState({
        		errorEmail: false,
        	});      	
        	this.emailConfirmation(email)
        }
	}
	getCountry = () => {
		$.post("http://localhost:8080/newSwitch/Codelet/getCountry.php",
		    {
		        country: 'country'
		    },
		   (data, status) => {
				//check if data is array first
				let countries = JSON.parse(data);
				this.setState({
					countries
				});
		    }
	    );
	}
	selectCountry = (e) => {
		this.setState({
			country: e.target.value 
		});
		$.ajax({
	            url: 'http://localhost:8080/newSwitch/Codelet/selectCountry.php',
	            type: "POST",
	            data: {country: e.target.value},
	            beforeSend: () =>{
	            	this.setState({
	            		states: [],
	            		municipals: []
	            	});
	            	console.log(e.target.value)
	            },                    
	            success: (data) => {
	            	if(data){
	            		let states = JSON.parse(data);
						this.setState({
							states
						});
	            	}					
	            },
	            error: (error) => {

	            }
        });
	}
	selectState = (e) => {
		this.setState({
			state: e.target.value 
		});
		$.ajax({
            url: 'http://localhost:8080/newSwitch/Codelet/selectState.php',
            type: "POST",
            data: {country: this.state.country, state: e.target.value},
            beforeSend: () => {
            	this.setState({
            		municipals: []
            	});
            },                    
            success: (data) => {
            	if(data){
            		let municipals = JSON.parse(data);
					this.setState({
						municipals
					});
            	}
				
            },
            error: (error) => {

            }
        });
	}
	selectMunicipal = (e) => {
		this.setState({
			municipal: e.target.value
		});
	}
	validate = () => {
		const m_format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		let name, pass, email = false;
		if(!this.state.username.trim().length || this.state.username.trim().length < 2 || this.state.errorUsername){
			name = true;
			this.setState({
				errorUsername: true,
			});
		}else{
			name = false;
			this.setState({
				errorUsername: false,
				usernameLabel: 'Must be a minimum of 2 characters'
			});
		}
		if(this.state.password.trim().length < 6 || this.state.errorPass){
			pass = true;
			this.setState({
				errorPass: true
			});
		}else{
			pass = false;
			this.setState({
				errorPass: false,
				passwordLabel: 'Must be atleast 6 characters'
			});
		}
		// if(!this.state.file){
		// 	file = true;
		// 	this.setState({
		// 		errorFile: true
		// 	});
		// }else{
		// 	file = false;
		// 	this.setState({
		// 		errorFile: false
		// 	});
		// }
		if(!this.state.email.match(m_format) || this.state.errorEmail){
			email = true;
        	this.setState({
        		errorEmail: true
        	});
        }else{
        	email = false;
        	this.setState({
        		errorEmail: false
        	});
        }
		// this.isEmail(this.state.email);
		if(name || pass || email){
			return true
		}
		return false
	}

	slide = () => {
		if(!this.validate()){
			$(".container-first").fadeOut("slow");
			$(".container-second").slideDown("slow");
			this.getCountry();
		}
				
	}
	reverse = () => {
		$(".container-first").fadeIn("slow");
		$(".container-second").slideUp("slow");
	}
	render(){
		if(!this.state.success){
			let labelSize = '0.8rem';
			let status = this.state.loading ? <span className="spinner-border spinner-border-sm"></span> : <b>Create</b> ;
			let disabled = this.state.loading ? true : false ;
			let input = this.state.show ? 'text' : 'password';
			let icon = this.state.show ? 'eye-slash' : 'eye';
			let title = this.state.show ? 'Hide' : 'Show';
			let display = this.state.username.trim().length || this.state.errorUsername ? 'block' : 'none' ;
			let email_display = this.state.email.trim().length || this.state.errorEmail? 'block' : 'none' ;
			let file_display = this.state.errorFile ? 'block' : 'none' ;
			let password_display = this.state.password.trim().length || this.state.errorPass? 'block' : 'none' ;
			let img = this.state.file ? <img src={this.state.file} width='100' height='100' alt='preview'/> : '';
			let namecolor = this.state.errorUsername ? 'red' : '#355664' ;
			let emailcolor = this.state.errorEmail ? 'red' : '#355664' ;
			let passcolor = this.state.errorPass ? 'red' : '#355664' ;
			let filecolor = this.state.errorFile ? 'red' : '#355664' ;
			let countries = this.state.countries.map((country,i) => {
				return <option value={country} key={i}>{country}</option>
			});
			let states = this.state.states.map((state,i) => {
				return <option value={state} key={i}>{state}</option>
			});
			let municipals = this.state.municipals.map((municipal,i) => {
				return <option value={municipal} key={i}>{municipal}</option>
			});
			let style = {
				display: display,
				zIndex: 1,
				color: namecolor,
				fontSize: labelSize
			}
			let email = {
				display: email_display,
				zIndex: 1,
				color: emailcolor,
				fontSize: labelSize
			}
			let file = {
				display: file_display,
				zIndex: 1,
				color: filecolor,
				fontSize: labelSize
			}
			let password = {
				display: password_display,
				zIndex: 1,
				color: passcolor,
				fontSize: labelSize
			}
			return(
				<div className= 'col-8-s'>
					<form name='upload' encType='multipart/form-data' onSubmit={this.onSubmit}>
						<div className= 'c-container-2 shadow'>
							<div className= 'container-first'>
								<div className='hide-large hide-medium text-center head-logo'><b> SWITCH</b></div>
								<div className= 'row c-container-3'>
									<div className= 'col-2'>
										<span className='span-icon'>
											<FontAwesomeIcon icon='user' color='#355664'/>
										</span>
									</div>
									<div className= 'col-10 div-head'>
										<b>Personal Info</b>
									</div>
								</div>
								<div className= 'c-container-4'>
									<div className='user-div'>
										<label htmlFor='username' style={style}>Username <span>({this.state.usernameLabel})</span></label>
										<div className="input-group mb-3">
										    <div className="input-group-prepend">
										        <span className="input-group-text"><FontAwesomeIcon icon='user' color='gray'/></span>
										    </div>
										    <input type="text" name='username' id='username' className="form-control" onChange={this.onChange} 
										    	placeholder='Username' value={this.state.username} onBlur={this.onBlur}/>
										    <div className="input-group-append">
											    <span className="input-group-text" onClick={this.clear} style={style}><FontAwesomeIcon icon='times' color='gray' /></span> 
											</div>
									    </div>
								    </div>
								    <div className='user-div'>
									    <label htmlFor='email' style={email}>Email ({this.state.emailLabel})</label>
									    <div className="input-group mb-3">
										    <div className="input-group-prepend">
										        <span className="input-group-text"><FontAwesomeIcon icon='envelope' color='gray'/></span>
										    </div>
										    <input type="text" name='email' id='email' className="form-control" onChange={this.onChange} placeholder='Email' value={this.state.email} required />
										    <div className="input-group-append">
											    <span className="input-group-text" onClick={this.clearEmail} style={email}><FontAwesomeIcon icon='times' color='gray' /></span> 
											</div>
									    </div>
								    </div>
								    <div className='user-div'>
									    <label htmlFor='password' style={password}>Password ({this.state.passwordLabel})</label>
									    <div className="input-group mb-3 shadow">
										    <div className="input-group-prepend">
										        <span className="input-group-text"><FontAwesomeIcon icon='lock' color='gray'/></span>
										    </div>
										    <input type={input} name='password' id='password' className="form-control" onChange={this.onChange} placeholder='Password' 
										    value={this.state.password}/>
										    <div className="input-group-append">
											    <span className="input-group-text" onClick={this.show} title={title}><FontAwesomeIcon icon={icon} color='gray' /></span> 
											    <span className="input-group-text" onClick={this.clearPassword} style={password}><FontAwesomeIcon icon='times' color='gray' /></span> 
											</div>
									    </div>
								    </div>
								    <div className='user-div'>
									    <label htmlFor='upload-btn' style={file}>{this.state.fileLabel}</label>
									    <div className="row n-row">
										    <div className="col">
										    </div>
										    <div className="col text-center next" onClick={this.slide}>
											    <button type='button' className='btn btn-primary b-marg'><b>Next</b></button>
										    </div>
										    <div className="col">
										    </div>
									    </div>
								    </div>
								    <br/>
								    <hr/>
								    <div className="row n-row">
									    <div className="col text-center" onClick={this.slide}>
										    <NavLink to='/login'>
												<button type="button" className="btn btn-primary btn-change">
												    Login
												</button>
											</NavLink>	   
									    </div>
								    </div>
								    <div className="modal fade" id="myModal">
									    <div className="modal-dialog modal-lg">
										    <div className="modal-content">
										        <div className="modal-header">
											        <span className="modal-title"><b>Upload Profile Picture</b></span>
											        <button type="button" className="close" data-dismiss="modal">&times;</button>
										        </div>
										        <div className="modal-body">
											        <div className="row m-row">
												        <div className="col-6 m-col-1">
													        
													        <label htmlFor='file'>
														        <div className="col m-col-1a">
															        <FontAwesomeIcon icon='desktop' /><br/>
															        <b>Upload Photo</b><br/>
															        <span>Browse your computer</span>
														        </div>
													        </label>
													        <input type='file' name='file' id='file' style={{display: 'none'}} onChange={this.handleOnChange} value={this.state.input_file}/>													        
												        </div>
												        <div className="col-6 m-col-2">
													        <div className="col m-col-2c">
																<div className="col m-col-2a">
																	<b>Preview image</b>
																</div>
																<div className="col m-col-2b">
																	{img}
																</div>
															</div>
												        </div>
											        </div>
										        </div>

										    </div>
									    </div>
									</div>
								</div> 
							</div>
								<div className="container-second">
									<div className='hide-large hide-medium text-center head-logo'><b> SWITCH</b></div>
								<div className= 'row c-container-5'>
									<span title="Back" onClick={this.reverse}><FontAwesomeIcon icon='arrow-circle-down' color='#355664'/></span>
								</div>
									<div className= 'row c-container-3'>
										<div className= 'col-2'>
											<span className='span-icon'>
												<FontAwesomeIcon icon='map-marker-alt' color='#355664'/>
											</span>
										</div>
										<div className= 'col-10 div-head'>
											<b>Location</b>
										</div>
									</div>
									<div className= 'c-container-4'>
										<label htmlFor='country'>{this.state.countryLabel}</label>
										<div className="input-groups shadow">
											<select name="country" className="custom-select" id='country' onChange={this.selectCountry}>
											    <option selected disabled>Current Country</option>
											    {countries}
											</select>
											</div>
										<label htmlFor='state'>{this.state.stateLabel}</label>
										<div className="input-groups shadow">
											<select name="state" className="custom-select" id='state' onChange={this.selectState}>
											    <option selected disabled>Current State</option>
											    {states}
											</select>
										</div>
										<label htmlFor='municipal'>{this.state.municipalLabel}</label>
										<div className="input-groups shadow">
											<select name="municipal" className="custom-select" id='municipal' onChange={this.selectMunicipal}>
											    <option selected disabled>Current Municipal</option>
											    {municipals}
											</select>
										</div>
										<div className="row">
											<div className="col t-col">
												<b>
													By clicking the Create button below you have hereby agreed to 
													Switch's cookies policies and Terms and Conditions
												</b>
											</div>
										</div>
										<div className="row">
											<div className="col s-col">
												<button type="submit" className="btn btn-primary btn-changed" disabled={disabled}>
												    {status}
												</button>
											</div>
										</div>
										<div className="row n-row">
										    <div className="col text-center" onClick={this.slide}>
											    <NavLink to='/login'>
													<button type="button" className="btn btn-primary btn-change">
													    <b>Login</b>
													</button>
												</NavLink>	   
										    </div>
									    </div>
									</div>
								</div>
							
						</div>
					</form>
				</div>
			);
		}else{
			return(
				<Redirect to={{pathname: '/home', state: {from: this.props.location.pathname}}} />
			)
		}
	}
}