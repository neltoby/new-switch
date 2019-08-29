import React, { Component,Fragment } from 'react';
// import {NavLink} from 'react-router-dom';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Headers.css';
import {Switch, Route, Redirect, NavLink } from 'react-router-dom';
import Home from './Home';
import Post from './Post';
import Notification from './Notification';
import Messages from './Messages';
import Profile from './Profile';
import Logout from './Logout';
import Header_Modal from './Header_Modal';

class Headers extends Component {
	state = {
		pix: '',
		search: '',
	}

	onHover = () => {
		// document.getElementById('content').style.display='block';
		$('.dropdown-menu-container').fadeIn();
	}

	onBlur = () => {
		$('.dropdown-menu-container').fadeOut();
	}
	onChange = (e) => {

	}
	isJson = (item) => {
		item = typeof item !== 'string' ? JSON.stringify(item) : item ;
		try{
			item = JSON.parse(item);
		} catch (e) {
			return false
		}
		if((typeof item === 'object' || Array.isArray(item)) && item !== null){
			return item
		}
	}
	getCookie = (cname) => {
		if(cname == ''){
			return false;
		}else{
		    let name = cname + "=";
		    let ca = document.cookie.split(';');
		    for(let i=0; i<ca.length; i++) {
		        let c = ca[i];
		        while (c.charAt(0)==' ') c = c.substring(1);
		        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		    }
		    return false;
		}
	}
	setCookie = (cname, cvalue, exdays) => {
	    let d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    let expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	    this.setState({
	    	token: cvalue
	    });
	}
	getPix = (i) => {
		let access = this.getCookie('access');
		$.ajax({
            url: 'http://localhost:8080/newSwitch/Codelet/getPix.php',
            type: "POST",
            headers: {"Authorization": `${access}`},
            beforeSend: () => {
            	
            },                    
            success: (data) => {	
	            console.log(data);			
				if(data){
				   	let res = this.isJson(data);
				   	if(res){
				   		if(access !== res.token){
							this.setCookie('access',res.token,8);
						}
						this.setState({
							pix: res.pix
						});
						console.log(data)
					}
				}
            },
            error: (error) => {

            }
        })
	}

	updatePix = (pix) => {
		this.setState({
			pix
		});
	}

	componentDidMount() {
		this.getPix();
	}
	openIntModal = () => {
		$('#intModal').fadeIn();
	}

	render(){
		// nav navbar-nav justify-content-end
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.pix}`;
		let name = localStorage.set_name;
		let comp = [this.state.pix, this.updatePix];
		return(
			<Fragment>
				<div className='container-fluid text-center'>
					<div className='sticky-top st-top'>
						<div className='row'>
							<div className='col-5 c5'>
								<div className="input-group mb-3 ipt-grp">
								    <input type="search" name='search' id='search' className="form-control" onChange={this.onChange} 
								    	placeholder='Search ...' value={this.state.search} />
								    <div className="input-group-append input-search">
									    <span className="input-group-text"><FontAwesomeIcon icon='search' color='#7289da' /></span> 
									</div>
							    </div>
							</div>
							<div className='col-7'>
					            <ul className='navv'>
						            <li className="nav-item create-item item-pad">Create
						                <ul className='create'>
							                <li className='create-items'><NavLink to='/createportal' className='c-items'><b>Portal</b></NavLink></li>
							                <li className='create-items'><NavLink to='/creategroup' className='c-items'><b>Group</b></NavLink></li>
						                </ul>
					                </li>
					                <li className="nav-item"><NavLink to='/' className='nav-link item-pad-icon'><FontAwesomeIcon icon='home' color='#7289da' size='lg' /></NavLink>
					                <span className="tooltiptext">Home</span>
					                </li>
					                <li className="nav-item"><NavLink to='/notification' className='nav-link item-pad-icon'><FontAwesomeIcon icon='bell' color='#7289da' size='lg' /></NavLink>
										<span className="tooltiptext">Notification</span>
					                </li>					                
					                <li className="nav-item dropdown-container" onClick={this.onHover}>          
						                <img src={src} width='45' height='45' className='img-circle' alt='profile_image'/><FontAwesomeIcon icon='caret-down' color='#7289da' size='lg' />
						                <ul className='dropdown-menu-container' onMouseOver={this.onHover} onMouseLeave={this.onBlur}>
							                <li className='rows'>
												<span className='col-sm-10'>YOUR ACCOUNT</span>
							                </li>
							                <li className='row'>
												<span className='col-sm-4'><NavLink to={`/profile/${name}`} className='navlink'><FontAwesomeIcon icon={['far', 'address-card']} color='gray' /></NavLink></span>
												<span className='col-sm-8'><NavLink to={`/profile/${name}`} className='navlink'>Profile</NavLink></span>
							                </li>
							                <li className='row'>
												<span className='col-sm-4'><NavLink to='/message' className='navlink'><FontAwesomeIcon icon='comment-alt' color='gray'/></NavLink></span>
												<span className='col-sm-8'><NavLink to='/message' className='navlink'>Messages</NavLink></span>
							                </li>
							                <li className='row'>
												<span className='col-sm-4'><NavLink to='/logout' className='navlink'><FontAwesomeIcon icon='sign-out-alt' color='gray'/></NavLink></span>
												<span className='col-sm-8'><NavLink to='/logout' className='navlink'>Logout</NavLink></span>
							                </li>
							                <li className='rows'>
												<span className='col-sm-10'>PACKAGES</span>
							                </li>
							                <li className='row'>
												<span className='col-sm-4'><FontAwesomeIcon icon='briefcase' color='#f43b26'/></span>
												<span className='col-sm-8'><NavLink to='/portal' className='navlink'>Portal</NavLink></span>
							                </li>
							                <li className='row'>
												<span className='col-sm-4'><FontAwesomeIcon icon='user-friends' color='#00cc00'/></span>
												<span className='col-sm-8'><NavLink to='/group' className='navlink'>Group</NavLink></span>
							                </li>
							                <li className='row'>
												<span className='col-sm-4'><FontAwesomeIcon icon='comment-alt' color='#5787c2'/></span>
												<span className='col-sm-8'><NavLink to='/subscription' className='navlink'>Subscription</NavLink></span>
							                </li>
							                <li className='row' onClick={this.openIntModal}>
												<span className='col-4'>							
												<FontAwesomeIcon icon='heart' color='tomato'/></span>
												<span className='col-8 navlink'>
												Interest</span>
							                </li>
						                </ul>						              
							        </li>
					            </ul>
				            </div>
			            </div>
			        </div>  

			        <Switch>
				        <Route exact path="/" render={() => (
	                    	<Redirect to='/home' />
	                    )}/>
                        <Route path="/home" component={Home}/>                    
                        <Route path="/post" component={Post}/>
                        <Route path="/notification" component={Notification}/>
                        <Route path="/profile/:name" render={({match}) => {
                        	if(localStorage.set_name === match.params.name){
                        		return(
	                        		<Profile />
                        		);
                        	}else{
                        		return(
	                        		<Profile name={match.params.name}/>
                        		);
                        	}
                        }}/>
                        <Route path="/logout" component={Logout}/>
                        <Route path="/message" component={Messages}/>
                        <Route path="/login" render={() => (
                        	<Redirect to='/home' />
                        )}/>
                        <Route path="/passwordrecovery" render={() => (
                        	<Redirect to='/home' />
                        )}/>
                        <Route path="/createaccount" render={() => (
                        	<Redirect to='/home' />
                        )}/>
                    </Switch>
					<Header_Modal />
                </div>  
            </Fragment>
		);
	};
}

export default Headers;